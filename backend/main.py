


# main.py

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from dashboard.dashboard import router as dashboard_router
# from accounts.accounts import router as accounts_router

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "DELETE"],
#     allow_headers=["*"],
# )

# app.mount("/frames", StaticFiles(directory="frames"), name="frames")
# app.mount("/saved_frames", StaticFiles(directory="saved_frames"), name="saved_frames")
# app.mount("/temp_zips", StaticFiles(directory="temp_zips"), name="temp_zips")

# app.include_router(dashboard_router, prefix="/dashboard")
# app.include_router(accounts_router, prefix="/accounts")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any
from dashboard.dashboard import router as dashboard_router
from accounts.accounts import router as accounts_router
from user_preferences.userPreferences import get_user_preferences, update_user_preferences

app = FastAPI()

# Pydantic model for preferences
class Preferences(BaseModel):
    databaseLocation: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.mount("/frames", StaticFiles(directory="frames"), name="frames")
app.mount("/saved_frames", StaticFiles(directory="saved_frames"), name="saved_frames")
app.mount("/temp_zips", StaticFiles(directory="temp_zips"), name="temp_zips")

app.include_router(dashboard_router, prefix="/dashboard")
app.include_router(accounts_router, prefix="/accounts")

# Preferences endpoints
@app.get("/user-preferences")
async def get_preferences():
    user_id = "user123"  # Hardcoded for now, replace with authenticated user ID later
    preferences = get_user_preferences(user_id)
    return preferences

@app.put("/user-preferences")
async def update_preferences(preferences: Preferences):
    user_id = "user123"  # Hardcoded for now, replace with authenticated user ID later
    updated_preferences = update_user_preferences(user_id, preferences.model_dump())  # Use .model_dump() for Pydantic v2
    if updated_preferences is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_preferences

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)