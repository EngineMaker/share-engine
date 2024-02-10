from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from db.database import get_session
from models.user import User as UserModel
from schemas.user import UserDetail as UserDetailSchema
from schemas.user import UserList as UserListSchema
from schemas.user import UserCreate as UserCreateSchema
from services import user_service
from services.auth_service import get_current_user, TokenData, hash_password

router = APIRouter()

@router.get("/users", response_model=list[UserListSchema])
async def read_users(db: AsyncSession = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    return await user_service.get_all(db)

@router.get("/users/{user_id}", response_model=UserDetailSchema)
async def read_user(user_id: int, db: AsyncSession = Depends(get_session)):
    return await user_service.get_detail(db, user_id)

@router.post("/users/")
async def create_user(user_create: UserCreateSchema, db: AsyncSession = Depends(get_session)):
    hashed_password = hash_password(user_create.password)
    new_user = UserModel(name=user_create.name, hashed_password=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"name": new_user.name}

@router.get("/me")
async def get_my_id(current_user: TokenData = Depends(get_current_user)):
    return {"user_id": current_user.user_id}