import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG, future=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()


async def get_session():
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    import app.db_models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_admin_user()


async def seed_admin_user():
    from app.db_models import User

    async with AsyncSessionLocal() as session:
        existing = await session.scalar(select(User).where(User.username == "admin"))
        if existing:
            return
        admin = User(
            id=str(uuid.uuid4()),
            username="admin",
            password="123456",
            ho_ten="Administrator",
        )
        session.add(admin)
        await session.commit()

