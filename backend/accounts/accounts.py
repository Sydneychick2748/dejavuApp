# accounts/accounts.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.sql import text  # Ensure this import is present
from passlib.context import CryptContext
from database.database import get_db

router = APIRouter()

# Pydantic model for user registration data
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    password: str

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = pwd_context.hash(user.password)

    # Insert the new user into the database
    db.execute(
        text("""
        INSERT INTO users (first_name, last_name, email, phone, password, created_at)
        VALUES (:first_name, :last_name, :email, :phone, :password, CURRENT_TIMESTAMP)
        """),
        {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "password": hashed_password
        }
    )
    db.commit()

    return {"message": "User registered successfully"}