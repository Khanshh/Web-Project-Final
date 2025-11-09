# FastAPI Backend Base

## Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file and configure environment variables

4. Run server:
```bash
uvicorn app.main:app --reload --port 5000
```

Or:
```bash
python -m app.main
```

## API Documentation

- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point
│   ├── config.py            # Configuration
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   └── utils/               # Helper functions
├── scripts/                 # Utility scripts
├── tests/                   # Tests
├── venv/                    # Virtual environment
├── .env                     # Environment variables
├── requirements.txt         # Dependencies
└── README.md
```
