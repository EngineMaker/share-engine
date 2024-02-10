from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from models.item import Item as ItemModel
from models.group_item import GroupItem as GroupItemModel
from typing import List
from services.user_service import get_groups
from sqlalchemy import inspect

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