from pydantic import BaseModel
from typing import Optional


class UserGroupBase(BaseModel):
    user_id: int
    group_id: int
    is_admin: bool = False

class UserGroupCreate(UserGroupBase):
    pass

class UserGroup(UserGroupBase):
    class Config:
        orm_mode = True

