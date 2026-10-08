from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=utcnow)
    
    exams = relationship("Exam", back_populates="teacher")

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    name = Column(String, nullable=False)
    subject = Column(String)
    exam_code = Column(String)
    exam_date = Column(String)
    academic_year = Column(String)
    duration = Column(Integer)
    total_marks = Column(Float)
    description = Column(Text)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    teacher = relationship("Teacher", back_populates="exams")
    questions = relationship("ExamQuestion", back_populates="exam", cascade="all, delete-orphan")
    submissions = relationship("StudentSubmission", back_populates="exam", cascade="all, delete-orphan")

class ExamQuestion(Base):
    __tablename__ = "exam_questions"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    question_number = Column(String, nullable=False)
    max_marks = Column(Float, nullable=False)
    keywords = Column(Text)
    expected_answer = Column(Text)
    required_concepts = Column(Text)
    rubric = Column(Text)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    exam = relationship("Exam", back_populates="questions")
    evaluations = relationship("QuestionEvaluation", back_populates="question", cascade="all, delete-orphan")

class StudentSubmission(Base):
    __tablename__ = "student_submissions"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    student_name = Column(String, nullable=False)
    student_roll_number = Column(String, nullable=False)
    original_file_url = Column(String)
    submission_status = Column(String, default="pending")
    uploaded_at = Column(DateTime, default=utcnow)
    evaluated_at = Column(DateTime)
    total_marks = Column(Float)
    obtained_marks = Column(Float)
    percentage = Column(Float)
    
    exam = relationship("Exam", back_populates="submissions")
    evaluations = relationship("QuestionEvaluation", back_populates="submission", cascade="all, delete-orphan")

class QuestionEvaluation(Base):
    __tablename__ = "question_evaluations"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("student_submissions.id"))
    question_id = Column(Integer, ForeignKey("exam_questions.id"))
    ai_marks = Column(Float)
    teacher_marks = Column(Float)
    final_marks = Column(Float)
    max_marks = Column(Float)
    confidence = Column(Float)
    matched_concepts = Column(JSON)
    missing_concepts = Column(JSON)
    feedback = Column(Text)
    rubric_breakdown = Column(JSON)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    submission = relationship("StudentSubmission", back_populates="evaluations")
    question = relationship("ExamQuestion", back_populates="evaluations")
