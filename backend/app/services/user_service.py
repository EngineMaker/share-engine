from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from db.database import get_session
from models.user import User as UserModel
from models.user_group import UserGroup as UserGroupModel
from schemas.user import UserWithGroups


async def get_all(db: AsyncSession):
    result = await db.execute(select(UserModel))
    return result.scalars().all()


async def find_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(UserModel)
        .where(UserModel.id == user_id)
        .options(joinedload(UserModel.groups).joinedload(UserGroupModel.group))
    )
    user = result.scalars().first()

    user_detail = UserWithGroups(
        id=1,
        name='test',
        groups=[
            {
                "id": ug.group.id,
                "name": ug.group.name,
                "is_admin": ug.is_admin,
            }
            for ug in user.groups
        ]
    )

    if not user:
            raise HTTPException(status_code=404, detail="User not found")
    return user_detail