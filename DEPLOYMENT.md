# Deployment Guide to Render

You can deploy this application in two ways:
1.  **Automated (Recommended)**: Using the `render.yaml` Blueprint.
2.  **Manual**: Setting up each service individually.

---

## Option 1: Automated Deployment (Blueprint)

This method automatically creates the Database, Backend, and Frontend services.

1.  Push your code to **GitHub**.
2.  Go to the [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Blueprint**.
4.  Connect your GitHub repository.
5.  Render will detect the `render.yaml` file.
6.  Click **Apply**.
7.  Wait for the initial deployment to finish.
8.  **Configure Environment Variables** (after services are created):
    -   Go to the **Backend service** (`fastapi-backend`) -> Environment
    -   Set `FRONTEND_URL` to your frontend URL (e.g., `https://nextjs-frontend.onrender.com`)
    -   Go to the **Frontend service** (`nextjs-frontend`) -> Environment
    -   Set `NEXT_PUBLIC_API_BASE` to your backend URL (e.g., `https://fastapi-backend.onrender.com`)
9.  **Redeploy both services** to apply the new environment variables.

**Note on Database Costs**: Render's Managed PostgreSQL is a paid service (after any trial period). You may need to upgrade your plan.

---

## Option 2: Manual Deployment

If you prefer to set up services one by one or want to use a free external database.

### 1. Database (PostgreSQL)
1.  Create a **New PostgreSQL** database on Render.
2.  Name: `postgres-db`
3.  Copy the **Internal Database URL** (for backend) or **External Database URL** (setup).

### 2. Backend (FastAPI)
1.  Click **New +** -> **Web Service**.
2.  Connect your repo.
3.  **Name**: `fastapi-backend`
4.  **Root Directory**: `.` (or leave empty)
5.  **Environment**: `Python 3`
6.  **Build Command**: `pip install -r backend/requirements.txt`
7.  **Start Command**: `cd backend && gunicorn -k uvicorn.workers.UvicornWorker app.main:app`
8.  **Environment Variables**:
    -   `DATABASE_URL`: *Paste the Internal Database URL from step 1*
    -   `PYTHON_VERSION`: `3.10.0` (Recommended)
    -   `FRONTEND_URL`: *The URL of your deployed Frontend (e.g., https://nextjs-frontend.onrender.com) - Optional but recommended for CORS*

### 3. Frontend (Next.js)
1.  Click **New +** -> **Web Service**.
2.  Connect your repo.
3.  **Name**: `nextjs-frontend`
4.  **Root Directory**: `.` (or leave empty)
5.  **Environment**: `Node`
6.  **Build Command**: `cd frontend && npm install && npm run build`
7.  **Start Command**: `cd frontend && npm start`
8.  **Environment Variables**:
    -   `NEXT_PUBLIC_API_BASE`: *The URL of your deployed Backend (e.g., https://fastapi-backend.onrender.com)*

---

## Troubleshooting

-   **CORS Errors**: Ensure the Backend environment variable `FRONTEND_URL` is set if you used Option 2 (Manual). In Blueprint `render.yaml`, I handled this automatically, but for manual setup, you might need to add `FRONTEND_URL` to the Backend service pointing to your Frontend URL.
-   **Database Connection**: Ensure the `DATABASE_URL` is correct.
