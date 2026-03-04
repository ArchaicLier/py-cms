from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Type, List, Any, Optional
import uvicorn

app = FastAPI(title="Universal Pydantic CMS")

# ====================== РЕГИСТРАЦИЯ МОДЕЛЕЙ ======================
MODELS: Dict[str, Type[BaseModel]] = {}
STORES: Dict[str, List[dict]] = {}

def register_model(key: str, model: Type[BaseModel]):

    MODELS[key] = model
    STORES[key] = []
    return model

# Пример моделей (добавляй сюда новые сколько угодно)
class Group(BaseModel):
    id: int
    name: str
    description: Optional[str] = Field(None)

class User(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = Field(
        None,
    )
    rating: int = Field(3, ge=1, le=5, json_schema_extra={"ui:widget": "StarRatingWidget"})
    group_id: Optional[int] = Field(None, title="ID Группы", json_schema_extra={"x-foreign-key": "groups"})

    model_config = {
        "json_schema_extra": {"title": "Сука твою мать это юзя"}
    }

class Product(BaseModel):
    id: int
    name: str
    price: float
    rating: int = Field(3, ge=1, le=5)
    tag_ids: List[int] = Field(default_factory=list)  # множественный выбор

register_model("groups", Group)
register_model("users", User)
register_model("products", Product)

# ====================== УНИВЕРСАЛЬНЫЕ ЭНДПОИНТЫ ======================
@app.get("/models")
def list_models():
    return [{"key": k, "title": m.__name__} for k, m in MODELS.items()]

@app.get("/models/{key}/schema")
def get_schema(key: str):
    if key not in MODELS:
        raise HTTPException(404, "Model not found")
    return MODELS[key].model_json_schema(union_format="primitive_type_array")

@app.get("/models/{key}/items")
def get_items(key: str):
    return STORES[key]

@app.post("/models/{key}/items")
def create_item(key: str, data: dict):
    if key not in MODELS:
        raise HTTPException(404, "Model not found")
    validated = MODELS[key].model_validate(data)
    STORES[key].append(validated.model_dump())
    return validated

@app.put("/models/{key}/items/{item_id}")
def update_item(key: str, item_id: int, data: dict):
    if key not in STORES:
        raise HTTPException(404, "Model not found")
    for i, item in enumerate(STORES[key]):
        if item["id"] == item_id:
            validated = MODELS[key].model_validate(data)
            STORES[key][i] = validated.model_dump()
            return validated
    raise HTTPException(404, "Item not found")

@app.delete("/models/{key}/items/{item_id}")
def delete_item(key: str, item_id: int):
    if key not in STORES:
        raise HTTPException(404, "Model not found")
    STORES[key] = [item for item in STORES[key] if item["id"] != item_id]
    return {"detail": "Deleted"}

if __name__ == "__main__":
    import uvicorn


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True, workers=1)