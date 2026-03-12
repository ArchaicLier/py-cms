from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any, Mapping, Sequence, Set, Tuple, TypedDict, NotRequired, Union, overload

from sqlmodel import Column, Field as SQLModelField, SQLModel, Table as SqlModelTable, table
from sqlmodel.main import FieldInfo, FieldInfoMetadata, NoArgAnyCallable, OnDeleteType, Undefined # type: ignore[attr-defined]

if TYPE_CHECKING:
    from pydantic._internal._model_construction import ModelMetaclass as ModelMetaclass
    from pydantic._internal._repr import Representation as Representation
    from pydantic_core import PydanticUndefined as Undefined
    from pydantic_core import PydanticUndefinedType as UndefinedType

@dataclass
class Widget:
    name: str

@dataclass
class View:
    name: str

@dataclass
class ReadOnly:
    ...

@overload
def Field(
    default: Any = Undefined,
    *,
    # Ui Metadata
    foreign_table: str | SQLModel | None = None,
    widget: str | None = None,
    read_only: bool = False,
    create_view: bool = False,
    read_view: bool = False,
    edit_view: bool = False,
    custom_views: list[View] = [],

    default_factory: NoArgAnyCallable | None = None,
    alias: str | None = None,
    validation_alias: str | None = None,
    serialization_alias: str | None = None,
    title: str | None = None,
    description: str | None = None,
    exclude: Set[int | str] | Mapping[int | str, Any] | Any = None,
    include: Set[int | str] | Mapping[int | str, Any] | Any = None,
    const: bool | None = None,
    gt: float | None = None,
    ge: float | None = None,
    lt: float | None = None,
    le: float | None = None,
    multiple_of: float | None = None,
    max_digits: int | None = None,
    decimal_places: int | None = None,
    min_items: int | None = None,
    max_items: int | None = None,
    unique_items: bool | None = None,
    min_length: int | None = None,
    max_length: int | None = None,
    allow_mutation: bool = True,
    regex: str | None = None,
    discriminator: str | None = None,
    repr: bool = True,
    primary_key: bool | UndefinedType = Undefined,
    foreign_key: Any = Undefined,
    unique: bool | UndefinedType = Undefined,
    nullable: bool | UndefinedType = Undefined,
    index: bool | UndefinedType = Undefined,
    sa_type: type[Any] | UndefinedType = Undefined,
    sa_column_args: Sequence[Any] | UndefinedType = Undefined,
    sa_column_kwargs: Mapping[str, Any] | UndefinedType = Undefined,
    schema_extra: dict[str, Any] | None = None,
) -> Any: ...


# When foreign_key is str, include ondelete
# include sa_type, sa_column_args, sa_column_kwargs
@overload
def Field(
    default: Any = Undefined,
    *,
    # Ui Metadata
    foreign_table: str | SQLModel | None = None,
    widget: str | None = None,
    read_only: bool = False,
    create_view: bool = False,
    read_view: bool = False,
    edit_view: bool = False,
    custom_views: list[View] = [],

    default_factory: NoArgAnyCallable | None = None,
    alias: str | None = None,
    validation_alias: str | None = None,
    serialization_alias: str | None = None,
    title: str | None = None,
    description: str | None = None,
    exclude: Set[int | str] | Mapping[int | str, Any] | Any = None,
    include: Set[int | str] | Mapping[int | str, Any] | Any = None,
    const: bool | None = None,
    gt: float | None = None,
    ge: float | None = None,
    lt: float | None = None,
    le: float | None = None,
    multiple_of: float | None = None,
    max_digits: int | None = None,
    decimal_places: int | None = None,
    min_items: int | None = None,
    max_items: int | None = None,
    unique_items: bool | None = None,
    min_length: int | None = None,
    max_length: int | None = None,
    allow_mutation: bool = True,
    regex: str | None = None,
    discriminator: str | None = None,
    repr: bool = True,
    primary_key: bool | UndefinedType = Undefined,
    foreign_key: str,
    ondelete: OnDeleteType | UndefinedType = Undefined,
    unique: bool | UndefinedType = Undefined,
    nullable: bool | UndefinedType = Undefined,
    index: bool | UndefinedType = Undefined,
    sa_type: type[Any] | UndefinedType = Undefined,
    sa_column_args: Sequence[Any] | UndefinedType = Undefined,
    sa_column_kwargs: Mapping[str, Any] | UndefinedType = Undefined,
    schema_extra: dict[str, Any] | None = None,
) -> Any: ...


# Include sa_column, don't include
# primary_key
# foreign_key
# ondelete
# unique
# nullable
# index
# sa_type
# sa_column_args
# sa_column_kwargs
@overload
def Field(
    default: Any = Undefined,
    *,
    # Ui Metadata
    foreign_table: str | SQLModel | None = None,
    widget: str | None = None,
    read_only: bool = False,
    create_view: bool = False,
    read_view: bool = False,
    edit_view: bool = False,
    custom_views: list[View] = [],

    default_factory: NoArgAnyCallable | None = None,
    alias: str | None = None,
    validation_alias: str | None = None,
    serialization_alias: str | None = None,
    title: str | None = None,
    description: str | None = None,
    exclude: Set[int | str] | Mapping[int | str, Any] | Any = None,
    include: Set[int | str] | Mapping[int | str, Any] | Any = None,
    const: bool | None = None,
    gt: float | None = None,
    ge: float | None = None,
    lt: float | None = None,
    le: float | None = None,
    multiple_of: float | None = None,
    max_digits: int | None = None,
    decimal_places: int | None = None,
    min_items: int | None = None,
    max_items: int | None = None,
    unique_items: bool | None = None,
    min_length: int | None = None,
    max_length: int | None = None,
    allow_mutation: bool = True,
    regex: str | None = None,
    discriminator: str | None = None,
    repr: bool = True,
    sa_column: Column[Any] | UndefinedType = Undefined,
    schema_extra: dict[str, Any] | None = None,
) -> Any: ...


def Field(
    *args, **kwargs
) -> Any:
    foreign_table: str | SQLModel | None = kwargs.pop("foreign_key", None)
    widget: str | None = kwargs.pop("widget", None)
    read_only: bool = kwargs.pop("read_only", False)
    create_view: bool = kwargs.pop("create_view", False)
    read_view: bool = kwargs.pop("read_view", False)
    edit_view: bool = kwargs.pop("edit_view", False)
    custom_views: list[View] = kwargs.pop("custom_views", [])

    #TODO: Тут нужно добавить добавления данной хни в мету

    field_info: FieldInfo = SQLModelField(*args, **kwargs)

    return field_info

class TestZxc(SQLModel):

    x: int = Field(foreign_key="ffff")

class Tz(TestZxc):
    pass

