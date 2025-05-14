



# from fastapi import APIRouter, Depends, HTTPException, status
# from pydantic import BaseModel
# from sqlalchemy.orm import Session
# from sqlalchemy.sql import text
# from passlib.context import CryptContext
# from database.database import get_db
# import random
# import string
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# router = APIRouter()

# # Pydantic models
# class UserCreate(BaseModel):
#     first_name: str
#     last_name: str
#     email: str
#     phone: str
#     password: str

# class VerifyEmail(BaseModel):
#     email: str
#     verification_code: str

# class UserLogin(BaseModel):
#     email: str
#     password: str

# class ForgotPassword(BaseModel):
#     emailOrPhone: str

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def generate_verification_code(length=6):
#     """Generate a random 6-digit verification code."""
#     code = ''.join(random.choices(string.digits, k=length))
#     logger.info(f"Generated verification code: {code}")
#     return code

# @router.post("/register")
# async def register_user(user: UserCreate, db: Session = Depends(get_db)):
#     logger.info(f"Database connection info: {db.bind.url}")
#     logger.info(f"Registration attempt for email: {user.email}")
#     # Check if email already exists
#     try:
#         existing_user = db.execute(
#             text("SELECT * FROM users WHERE email = :email"),
#             {"email": user.email}
#         ).fetchone()
#     except Exception as e:
#         logger.error(f"Database error during email check: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to check email in database"
#         )

#     if existing_user:
#         logger.info(f"Registration failed: Email already registered: {user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )

#     # Hash the password
#     hashed_password = pwd_context.hash(user.password)
#     logger.info(f"Password hashed for {user.email}")

#     # Generate verification code
#     verification_code = generate_verification_code()

#     # Clean phone number
#     cleaned_phone = user.phone.replace("(", "").replace(")", "").replace("-", "")
#     logger.info(f"Cleaned phone number: {cleaned_phone}")

#     # Insert the new user into the database
#     try:
#         db.execute(
#             text("""
#             INSERT INTO users (first_name, last_name, email, phone, password, created_at, verification_code, is_verified)
#             VALUES (:first_name, :last_name, :email, :phone, :password, CURRENT_TIMESTAMP, :verification_code, FALSE)
#             """),
#             {
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#                 "email": user.email,
#                 "phone": cleaned_phone,
#                 "password": hashed_password,
#                 "verification_code": verification_code
#             }
#         )
#         db.commit()
#         logger.info(f"User registered successfully: {user.email}, verification_code: {verification_code}")
#     except Exception as e:
#         logger.error(f"Database error during registration for {user.email}: {str(e)}")
#         db.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to register user due to database error"
#         )

#     # Verify the user was inserted correctly
#     try:
#         new_user = db.execute(
#             text("SELECT * FROM users WHERE email = :email"),
#             {"email": user.email}
#         ).fetchone()
#     except Exception as e:
#         logger.error(f"Database error during user verification: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to verify user in database"
#         )

#     if not new_user:
#         logger.error(f"Failed to find newly registered user: {user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="User registration failed"
#         )
#     logger.info(f"Verified user in database: {user.email}, stored verification_code: {new_user.verification_code}")

#     return {"message": "User registered successfully", "verification_code": verification_code}

# @router.post("/verify")
# async def verify_email(verify_data: VerifyEmail, db: Session = Depends(get_db)):
#     logger.info(f"Database connection info: {db.bind.url}")
#     logger.info(f"Verification attempt for email: {verify_data.email}, entered code: {verify_data.verification_code}")

#     # Find user by email
#     try:
#         user = db.execute(
#             text("SELECT * FROM users WHERE email = :email"),
#             {"email": verify_data.email}
#         ).fetchone()
#     except Exception as e:
#         logger.error(f"Database error during user lookup: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to query user in database"
#         )

#     if not user:
#         logger.info(f"Verification failed: User not found: {verify_data.email}")
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found"
#         )

#     # Log user details
#     logger.info(f"User found: {verify_data.email}, stored code: {user.verification_code}, is_verified: {user.is_verified}, stored code type: {type(user.verification_code)}, entered code type: {type(verify_data.verification_code)}")

#     # Check if already verified
#     if user.is_verified:
#         logger.info(f"Verification failed: {verify_data.email} already verified, please log in")
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already verified, please log in"
#         )

#     # Check verification code
#     stored_code = str(user.verification_code).strip() if user.verification_code else None
#     entered_code = str(verify_data.verification_code).strip()
#     logger.info(f"Comparing codes - stored: '{stored_code}', entered: '{entered_code}'")

#     if stored_code is None or stored_code != entered_code:
#         logger.info(f"Verification failed: Invalid code for {verify_data.email}, stored: '{stored_code}', entered: '{entered_code}'")
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid verification code"
#         )

#     # Mark user as verified
#     try:
#         db.execute(
#             text("""
#             UPDATE users
#             SET is_verified = TRUE, verification_code = NULL
#             WHERE email = :email
#             """),
#             {"email": verify_data.email}
#         )
#         db.commit()
#         logger.info(f"User verified successfully: {verify_data.email}")
#     except Exception as e:
#         logger.error(f"Database error during verification for {verify_data.email}: {str(e)}")
#         db.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to verify email due to database error"
#         )

#     # Verify the update
#     updated_user = db.execute(
#         text("SELECT * FROM users WHERE email = :email"),
#         {"email": verify_data.email}
#     ).fetchone()
#     logger.info(f"Post-verification user state: {verify_data.email}, is_verified: {updated_user.is_verified}, verification_code: {updated_user.verification_code}")

#     return {"message": "Email verified successfully", "is_verified": True}

# @router.post("/login")
# async def login(user: UserLogin, db: Session = Depends(get_db)):
#     logger.info(f"Database connection info: {db.bind.url}")
#     logger.info(f"Login attempt for email: {user.email}")

#     # Find user by email
#     try:
#         db_user = db.execute(
#             text("SELECT * FROM users WHERE email = :email"),
#             {"email": user.email}
#         ).fetchone()
#     except Exception as e:
#         logger.error(f"Database error during user lookup: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to query user in database"
#         )

#     if not db_user:
#         logger.info(f"Login failed: User not found: {user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid email or password"
#         )

#     # Check if user is verified
#     if not db_user.is_verified:
#         logger.info(f"Login failed: Email not verified: {user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Email not verified. Please verify your email before logging in."
#         )

#     # Verify password
#     if not pwd_context.verify(user.password, db_user.password):
#         logger.info(f"Login failed: Invalid password for {user.email}")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid email or password"
#         )

#     logger.info(f"Login successful for {user.email}")
#     return {"message": "Login successful", "email": user.email}

# @router.post("/forgot-password")
# async def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
#     logger.info(f"Database connection info: {db.bind.url}")
#     logger.info(f"Forgot password attempt for: {data.emailOrPhone}")

#     # Simple validation: determine if the input is an email or phone number
#     is_email = "@" in data.emailOrPhone
#     is_phone = not is_email  # If not an email, assume it's a phone number
#     logger.info(f"Input type - is_email: {is_email}, is_phone: {is_phone}")

#     # Clean phone number if provided (remove parentheses and dashes)
#     cleaned_phone = data.emailOrPhone.replace("(", "").replace(")", "").replace("-", "") if is_phone else None
#     logger.info(f"Cleaned phone number (if phone): {cleaned_phone}")

#     # Find user by email or phone
#     user = None
#     try:
#         if is_email:
#             email_lower = data.emailOrPhone.lower()
#             logger.info(f"Querying user by email (case-insensitive): {email_lower}")
#             user = db.execute(
#                 text("SELECT * FROM users WHERE TRIM(LOWER(email)) = TRIM(LOWER(:email))"),
#                 {"email": data.emailOrPhone}
#             ).fetchone()
#         elif is_phone:
#             logger.info(f"Querying user by phone: {cleaned_phone}")
#             user = db.execute(
#                 text("SELECT * FROM users WHERE TRIM(phone) = TRIM(:phone)"),
#                 {"phone": cleaned_phone}
#             ).fetchone()
#     except Exception as e:
#         logger.error(f"Database error during user lookup: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to query user in database"
#         )

#     if not user:
#         # Log all users in the database for debugging
#         try:
#             all_users = db.execute(text("SELECT email, phone, is_verified FROM users")).fetchall()
#             # Convert each row to a dictionary manually
#             users_list = [
#                 {"email": user.email, "phone": user.phone, "is_verified": user.is_verified}
#                 for user in all_users
#             ]
#             logger.info(f"All users in database: {users_list}")
#         except Exception as e:
#             logger.error(f"Database error while fetching all users for debug: {str(e)}")
#             users_list = []

#         logger.info(f"Forgot password failed: User not found: {data.emailOrPhone}")
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Email or phone number not found"
#         )

#     # Log user details
#     logger.info(f"User found - email: {user.email}, phone: {user.phone}, is_verified: {user.is_verified}")

#     # Check if user is verified
#     if not user.is_verified:
#         logger.info(f"Forgot password failed: User not verified: {data.emailOrPhone}")
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="User is not verified. Please verify your account first."
#         )

#     # Generate verification code
#     verification_code = generate_verification_code()

#     # Update user with new verification code
#     try:
#         db.execute(
#             text("""
#             UPDATE users
#             SET verification_code = :verification_code
#             WHERE email = :email
#             """),
#             {"verification_code": verification_code, "email": user.email}
#         )
#         db.commit()
#         logger.info(f"Verification code generated for forgot password: {user.email}, code: {verification_code}")
#     except Exception as e:
#         logger.error(f"Database error during forgot password for {user.email}: {str(e)}")
#         db.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to generate verification code due to database error"
#         )

#     # For now, log the verification code (simulating sending it via email/SMS)
#     return {"message": "Verification code generated", "verification_code": verification_code}

# # Debug endpoint to log all users (for testing purposes)
# @router.get("/debug/users")
# async def debug_users(db: Session = Depends(get_db)):
#     logger.info(f"Database connection info: {db.bind.url}")
#     try:
#         all_users = db.execute(text("SELECT email, phone, is_verified FROM users")).fetchall()
#         users_list = [
#             {"email": user.email, "phone": user.phone, "is_verified": user.is_verified}
#             for user in all_users
#         ]
#         logger.info(f"Debug - All users in database: {users_list}")
#         return {"message": "Users logged to console", "users": users_list}
#     except Exception as e:
#         logger.error(f"Error fetching users for debug: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch users from database"
#         )

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

# Pydantic models
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    password: str

class VerifyEmail(BaseModel):
    email: str
    verification_code: str

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPassword(BaseModel):
    emailOrPhone: str

class VerifyResetCode(BaseModel):
    emailOrPhone: str
    verificationCode: str

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_verification_code(length=6):
    """Generate a random 6-digit verification code."""
    code = ''.join(random.choices(string.digits, k=length))
    logger.info(f"Generated verification code: {code}")
    return code

@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Database connection info: {db.bind.url}")
    logger.info(f"Registration attempt for email: {user.email}")
    # Check if email already exists
    try:
        existing_user = db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": user.email}
        ).fetchone()
    except Exception as e:
        logger.error(f"Database error during email check: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check email in database"
        )

    if existing_user:
        logger.info(f"Registration failed: Email already registered: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = pwd_context.hash(user.password)
    logger.info(f"Password hashed for {user.email}")

    # Generate verification code
    verification_code = generate_verification_code()

    # Clean phone number
    cleaned_phone = user.phone.replace("(", "").replace(")", "").replace("-", "")
    logger.info(f"Cleaned phone number: {cleaned_phone}")

    # Insert the new user into the database
    try:
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
        logger.info(f"User registered successfully: {user.email}, verification_code: {verification_code}")
    except Exception as e:
        logger.error(f"Database error during registration for {user.email}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user due to database error"
        )

    # Verify the user was inserted correctly
    try:
        new_user = db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": user.email}
        ).fetchone()
    except Exception as e:
        logger.error(f"Database error during user verification: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify user in database"
        )

    if not new_user:
        logger.error(f"Failed to find newly registered user: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User registration failed"
        )
    logger.info(f"Verified user in database: {user.email}, stored verification_code: {new_user.verification_code}")

    return {"message": "User registered successfully", "verification_code": verification_code}

@router.post("/verify")
async def verify_email(verify_data: VerifyEmail, db: Session = Depends(get_db)):
    logger.info(f"Database connection info: {db.bind.url}")
    logger.info(f"Verification attempt for email: {verify_data.email}, entered code: {verify_data.verification_code}")

    # Find user by email
    try:
        user = db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": verify_data.email}
        ).fetchone()
    except Exception as e:
        logger.error(f"Database error during user lookup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to query user in database"
        )

    if not user:
        logger.info(f"Verification failed: User not found: {verify_data.email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Log user details
    logger.info(f"User found: {verify_data.email}, stored code: {user.verification_code}, is_verified: {user.is_verified}, stored code type: {type(user.verification_code)}, entered code type: {type(verify_data.verification_code)}")

    # Check if already verified
    if user.is_verified:
        logger.info(f"Verification failed: {verify_data.email} already verified, please log in")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified, please log in"
        )

    # Check verification code
    stored_code = str(user.verification_code).strip() if user.verification_code else None
    entered_code = str(verify_data.verification_code).strip()
    logger.info(f"Comparing codes - stored: '{stored_code}', entered: '{entered_code}'")

    if stored_code is None or stored_code != entered_code:
        logger.info(f"Verification failed: Invalid code for {verify_data.email}, stored: '{stored_code}', entered: '{entered_code}'")
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
        logger.info(f"User verified successfully: {verify_data.email}")
    except Exception as e:
        logger.error(f"Database error during verification for {verify_data.email}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify email due to database error"
        )

    # Verify the update
    updated_user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": verify_data.email}
    ).fetchone()
    logger.info(f"Post-verification user state: {verify_data.email}, is_verified: {updated_user.is_verified}, verification_code: {updated_user.verification_code}")

    return {"message": "Email verified successfully", "is_verified": True}

@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Database connection info: {db.bind.url}")
    logger.info(f"Login attempt for email: {user.email}")

    # Find user by email
    try:
        db_user = db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": user.email}
        ).fetchone()
    except Exception as e:
        logger.error(f"Database error during user lookup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to query user in database"
        )

    if not db_user:
        logger.info(f"Login failed: User not found: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if user is verified
    if not db_user.is_verified:
        logger.info(f"Login failed: Email not verified: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email before logging in."
        )

    # Verify password
    if not pwd_context.verify(user.password, db_user.password):
        logger.info(f"Login failed: Invalid password for {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    logger.info(f"Login successful for {user.email}")
    return {"message": "Login successful", "email": user.email}

@router.post("/forgot-password")
async def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    logger.info(f"Database connection info: {db.bind.url}")
    logger.info(f"Forgot password attempt for: {data.emailOrPhone}")

    # Simple validation: determine if the input is an email or phone number
    is_email = "@" in data.emailOrPhone
    is_phone = not is_email  # If not an email, assume it's a phone number
    logger.info(f"Input type - is_email: {is_email}, is_phone: {is_phone}")

    # Clean phone number if provided (remove parentheses and dashes)
    cleaned_phone = data.emailOrPhone.replace("(", "").replace(")", "").replace("-", "") if is_phone else None
    logger.info(f"Raw input: {data.emailOrPhone}, Cleaned phone number (if phone): {cleaned_phone}")

    # Find user by email or phone
    user = None
    try:
        if is_email:
            email_lower = data.emailOrPhone.lower()
            logger.info(f"Querying user by email (case-insensitive): {email_lower}")
            user = db.execute(
                text("SELECT * FROM users WHERE TRIM(LOWER(email)) = TRIM(LOWER(:email))"),
                {"email": data.emailOrPhone}
            ).fetchone()
        elif is_phone:
            logger.info(f"Querying user by phone: {cleaned_phone}")
            user = db.execute(
                text("SELECT * FROM users WHERE TRIM(phone) = TRIM(:phone)"),
                {"phone": cleaned_phone}
            ).fetchone()
    except Exception as e:
        logger.error(f"Database error during user lookup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to query user in database"
        )

    if not user:
        # Log all users in the database for debugging
        try:
            all_users = db.execute(text("SELECT email, phone, is_verified FROM users")).fetchall()
            users_list = [
                {"email": user.email, "phone": user.phone, "is_verified": user.is_verified}
                for user in all_users
            ]
            logger.info(f"All users in database: {users_list}")
        except Exception as e:
            logger.error(f"Database error while fetching all users for debug: {str(e)}")
            users_list = []

        logger.info(f"Forgot password failed: User not found: {data.emailOrPhone}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email or phone number not found"
        )

    # Log user details
    logger.info(f"User found - email: {user.email}, phone: {user.phone}, is_verified: {user.is_verified}")

    # Check if user is verified
    if not user.is_verified:
        logger.info(f"Forgot password failed: User not verified: {data.emailOrPhone}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not verified. Please verify your account first."
        )

    # Generate verification code
    verification_code = generate_verification_code()

    # Update user with new verification code
    try:
        db.execute(
            text("""
            UPDATE users
            SET verification_code = :verification_code
            WHERE email = :email
            """),
            {"verification_code": verification_code, "email": user.email}
        )
        db.commit()
        logger.info(f"Verification code generated for forgot password: {user.email}, code: {verification_code}")
    except Exception as e:
        logger.error(f"Database error during forgot password for {user.email}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate verification code due to database error"
        )

    # For now, log the verification code (simulating sending it via email/SMS)
    return {"message": "Verification code generated", "verification_code": verification_code, "emailOrPhone": data.emailOrPhone}

@router.post("/verify-reset-code")
async def verify_reset_code(data: VerifyResetCode, db: Session = Depends(get_db)):
    logger.info(f"Database connection info: {db.bind.url}")
    logger.info(f"Verify reset code attempt for: {data.emailOrPhone}, code: {data.verificationCode}")

    # Simple validation: determine if the input is an email or phone number
    is_email = "@" in data.emailOrPhone
    is_phone = not is_email
    logger.info(f"Input type - is_email: {is_email}, is_phone: {is_phone}")

    # Clean phone number if provided (remove parentheses and dashes)
    cleaned_phone = data.emailOrPhone.replace("(", "").replace(")", "").replace("-", "") if is_phone else None
    logger.info(f"Raw input: {data.emailOrPhone}, Cleaned phone number (if phone): {cleaned_phone}")

    # Find user by email or phone
    user = None
    try:
        if is_email:
            email_lower = data.emailOrPhone.lower()
            logger.info(f"Querying user by email (case-insensitive): {email_lower}")
            user = db.execute(
                text("SELECT * FROM users WHERE TRIM(LOWER(email)) = TRIM(LOWER(:email))"),
                {"email": data.emailOrPhone}
            ).fetchone()
        elif is_phone:
            logger.info(f"Querying user by phone: {cleaned_phone}")
            user = db.execute(
                text("SELECT * FROM users WHERE TRIM(phone) = TRIM(:phone)"),
                {"phone": cleaned_phone}
            ).fetchone()
    except Exception as e:
        logger.error(f"Database error during user lookup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to query user in database"
        )

    if not user:
        logger.info(f"Verify reset code failed: User not found: {data.emailOrPhone}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Log user details
    logger.info(f"User found - email: {user.email}, phone: {user.phone}, is_verified: {user.is_verified}")

    # Check if user is verified
    if not user.is_verified:
        logger.info(f"Verify reset code failed: User not verified: {data.emailOrPhone}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not verified. Please verify your account first."
        )

    # Check verification code
    stored_code = str(user.verification_code).strip() if user.verification_code else None
    entered_code = str(data.verificationCode).strip()
    logger.info(f"Comparing codes - stored: '{stored_code}', entered: '{entered_code}'")

    if stored_code is None or stored_code != entered_code:
        logger.info(f"Verify reset code failed: Invalid code for {data.emailOrPhone}, stored: '{stored_code}', entered: '{entered_code}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This is not the right code, please go back to login"
        )

    # Clear the verification code after successful validation
    try:
        db.execute(
            text("""
            UPDATE users
            SET verification_code = NULL
            WHERE email = :email
            """),
            {"email": user.email}
        )
        db.commit()
        logger.info(f"Verification code cleared for user: {user.email}")
    except Exception as e:
        logger.error(f"Database error during verification code clearing for {user.email}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear verification code in database"
        )

    return {"message": "Verification code validated successfully"}

# Debug endpoint to log all users (for testing purposes)
@router.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    logger.info(f"Database connection info: {db.bind.url}")
    try:
        all_users = db.execute(text("SELECT email, phone, is_verified FROM users")).fetchall()
        users_list = [
            {"email": user.email, "phone": user.phone, "is_verified": user.is_verified}
            for user in all_users
        ]
        logger.info(f"Debug - All users in database: {users_list}")
        return {"message": "Users logged to console", "users": users_list}
    except Exception as e:
        logger.error(f"Error fetching users for debug: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch users from database"
        )