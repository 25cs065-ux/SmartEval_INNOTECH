# SmartEval – AI-Based Exam Paper Checking System

SmartEval is a professional AI-assisted examination evaluation platform that uses multimodal AI (Google Gemini) to evaluate handwritten student answer sheets against teacher-defined marking schemes.

## Features
- Create unlimited independent exams
- Define a comprehensive marking scheme (rubric, keywords, required concepts) for each exam
- Upload handwritten student answer sheets
- AI-based evaluation with question-wise score, matched concepts, missing concepts, and feedback
- Professional visual evaluation workspace
- Teacher override capability for AI marks
- Automated class analytics and score distribution
- Demo data seeding for immediate stage demonstrations

## Prerequisites
- Python 3.11+
- Node.js 18+
- Gemini API Key

## Project Structure
- `/backend`: FastAPI Python application with SQLite (SQLAlchemy async)
- `/frontend`: React TypeScript application using Vite, Tailwind CSS, shadcn/ui

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
pip install "sqlalchemy[asyncio]" python-dotenv greenlet

# Environment Variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Demo Data Setup
To populate the database with sample exams and student evaluations for the live demo:
```bash
# Ensure backend venv is active
cd backend
python seed.py
```

### 3. Run Backend
```bash
cd backend
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

### 4. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Demo Credentials & Usage
There is no hardcoded authentication wall for the demo.
1. Open `http://localhost:5173`
2. You will see the teacher dashboard with pre-seeded demo exams.
3. Open "Computer Networks Mid-Semester".
4. View the "Marking Scheme" tab to see the predefined 10 questions.
5. Click "Evaluate Answer Sheet", upload a sample PDF/image, enter student details, and start the evaluation.
6. Once complete, view the result, click on questions to see the AI feedback, and test the "Override Marks" feature.

## Switching to PostgreSQL
The project uses SQLite by default for zero-config local development. To switch to PostgreSQL (Supabase):
1. In `backend/.env`, change `DATABASE_URL` to your PostgreSQL connection string:
`DATABASE_URL=postgresql+asyncpg://user:password@host/dbname`
2. Install asyncpg: `pip install asyncpg`
