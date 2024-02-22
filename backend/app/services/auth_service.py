from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import jwt
import os
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# トークン取得用のURLを指定
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = os.environ.get("HASH_ALGORITHM")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except jwt.PyJWTError:
        raise credentials_exception


def hash_password(password: str):
    return pwd_context.hash(password)


async def authenticate_user(db: AsyncSession, username: str, password: str) -> User:
    # データベースからユーザーを検索
    result = await db.execute(select(User).where(User.name == username))
    user = result.scalars().first()
    # ユーザーが見つかり、パスワードが一致する場合にユーザーを返す
    if user and pwd_context.verify(password, user.hashed_password):
        return user
    return None


class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None


async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if username is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(username=username, user_id=user_id)
    except jwt.PyJWTError:
        raise credentials_exception
    return token_data
