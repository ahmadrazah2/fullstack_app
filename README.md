# FastAPI + Next.js CRUD Application

A full-stack web application with user authentication and CRUD operations, built with FastAPI (backend) and Next.js (frontend), deployed on Render.

## 🚀 Live Demo

- **Frontend**: https://frontend-app-cobc.onrender.com
- **Backend API**: https://fast-api-k9zx.onrender.com
- **API Docs**: https://fast-api-k9zx.onrender.com/docs

## 📋 Features

- **User Authentication**: Register and login with JWT tokens
- **CRUD Operations**: Create, Read, Update, Delete items
- **Protected Routes**: Authentication required for item management
- **PostgreSQL Database**: Persistent data storage
- **Production Ready**: Deployed on Render with proper CORS and security

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Production database
- **Gunicorn + Uvicorn** - Production ASGI server
- **Passlib + Bcrypt** - Password hashing
- **Python-JOSE** - JWT token management

### Frontend
- **Next.js 14** - React framework
- **React** - UI library
- **Client-side routing** - Next.js App Router

## 📁 Project Structure

```
fullstack-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app & routes
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   ├── db.py            # Database connection
│   │   ├── deps.py          # Dependencies (auth)
│   │   └── utils.py         # Helper functions (JWT, hashing)
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── app/
│   │   ├── page.js          # Home page (items list)
│   │   ├── login/page.js    # Login page
│   │   ├── register/page.js # Register page
│   │   ├── layout.js        # Root layout
│   │   └── globals.css      # Global styles
│   ├── lib/
│   │   └── api.js           # API client functions
│   ├── package.json         # Node dependencies
│   └── .env.local.example   # Environment variables template
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

## 🚧 Deployment Issues & Solutions

During deployment to Render, we encountered and resolved several issues:

### 1. **Render Blueprint Validation Errors**

**Problem**: 
- `fromService.property: url` was invalid in `render.yaml`
- Database user `postgres` was rejected

**Solution**:
- Changed to manual deployment instead of Blueprint
- Used Render's UI to configure services separately
- Set environment variables manually after service creation

### 2. **Missing Authentication Dependencies**

**Problem**:
```
ModuleNotFoundError: No module named 'passlib'
```

**Solution**:
Added missing packages to `requirements.txt`:
```txt
passlib==1.7.4
bcrypt==4.0.1
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
```

### 3. **Next.js Build Error - useSearchParams**

**Problem**:
```
useSearchParams() should be wrapped in a suspense boundary
```

**Solution**:
Wrapped the component using `useSearchParams()` in a Suspense boundary:
```javascript
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  // ... component logic
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
```

### 4. **Bcrypt Compatibility Issue**

**Problem**:
```
AttributeError: module 'bcrypt' has no attribute '__about__'
ValueError: password cannot be longer than 72 bytes
```

**Solution**:
Pinned bcrypt to version 4.0.1 (last version compatible with passlib 1.7.4):
```txt
bcrypt==4.0.1
passlib==1.7.4
```

### 5. **CORS Policy Blocking Requests**

**Problem**:
```
Access to fetch at 'https://fast-api-k9zx.onrender.com/register' 
from origin 'https://frontend-app-cobc.onrender.com' has been blocked by CORS policy
```

**Solution**:
Added `FRONTEND_URL` environment variable to backend service:
```python
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    if not frontend_url.startswith("http"):
        frontend_url = f"https://{frontend_url}"
    origins.append(frontend_url)
```

## 🔧 Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/my_db
FRONTEND_URL=http://localhost:3000
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🌐 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Summary:

1. **Create PostgreSQL Database** on Render
2. **Deploy Backend**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - Environment Variables:
     - `DATABASE_URL`: (from database)
     - `PYTHON_VERSION`: `3.10.0`
     - `FRONTEND_URL`: (frontend URL after deployment)

3. **Deploy Frontend**:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NEXT_PUBLIC_API_BASE`: (backend URL)

## 📝 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token

### Items (Protected)
- `GET /items` - List all items
- `GET /items/{id}` - Get single item
- `POST /items` - Create new item
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item

## 🔐 Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - Frontend URL for CORS
- `PYTHON_VERSION` - Python version (3.10.0)

### Frontend
- `NEXT_PUBLIC_API_BASE` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Ahmad Raza

## 🙏 Acknowledgments

- FastAPI documentation
- Next.js documentation
- Render deployment guides
