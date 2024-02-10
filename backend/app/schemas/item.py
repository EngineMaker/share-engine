from pydantic import BaseModel
from typing import Optional

class ItemBase(BaseModel):
    name: str
    available: bool
    price: int
    image_url1: Optional[str] = None

class ItemCreate(ItemBase):
    description: str
    image_url2: Optional[str] = None
    image_url3: Optional[str] = None
    image_url4: Optional[str] = None
    image_url5: Optional[str] = None
    owner_id: int
    precaution: Optional[str] = None

class ItemList(BaseModel):
    id: int
    name: str
    available: bool
    price: int
    image_url1: Optional[str] = None

    class Config:
        orm_mode = True

class ItemDetail(ItemList):
    description: Optional[str] = None
    image_url2: Optional[str] = None
    image_url3: Optional[str] = None
    image_url4: Optional[str] = None
    image_url5: Optional[str] = None
    precaution: Optional[str] = None

    class Config:
        orm_mode = True