from pydantic import BaseModel
from typing import Optional


class ItemCreate(BaseModel):
    name: str
    price: Optional[int] = 0
    description: Optional[str] = None
    precaution: Optional[str]
    group_ids: list[int]
    image_urls: list[str] = []


class ItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image_url1: str
    image_url2: Optional[str] = None
    image_url3: Optional[str] = None
    image_url4: Optional[str] = None
    image_url5: Optional[str] = None
    owner_id: int
    precaution: Optional[str] = None
    available: bool

    class Config:
        orm_mode = True


class ItemList(BaseModel):
    id: int
    name: str
    available: bool
    price: int
    owner_id: int
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
    renter_id: Optional[int] = None

    class Config:
        orm_mode = True
