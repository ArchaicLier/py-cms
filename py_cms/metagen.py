from enum import Enum
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, TypeAdapter
from typing import List, Literal, Type, Optional, Any, Dict

from py_cms.repo import SqlAlchemyRepository

class CrudGenerator[_T_TABLE_VIEW_S: BaseModel,_T_CREATE_S: BaseModel, _T_EDIT_S: BaseModel, _T_VIEW_S: BaseModel]:
    def __init__(
        self,
        repository: SqlAlchemyRepository,
        # schemas: Any,  # ожидается объект с атрибутами TableViewSchema, CreateSchema, EditSchema, ViewSchema
        table_view_schema: type[_T_TABLE_VIEW_S],
        create_schema: type[_T_CREATE_S],
        edit_schema: type[_T_EDIT_S],
        view_schema: type[_T_VIEW_S],

        prefix: str = "/sex",
        tags: Optional[list[str|Enum]] = None,
    ):
        self.repo = repository
        self.table_view_schema = table_view_schema
        self.create_schema = create_schema
        self.edit_schema = edit_schema
        self.view_schema = view_schema
        self.prefix = prefix
        self.tags = tags or [prefix.strip("/") or "items"]

    def get_router(self) -> APIRouter:
        router = APIRouter(prefix=self.prefix, tags=self.tags)

        @router.get("/", response_model=List[_T_VIEW_S])
        async def get_all():
            items = await self.repo.get_all()
            # предполагается, что Pydantic модели умеют загружаться из ORM (from_attributes=True)
            return [self.table_view_schema.model_validate(item, from_attributes=True) for item in items]

        @router.get("/{item_id}", response_model=_T_VIEW_S)
        async def get_one(item_id: int):
            item = await self.repo.get_by_id(item_id)
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.view_schema.model_validate(item, from_attributes=True)

        @router.post("/", response_model=_T_VIEW_S, status_code=status.HTTP_201_CREATED)
        async def create(data: _T_CREATE_S):
            created = await self.repo.create(data.model_dump())
            return self.view_schema.model_validate(created, from_attributes=True)

        @router.put("/{item_id}", response_model=_T_VIEW_S)
        async def update(item_id: int, data: _T_EDIT_S):
            updated = await self.repo.update(item_id, data.model_dump(exclude_unset=True))
            if not updated:
                raise HTTPException(status_code=404, detail="Item not found")
            return self.view_schema.model_validate(updated, from_attributes=True)

        @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
        async def delete(item_id: int):
            deleted = await self.repo.delete(item_id)
            if not deleted:
                raise HTTPException(status_code=404, detail="Item not found")
            return None

        @router.get("/schemas/all", response_model=dict)
        async def get_json_schemas():
            """Возвращает JSON Schema для всех типов моделей."""
            return {
                "table": self.table_view_schema.model_json_schema(union_format="primitive_type_array"),
                "create": self.create_schema.model_json_schema(union_format="primitive_type_array"),
                "edit": self.edit_schema.model_json_schema(union_format="primitive_type_array"),
                "view": self.view_schema.model_json_schema(union_format="primitive_type_array"),
            }

        @router.get("/schemas/{type_name}", response_model=dict[str,Any])
        async def get_json_schema(type_name: Literal["table", "create", "edit", "view"]):
            return (await get_json_schemas())[type_name]

        return router