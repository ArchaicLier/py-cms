from typing import List, Optional, TypeVar, Generic
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import session

ModelType = TypeVar("ModelType")

class SqlAlchemyRepository(Generic[ModelType]):
    def __init__(self, model: type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_all(self) -> List[ModelType]:
        return [i for i in (await self.session.execute(select(self.model))).scalars()]

    async def get_by_id(self, id: int) -> Optional[ModelType]:
        ...

    async def create(self, data: dict) -> ModelType:
        ...

    async def update(self, id: int, data: dict) -> Optional[ModelType]:
        ...

    async def delete(self, id: int) -> bool:
        ...