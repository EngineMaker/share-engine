from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from models.item import Item as ItemModel
from models.group_item import GroupItem as GroupItemModel
from models.rent_log import RentLog
from typing import List
from services.user_service import get_groups
from sqlalchemy import update
from fastapi import HTTPException
from datetime import datetime


async def get_items_for_user_groups(db: AsyncSession, user_id: int):
    # ユーザーが所属するグループのIDを取得
    usr_group_ids = await get_groups(db, user_id)

    # これらのグループに属するアイテムを取得
    result = await db.execute(
        select(ItemModel)
        .options(joinedload(ItemModel.groups))
        .filter(GroupItemModel.group_id.in_(usr_group_ids))
    )
    # TODO: filter、効いていない
    items = result.scalars().unique().all()

    # TODO: カスの実装
    return_items = []
    for item in items:
        if item.groups[0].group_id not in usr_group_ids:
            continue
        return_items.append(item)

    # print('===========================================================')
    # print(f'group_id: {usr_group_ids}')
    # for item in items:
    #     groups = item.groups
    #     print('=====item=====')
    #     for key, value in item.__dict__.items():
    #         if not key.startswith('_'):
    #             print(f'{key}: {value}')
    #     print('==========')
    #     print('=====groups=====')
    #     for group in groups:
    #         for key, value in group.__dict__.items():
    #             if not key.startswith('_'):
    #                 print(f'{key}: {value}')
    #     print('==========')
    # print('===========================================================')

    return return_items


async def get_item_detail(db: AsyncSession, item_id: int, user_id: int):
    # ユーザーが所属するグループのIDを取得
    usr_group_ids = await get_groups(db, user_id)

    result = await db.execute(
        select(ItemModel)
        .where(ItemModel.id == item_id)
        .options(joinedload(ItemModel.groups))
        .filter(GroupItemModel.group_id.in_(usr_group_ids))
    )
    # TODO: filter、効かず

    item = result.scalars().first()

    # TODO: カスの実装
    if item.groups[0].group_id not in usr_group_ids:
        return None

    # renterを探す
    if not item.available:
        rent_log_result = await db.execute(
            select(RentLog).where(RentLog.item_id == item_id, RentLog.returned is False)
        )
        rent_log = rent_log_result.scalars().first()

        if not rent_log:
            raise Exception("Item has rent by Unknown")
        renter_id = rent_log.renter_id
        item.renter_id = renter_id

    return item


# async def get_groups(db, item_id):
#     result = await db.execute(
#         select(ItemModdel)
#         .where(ItemModdel.id == item_id)
#         .options(joinedload(ItemModdel.groups).joinedload(GroupItemModel.group))
#     )
#     item = result.scalars().first()
#     group_ids = [ug.group.id for ug in item.groups]
#     return group_ids


async def rent_item(db: AsyncSession, item_id: int, renter_id: int) -> RentLog:
    # Check if item is available
    item = await db.execute(select(ItemModel).filter(ItemModel.id == item_id))
    item = item.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if not item.available:
        raise Exception("Item is not available")

    # Update item availability
    await db.execute(
        update(ItemModel).where(ItemModel.id == item_id).values(available=False)
    )

    # Create rent log
    rent_log = RentLog(
        item_id=item_id, renter_id=renter_id, returned=False, returned_at=None
    )
    db.add(rent_log)
    await db.commit()
    await db.refresh(rent_log)

    return rent_log


async def return_item(db: AsyncSession, item_id: int, renter_id: int) -> RentLog:
    # Check if item is available
    item = await db.execute(select(ItemModel).filter(ItemModel.id == item_id))
    item = item.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.available:
        raise Exception("Item is already returned")

    # Update item availability
    await db.execute(
        update(ItemModel).where(ItemModel.id == item_id).values(available=True)
    )

    # Update rent log
    rent_log = await db.execute(
        select(RentLog).filter(
            RentLog.item_id == item_id,
            RentLog.renter_id == renter_id,
            RentLog.returned is False,
        )
    )
    rent_log = rent_log.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Rental Log not found")
    await db.execute(
        update(RentLog)
        .where(
            RentLog.item_id == item_id,
            RentLog.renter_id == renter_id,
            RentLog.returned is False,
        )
        .values(returned=True, returned_at=datetime.now())
    )
    await db.commit()
    await db.refresh(rent_log)

    return rent_log


async def create_item(
    db: AsyncSession, user_id, item_data: dict, images: List[bytes]
) -> ItemModel:
    # new_item = Item(**item_data, **{f"image_url{i+1}": url for i, url in enumerate(image_urls)})
    new_item = ItemModel(
        name=item_data.get("name"),
        price=item_data.get("price"),
        description=item_data.get("description"),
        precaution=item_data.get("precaution"),
        available=True,
        owner_id=user_id,
        **{f"image_url{i+1}": url for i, url in enumerate(item_data.get("image_urls"))},
    )
    db.add(new_item)
    await db.flush()
    for group_id in item_data.get("group_ids"):
        new_group_item = GroupItemModel(group_id=group_id, item_id=new_item.id)
        db.add(new_group_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item


async def get_rental_item_list(db: AsyncSession, user_id: int):
    rent_log_result = await db.execute(select(RentLog))
    return rent_log_result
