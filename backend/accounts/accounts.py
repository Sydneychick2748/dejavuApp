# # accounts/accounts.py
# from fastapi import APIRouter, Depends, HTTPException, status
# from pydantic import BaseModel
# from sqlalchemy.orm import Session
# from sqlalchemy.sql import text  # Ensure this import is present
# from passlib.context import CryptContext
# from database.database import get_db

# router = APIRouter()

# # Pydantic model for user registration data
# class UserCreate(BaseModel):
#     first_name: str
#     last_name: str
#     email: str
#     phone: str
#     password: str

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# @router.post("/register")
# async def register_user(user: UserCreate, db: Session = Depends(get_db)):
#     # Check if email already exists
#     existing_user = db.execute(
#         text("SELECT * FROM users WHERE email = :email"),
#         {"email": user.email}
#     ).fetchone()
#     if existing_user:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )

#     # Hash the password
#     hashed_password = pwd_context.hash(user.password)

#     # Insert the new user into the database
#     db.execute(
#         text("""
#         INSERT INTO users (first_name, last_name, email, phone, password, created_at)
#         VALUES (:first_name, :last_name, :email, :phone, :password, CURRENT_TIMESTAMP)
#         """),
#         {
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#             "email": user.email,
#             "phone": user.phone,
#             "password": hashed_password
#         }
#     )
#     db.commit()

#     return {"message": "User registered successfully"}

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from passlib.context import CryptContext
from database.database import get_db
import random
import string
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic model for user registration data
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    password: str

# Pydantic model for email verification
class VerifyEmail(BaseModel):
    email: str
    verification_code: str

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_verification_code(length=6):
    """Generate a random 6-digit verification code."""
    return ''.join(random.choices(string.digits, k=length))

@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registering user with email: {user.email}")
    
    # Check if email already exists
    existing_user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()
    if existing_user:
        logger.warning(f"Email already registered: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = pwd_context.hash(user.password)

    # Generate verification code
    verification_code = generate_verification_code()

    # Prepare phone number
    cleaned_phone = user.phone.replace("(", "").replace(")", "").replace("-", "")
    logger.info(f"Inserting user: email={user.email}, phone={cleaned_phone}, verification_code={verification_code}")

    try:
        # Insert the new user into the database
        db.execute(
            text("""
            INSERT INTO users (first_name, last_name, email, phone, password, created_at, verification_code, is_verified)
            VALUES (:first_name, :last_name, :email, :phone, :password, CURRENT_TIMESTAMP, :verification_code, FALSE)
            """),
            {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": cleaned_phone,
                "password": hashed_password,
                "verification_code": verification_code
            }
        )
        db.commit()
        logger.info(f"User inserted successfully: {user.email}")
    except Exception as e:
        logger.error(f"Failed to insert user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to register user: {str(e)}")

    return {"message": "User registered successfully", "verification_code": verification_code}

@router.post("/verify")
async def verify_email(verify_data: VerifyEmail, db: Session = Depends(get_db)):
    logger.info(f"Verifying email: {verify_data.email}, code: {verify_data.verification_code}")
    
    # Find user by email
    user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": verify_data.email}
    ).fetchone()
    if not user:
        logger.warning(f"User not found: {verify_data.email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check verification code
    if user.verification_code != verify_data.verification_code:
        logger.warning(f"Invalid verification code for {verify_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )

    # Mark user as verified
    try:
        db.execute(
            text("""
            UPDATE users
            SET is_verified = TRUE, verification_code = NULL
            WHERE email = :email
            """),
            {"email": verify_data.email}
        )
        db.commit()
        logger.info(f"Email verified successfully: {verify_data.email}")
    except Exception as e:
        logger.error(f"Failed to verify email: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to verify email: {str(e)}")

    return {"message": "Email verified successfully"}