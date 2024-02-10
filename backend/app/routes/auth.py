from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from services.auth_service import authenticate_user, create_access_token
from schemas.auth import Token, Login
from db.database import get_session
from datetime import timedelta

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: Login, db: AsyncSession = Depends(get_session)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.name, "user_id": user.id}, expires_delta=access_token_expires
    )
    return {"user_id": user.id, "access_token": access_token, "token_type": "bearer"}
