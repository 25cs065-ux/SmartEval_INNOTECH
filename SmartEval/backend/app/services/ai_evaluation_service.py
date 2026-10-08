from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import os
import json
from datetime import datetime, timezone

from app.models.domain import StudentSubmission, ExamQuestion, QuestionEvaluation
from app.config import settings

from google import genai
from google.genai import types

def utcnow():
    return datetime.now(timezone.utc)

async def evaluate_submission(submission_id: int, db: AsyncSession):
    # Fetch submission
    result = await db.execute(select(StudentSubmission).where(StudentSubmission.id == submission_id))
    submission = result.scalars().first()
    if not submission:
        return
        
    # Fetch questions for the exam
    q_result = await db.execute(select(ExamQuestion).where(ExamQuestion.exam_id == submission.exam_id).order_by(ExamQuestion.display_order))
    questions = q_result.scalars().all()
    
    try:
        # Initialize Gemini client
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # Prepare image
        file_path = submission.original_file_url
        
        import base64
        with open(file_path, "rb") as f:
            file_bytes = f.read()
        
        mime_type = "image/jpeg"
        if file_path.lower().endswith(".pdf"):
            mime_type = "application/pdf"
        elif file_path.lower().endswith(".png"):
            mime_type = "image/png"
            
        questions_data = []
        for q in questions:
            questions_data.append({
                "question_number": q.question_number,
                "max_marks": q.max_marks,
                "keywords": q.keywords,
                "expected_answer": q.expected_answer,
                "required_concepts": q.required_concepts,
                "rubric": q.rubric
            })
            
        prompt = f"""
You are an expert AI Exam Evaluator.
Please evaluate the provided student answer sheet against the following marking scheme.
There are {len(questions)} questions in the marking scheme.

Marking Scheme:
{json.dumps(questions_data, indent=2)}

For each question in the marking scheme, locate the student's answer in the document, evaluate it based ONLY on the provided keywords, expected answer, required concepts, and rubric.
Do not use outside knowledge to award marks if it contradicts the rubric. Give partial marks as per the rubric. 
If the student made an arithmetic mistake but the method is correct, award partial marks if the rubric allows.
If a question is not attempted, award 0 marks.

CRITICAL DEDUCTION RULE: If an answer is incomplete (for example, if a chemical reaction, formula, or definition is asked and the student only writes half of it), YOU MUST DEDUCT MARKS. Even if the student mentions some correct keywords, if the overall answer does not make sense or is incomplete, they should NOT receive full marks. Strictly apply deductions for missing parts.

SPELLING AND GRAMMAR PENALTY: You MUST be extremely strict about spelling and grammar. If a student makes spelling mistakes, especially on technical keywords or important terms, you MUST deduct marks. A 5-mark question with spelling errors should NEVER receive 5/5. Deduct at least 0.5 or 1 mark for spelling errors depending on severity.

CONFIDENCE SCORE RULE: Your "confidence" score MUST reflect the readability of the handwriting and the clarity of the answer. 
- If the handwriting is messy, hard to read, or ambiguous, your confidence should be LOW (e.g., 0.3 to 0.6).
- If the answer is partially cut off or difficult to interpret, lower the confidence.
- Only return a confidence of 0.9 or 1.0 if the handwriting is perfectly legible and the student's intent is 100% clear.

Return a JSON array of evaluation objects. Each object must have this exact structure:
{{
  "question_number": "string",
  "max_marks": float,
  "awarded_marks": float,
  "confidence": float (0.0 to 1.0, indicating how confident you are in your evaluation),
  "matched_concepts": ["list of strings"],
  "missing_concepts": ["list of strings"],
  "feedback": "string (A strictly 1 or 2 line suggestion or reason for the awarded marks)",
  "rubric_breakdown": [
    {{
      "criterion": "string",
      "max_marks": float,
      "awarded_marks": float
    }}
  ]
}}

Ensure valid JSON output.
"""
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash", # Ultra-fast, generous Free Tier limits
            contents=[
                types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        response_text = response.text
        # Use regex to safely extract the JSON array from the response
        import re
        match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if match:
            response_text = match.group(0)
            
        evaluation_results = json.loads(response_text)
        
        total_obtained = 0
        
        for eval_data in evaluation_results:
            q_num = str(eval_data.get("question_number"))
            # Find matching question
            matched_q = next((q for q in questions if str(q.question_number) == q_num), None)
            if matched_q:
                awarded = eval_data.get("awarded_marks", 0)
                total_obtained += awarded
                
                evaluation = QuestionEvaluation(
                    submission_id=submission.id,
                    question_id=matched_q.id,
                    ai_marks=awarded,
                    teacher_marks=awarded, # initially teacher marks = ai marks
                    final_marks=awarded,
                    max_marks=matched_q.max_marks,
                    confidence=eval_data.get("confidence", 0.0),
                    matched_concepts=eval_data.get("matched_concepts", []),
                    missing_concepts=eval_data.get("missing_concepts", []),
                    feedback=eval_data.get("feedback", ""),
                    rubric_breakdown=eval_data.get("rubric_breakdown", [])
                )
                db.add(evaluation)
                
        submission.submission_status = "completed"
        submission.evaluated_at = utcnow()
        submission.obtained_marks = total_obtained
        if submission.total_marks:
            submission.percentage = (total_obtained / submission.total_marks) * 100
            
        await db.commit()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Evaluation error: {e}")
        submission.submission_status = "error"
        await db.commit()
