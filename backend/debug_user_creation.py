from app import models, schemas, crud, db, utils
from sqlalchemy.orm import Session
import sys

# Ensure tables exist
models.Base.metadata.create_all(bind=db.engine)

# Setup DB session
session = db.SessionLocal()

# Try to create user
try:
    user_in = schemas.UserCreate(email="debug@example.com", password="password123")
    # Check if user exists first to avoid unique constraint error masking real issue
    existing = crud.get_user_by_email(session, "debug@example.com")
    if existing:
        print(f"User already exists: {existing.id}")
        sys.exit(0)
        
    user = crud.create_user(session, user_in)
    print("User created:", user.id)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    session.close()
