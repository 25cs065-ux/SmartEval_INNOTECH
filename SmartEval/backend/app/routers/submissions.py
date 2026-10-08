from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import os
import shutil
import uuid
from datetime import datetime, timezone

from app.database import get_db
from app.models.domain import StudentSubmission, Exam, QuestionEvaluation
from app.schemas.schemas import SubmissionResponse, QuestionEvaluationResponse, EvaluationOverrideRequest
from app.services.ai_evaluation_service import evaluate_submission

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/exam/{exam_id}", response_model=SubmissionResponse)
async def upload_submission(
    exam_id: int, 
    student_name: str = Form(...),
    student_roll_number: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    exam_result = await db.execute(select(Exam).where(Exam.id == exam_id))
    exam = exam_result.scalars().first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
        
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    submission = StudentSubmission(
        exam_id=exam_id,
        student_name=student_name,
        student_roll_number=student_roll_number,
        original_file_url=file_path,
        submission_status="processing",
        total_marks=exam.total_marks
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    
    # Process asynchronously or synchronously depending on requirements
    # For demo, let's keep it sync for simplicity of getting an immediate response
    # Or we can return processing and let frontend poll. The prompt says "AI visibly processes".
    # I will provide a separate endpoint to trigger evaluation so frontend can show steps.
    
    return submission

@router.get("/exam/{exam_id}", response_model=List[SubmissionResponse])
async def get_submissions_for_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentSubmission).where(StudentSubmission.exam_id == exam_id))
    return result.scalars().all()

@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(submission_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentSubmission).where(StudentSubmission.id == submission_id))
    submission = result.scalars().first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@router.post("/{submission_id}/evaluate")
async def trigger_evaluation(submission_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentSubmission).where(StudentSubmission.id == submission_id))
    submission = result.scalars().first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Call AI service
    await evaluate_submission(submission.id, db)
    
    await db.refresh(submission)
    return {"status": "success", "submission": submission}

@router.get("/{submission_id}/evaluations", response_model=List[QuestionEvaluationResponse])
async def get_submission_evaluations(submission_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(QuestionEvaluation).where(QuestionEvaluation.submission_id == submission_id))
    return result.scalars().all()

@router.put("/evaluations/{evaluation_id}/override", response_model=QuestionEvaluationResponse)
async def override_evaluation(evaluation_id: int, data: EvaluationOverrideRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(QuestionEvaluation).where(QuestionEvaluation.id == evaluation_id))
    evaluation = result.scalars().first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
        
    evaluation.teacher_marks = data.new_marks
    evaluation.final_marks = data.new_marks
    if data.reason:
        evaluation.feedback = f"{evaluation.feedback}\n\nTeacher Override: {data.reason}"
        
    await db.commit()
    await db.refresh(evaluation)
    
    # Recalculate submission total
    sub_result = await db.execute(select(StudentSubmission).where(StudentSubmission.id == evaluation.submission_id))
    submission = sub_result.scalars().first()
    
    evals_result = await db.execute(select(QuestionEvaluation).where(QuestionEvaluation.submission_id == submission.id))
    evals = evals_result.scalars().all()
    
    total_obtained = sum([e.final_marks for e in evals if e.final_marks is not None])
    submission.obtained_marks = total_obtained
    if submission.total_marks:
        submission.percentage = (total_obtained / submission.total_marks) * 100
        
    await db.commit()
    
    return evaluation
