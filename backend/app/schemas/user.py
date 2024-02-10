from pydantic import BaseModel
from typing import Optional
from schemas.item import ItemList

class UserList(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class UserDetail(BaseModel):
    name: str
    own_items: Optional[list[ItemList]]
    rent_items: Optional[list[ItemList]]
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    name: str
    password: str
