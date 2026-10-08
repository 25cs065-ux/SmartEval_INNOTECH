# SmartEval Backend

## Setup
1. Create virtual environment: `python -m venv venv`
2. Activate: `.\venv\Scripts\Activate.ps1`
3. Install: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`
5. Run: `uvicorn app.main:app --reload`
