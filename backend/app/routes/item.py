from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from db.database import get_session
from services.item_service import get_items_for_user_groups, get_item_detail, rent_item, return_item, create_item
from schemas.item import ItemList, ItemDetail, ItemResponse, ItemCreate
from schemas.rent_log import RentLogResponse, RentLogCreate
from models.rent_log import RentLog
from services.auth_service import get_current_user, TokenData

router = APIRouter()

@router.get("/items/", response_model=List[ItemList])
async def read_items(db: AsyncSession = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    user_id = current_user.user_id
    items = await get_items_for_user_groups(db, user_id)
    if not items:
        raise HTTPException(status_code=404, detail="Items not found")
    return items

@router.get("/items/{item_id}", response_model=ItemDetail)
async def read_item_detail(item_id: int, db: AsyncSession = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    user_id = current_user.user_id
    item = await get_item_detail(db, item_id, user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/items/rent", response_model=RentLogResponse)
async def rent_an_item(rent_log: RentLogCreate, db: AsyncSession = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    user_id = current_user.user_id
    try:
        rented_item_log = await rent_item(db, rent_log.item_id, user_id)
        return rented_item_log
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/items/return", response_model=RentLogResponse)
async def return_an_item(rent_log: RentLogCreate, current_user: TokenData = Depends(get_current_user)):
    try:
        user_id = current_user.user_id
        rented_item_log = await return_item(db, rent_log.item_id, user_id)
        return rented_item_log
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/items/", response_model=ItemResponse)
async def create_new_item(item: ItemCreate, db: AsyncSession = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    try:
        user_id = current_user.user_id
        # TODO:画像データの取得 
        # image_data =
        new_item = await create_item(db=db, user_id=user_id, item_data=item.dict(), images=[])
        return new_item
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))