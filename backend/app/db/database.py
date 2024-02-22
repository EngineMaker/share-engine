from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declared_attr
import os


class Base(declarative_base()):
    __abstract__ = True

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()


async def get_session():
    url = os.environ.get(
        "DATABASE_URL", "postgresql+asyncpg://user:password@db:5432/shareengine"
    )

    engine = create_async_engine(url, echo=True)

    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        yield session
