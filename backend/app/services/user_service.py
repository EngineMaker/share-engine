from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from models.user import User as UserModel
from models.user_group import UserGroup as UserGroupModel
from models.rent_log import RentLog
from schemas.user import UserDetail
from fastapi import HTTPException


async def get_all(db: AsyncSession):
    result = await db.execute(select(UserModel))
    return result.scalars().all()


async def get_detail(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(UserModel)
        .where(UserModel.id == user_id)
        .options(joinedload(UserModel.items))
    )
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 自分が借りているアイテム一覧の取得
    rent_logs = await db.execute(
        select(RentLog)
        .where(RentLog.renter_id == user_id, RentLog.returned is False)
        .options(joinedload(RentLog.item))
    )
    rent_logs = rent_logs.scalars().all()

    user_detail = UserDetail(
        name=user.name,
        own_items=[
            {
                "id": item.id,
                "name": item.name,
                "available": item.available,
                "price": item.price,
                "image_url1": item.image_url1,
                "owner_id": user.id,
            }
            for item in user.items
            if user.items
        ],
        rent_items=[
            {
                "id": rent_log.item.id,
                "name": rent_log.item.name,
                "available": rent_log.item.available,
                "price": rent_log.item.price,
                "image_url1": rent_log.item.image_url1,
                "owner_id": rent_log.item.owner_id,
            }
            for rent_log in rent_logs
            if rent_logs
        ],
    )
    return user_detail


async def get_groups(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(UserModel)
        .where(UserModel.id == user_id)
        .options(joinedload(UserModel.groups).joinedload(UserGroupModel.group))
    )
    user = result.scalars().first()
    group_ids = [ug.group.id for ug in user.groups]
    return group_ids
