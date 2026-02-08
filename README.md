# FastAPI + Next.js CRUD

This project is a simple CRUD app with a FastAPI backend and a Next.js frontend. It supports listing, adding, updating, and deleting items stored in PostgreSQL.

## Backend (FastAPI)

1. Create a Postgres database (example name: `fastapi_app`).
2. Copy env file:

```bash
cp backend/.env.example backend/.env
```

3. Edit `backend/.env` with your Postgres credentials.
4. Install dependencies and run:

```bash
python -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt

# Run
uvicorn app.main:app --reload --app-dir backend --env-file backend/.env
```

Backend runs at `http://localhost:8000`.

## Frontend (Next.js)

1. Copy env file:

```bash
cp frontend/.env.local.example frontend/.env.local
```

2. Install deps and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## API Endpoints

- `GET /items`
- `GET /items/{id}`
- `POST /items`
- `PUT /items/{id}`
- `DELETE /items/{id}`
