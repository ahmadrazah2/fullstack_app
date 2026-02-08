import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, crud, utils
from .db import engine
from .deps import get_db, get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI CRUD")

origins = [
    "http://localhost:3000",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)


@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not utils.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = utils.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/items", response_model=list[schemas.ItemOut])
def list_items(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_items(db)


@app.get("/items/{item_id}", response_model=schemas.ItemOut)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.post("/items", response_model=schemas.ItemOut, status_code=201)
def create_item(payload: schemas.ItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_item(db, payload)


@app.put("/items/{item_id}", response_model=schemas.ItemOut)
def update_item(item_id: int, payload: schemas.ItemUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    item = crud.update_item(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.delete("/items/{item_id}", response_model=schemas.ItemOut)
def delete_item(item_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    item = crud.delete_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
