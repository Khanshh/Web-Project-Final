from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Model để validate data
class Item(BaseModel):
    id: int
    name: str
    description: str = None

# Fake database
fake_db = [
    {"id": 1, "name": "Item 1", "description": "This is item 1"},
    {"id": 2, "name": "Item 2", "description": "This is item 2"},
]

@router.get("/test")
async def test():
    return {"message": "Test route is working!"}

@router.get("/items", response_model=List[Item])
async def get_items():
    return fake_db

@router.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    for item in fake_db:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@router.post("/items", response_model=Item)
async def create_item(item: Item):
    fake_db.append(item.dict())
    return item
