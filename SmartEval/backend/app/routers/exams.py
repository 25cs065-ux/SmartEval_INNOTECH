from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List

from app.database import get_db
from app.models.domain import Exam, ExamQuestion
from app.schemas.schemas import ExamCreate, ExamResponse, QuestionCreate, QuestionResponse

router = APIRouter()

@router.get("", response_model=List[ExamResponse])
async def get_exams(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exam).order_by(Exam.id.desc()))
    return result.scalars().all()

@router.get("/dashboard-stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    from app.models.domain import StudentSubmission
    
    exams_result = await db.execute(select(func.count(Exam.id)))
    total_exams = exams_result.scalar() or 0
    
    subs_result = await db.execute(select(StudentSubmission))
    submissions = subs_result.scalars().all()
    
    papers_evaluated = len([s for s in submissions if s.submission_status == "completed"])
    students_evaluated = len(set([s.student_roll_number for s in submissions if s.submission_status == "completed"]))
    
    percentages = [s.percentage for s in submissions if s.percentage is not None and s.submission_status == "completed"]
    avg_score = sum(percentages) / len(percentages) if percentages else 0
    
    return {
        "total_exams": total_exams,
        "papers_evaluated": papers_evaluated,
        "students_evaluated": students_evaluated,
        "average_score": round(avg_score, 1)
    }

@router.post("", response_model=ExamResponse)
async def create_exam(exam: ExamCreate, db: AsyncSession = Depends(get_db)):
    db_exam = Exam(**exam.model_dump())
    db.add(db_exam)
    await db.commit()
    await db.refresh(db_exam)
    return db_exam

@router.get("/{exam_id}", response_model=ExamResponse)
async def get_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.get("/{exam_id}/questions", response_model=List[QuestionResponse])
async def get_exam_questions(exam_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExamQuestion).where(ExamQuestion.exam_id == exam_id).order_by(ExamQuestion.display_order))
    return result.scalars().all()

@router.post("/{exam_id}/marking-scheme", response_model=List[QuestionResponse])
async def save_marking_scheme(exam_id: int, questions: List[QuestionCreate], db: AsyncSession = Depends(get_db)):
    # Delete existing questions
    await db.execute(ExamQuestion.__table__.delete().where(ExamQuestion.exam_id == exam_id))
    
    # Add new questions
    db_questions = []
    total_marks = 0
    for q in questions:
        db_q = ExamQuestion(**q.model_dump(), exam_id=exam_id)
        db.add(db_q)
        db_questions.append(db_q)
        total_marks += q.max_marks
        
    # Update total marks in exam
    result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = result.scalars().first()
    if exam:
        exam.total_marks = total_marks
        
    await db.commit()
    
    # Fetch again to get IDs
    result = await db.execute(select(ExamQuestion).where(ExamQuestion.exam_id == exam_id).order_by(ExamQuestion.display_order))
    return result.scalars().all()

@router.get("/{exam_id}/analytics")
async def get_exam_analytics(exam_id: int, db: AsyncSession = Depends(get_db)):
    from app.models.domain import StudentSubmission, QuestionEvaluation
    
    # Basic analytics
    submissions_result = await db.execute(select(StudentSubmission).where(StudentSubmission.exam_id == exam_id))
    submissions = submissions_result.scalars().all()
    
    total_students = len(submissions)
    evaluated_students = len([s for s in submissions if s.submission_status == "completed"])
    
    marks = [s.obtained_marks for s in submissions if s.obtained_marks is not None]
    avg_marks = sum(marks) / len(marks) if marks else 0
    highest = max(marks) if marks else 0
    lowest = min(marks) if marks else 0
    
    # Calculate pass percentage (assuming 40% is pass)
    passed = len([m for m in marks if m >= (sum([s.total_marks for s in submissions if s.total_marks is not None][:1] or [0]) * 0.4)])
    pass_rate = (passed / evaluated_students * 100) if evaluated_students else 0
    
    distribution = [
        {"range": "0-20%", "count": 0},
        {"range": "21-40%", "count": 0},
        {"range": "41-60%", "count": 0},
        {"range": "61-80%", "count": 0},
        {"range": "81-100%", "count": 0},
    ]
    
    for s in submissions:
        if s.percentage is not None:
            if s.percentage <= 20: distribution[0]["count"] += 1
            elif s.percentage <= 40: distribution[1]["count"] += 1
            elif s.percentage <= 60: distribution[2]["count"] += 1
            elif s.percentage <= 80: distribution[3]["count"] += 1
            else: distribution[4]["count"] += 1
            
    return {
        "total_students": total_students,
        "evaluated_students": evaluated_students,
        "average_marks": round(avg_marks, 2),
        "highest_marks": highest,
        "lowest_marks": lowest,
        "pass_rate": round(pass_rate, 2),
        "distribution": distribution
    }
