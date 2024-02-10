from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from db.database import get_session
from models.user import User as UserModel
from schemas.user import UserWithGroups as UserWithGroupsSchema
from schemas.user import UserList as UserListSchema
from services import user_service

router = APIRouter()

@router.get("/users", response_model=list[UserListSchema])
async def read_users(db: AsyncSession = Depends(get_session)):
    return await user_service.get_all(db)

@router.get("/users/{user_id}", response_model=UserWithGroupsSchema)
async def read_user(user_id: int, db: AsyncSession = Depends(get_session)):
    return await user_service.find_by_id(db, user_id)