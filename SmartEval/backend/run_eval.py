import asyncio
from app.database import async_session
from app.services.ai_evaluation_service import evaluate_submission

async def main():
    async with async_session() as session:
        # get first submission
        from sqlalchemy import select
        from app.models.domain import StudentSubmission
        result = await session.execute(select(StudentSubmission))
        submission = result.scalars().first()
        if not submission:
            print("No submissions found")
            return
        
        print("Evaluating submission:", submission.id)
        await evaluate_submission(submission.id, session)
        print("Status:", submission.submission_status)

asyncio.run(main())
