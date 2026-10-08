from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class QuestionBase(BaseModel):
    question_number: str
    max_marks: float
    keywords: Optional[str] = None
    expected_answer: Optional[str] = None
    required_concepts: Optional[str] = None
    rubric: Optional[str] = None
    display_order: int = 0

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    exam_id: int
    
    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    name: str
    subject: Optional[str] = None
    exam_code: Optional[str] = None
    exam_date: Optional[str] = None
    academic_year: Optional[str] = None
    duration: Optional[int] = None
    total_marks: Optional[float] = None
    description: Optional[str] = None

class ExamCreate(ExamBase):
    pass

class ExamResponse(ExamBase):
    id: int
    teacher_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    student_name: str
    student_roll_number: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionResponse(SubmissionBase):
    id: int
    exam_id: int
    original_file_url: Optional[str] = None
    submission_status: str
    uploaded_at: datetime
    evaluated_at: Optional[datetime] = None
    total_marks: Optional[float] = None
    obtained_marks: Optional[float] = None
    percentage: Optional[float] = None

    class Config:
        from_attributes = True

class QuestionEvaluationBase(BaseModel):
    ai_marks: Optional[float] = None
    teacher_marks: Optional[float] = None
    final_marks: Optional[float] = None
    max_marks: float
    confidence: Optional[float] = None
    matched_concepts: Optional[List[str]] = None
    missing_concepts: Optional[List[str]] = None
    feedback: Optional[str] = None
    rubric_breakdown: Optional[Any] = None

class QuestionEvaluationResponse(QuestionEvaluationBase):
    id: int
    submission_id: int
    question_id: int

    class Config:
        from_attributes = True

class EvaluationOverrideRequest(BaseModel):
    new_marks: float
    reason: Optional[str] = None
