from pydantic import BaseModel
from typing import Optional
from schemas.group import GroupWithAdminInfo

class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

class UserList(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class UserWithGroups(BaseModel):
    id: int
    name: str
    groups: list[GroupWithAdminInfo]

    class Config:
        orm_mode = True