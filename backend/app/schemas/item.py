from pydantic import BaseModel
from typing import Optional

class ItemCreate(BaseModel):
    name: str
    price: Optional[int] = 0
    description: str
    precaution: Optional[str]
    group_ids: list[int]
    # images: list[bytes] = []

class ItemResponse(BaseModel):
    id: int
    name: str
    description: str
    image_url1: str
    image_url2: Optional[str] = None
    image_url3: Optional[str] = None
    image_url4: Optional[str] = None
    image_url5: Optional[str] = None
    owner_id: int
    available: bool

    class Config:
        orm_mode = True

class ItemList(BaseModel):
    id: int
    name: str
    available: bool
    price: int
    image_url1: Optional[str] = None
    owner_id: int

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