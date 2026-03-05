from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from py_cms.repo import SqlAlchemyRepository
from py_cms.metagen import CrudGenerator

from sqlalchemy.orm import Mapped, declarative_base, mapped_column, sessionmaker

engine = create_async_engine("sqlite+aiosqlite:///./test.db", echo=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession)

Base = declarative_base()

class Test(Base):

    __tablename__ = "test_table"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    x: Mapped[int]
    y: Mapped[int]
    text: Mapped[str]

class TestView(BaseModel):

    x: int

class TestCreate(TestView):

    y: int
    text: str

class TestUpdate(TestCreate):
    pass

class TestTableView(TestCreate):
    pass

xxx = CrudGenerator(
    SqlAlchemyRepository(Test, AsyncSessionLocal()),
    TestTableView,
    TestCreate,
    TestUpdate,
    TestView
)

