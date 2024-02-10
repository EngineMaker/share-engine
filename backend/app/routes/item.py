from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from db.database import get_session
from services.item_service import get_items_for_user_groups, get_item_detail, rent_item, return_item
from schemas.item import ItemList, ItemDetail
from schemas.rent_log import RentLogResponse, RentLogCreate
from models.rent_log import RentLog

router = APIRouter()

@router.get("/items/", response_model=List[ItemList])
async def read_items(db: AsyncSession = Depends(get_session)):
    # TODO: login_user_idの取得
    user_id = 1
    items = await get_items_for_user_groups(db, user_id)
    if not items:
        raise HTTPException(status_code=404, detail="Items not found")
    return items

@router.get("/items/{item_id}", response_model=ItemDetail)
async def read_item_detail(item_id: int, db: AsyncSession = Depends(get_session)):
    # TODO: login_user_idの取得
    user_id = 1
    item = await get_item_detail(db, item_id, user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/items/rent", response_model=RentLogResponse)
async def rent_an_item(rent_log: RentLogCreate, db: AsyncSession = Depends(get_session)):
    try:
        # TODO: login_user_idの取得
        user_id = 1
        rented_item_log = await rent_item(db, rent_log.item_id, user_id)
        return rented_item_log
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/items/return", response_model=RentLogResponse)
async def return_an_item(rent_log: RentLogCreate, db: AsyncSession = Depends(get_session)):
    try:
        # TODO: login_user_idの取得
        user_id = 1
        rented_item_log = await return_item(db, rent_log.item_id, user_id)
        return rented_item_log
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))