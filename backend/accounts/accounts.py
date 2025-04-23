# accounts/accounts.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
async def accounts_status():
    return {"message": "Accounts API is running. Endpoints to be implemented."}