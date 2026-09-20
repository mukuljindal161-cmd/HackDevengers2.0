import logging
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# Determine database engine arguments
target_url = settings.DATABASE_URL
if target_url.startswith("mongodb"):
    logger.warning(
        "Detected MongoDB URL in DATABASE_URL. SQLAlchemy ORM requires a SQL dialect "
        "(e.g., SQLite or PostgreSQL). Falling back to 'sqlite+aiosqlite:///./realitygraph.db' "
        "to ensure smooth operation."
    )
    target_url = "sqlite+aiosqlite:///./realitygraph.db"

connect_args = {}
if target_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    target_url,
    echo=False,
    connect_args=connect_args,
    future=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
