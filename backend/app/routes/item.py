from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from db.database import get_session
from services.item_service import get_items_for_user_groups, get_item_detail
from schemas.item import ItemList, ItemDetail

router = APIRouter()

@router.get("/items/", response_model=List[ItemList])
async def read_items(user_id=1, db: AsyncSession = Depends(get_session)):
    items = await get_items_for_user_groups(db, user_id)
    if not items:
        raise HTTPException(status_code=404, detail="Items not found")
    return items

@router.get("/items/{item_id}", response_model=ItemDetail)
async def read_item_detail(item_id: int, user_id=1, db: AsyncSession = Depends(get_session)):
    item = await get_item_detail(db, item_id, user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
