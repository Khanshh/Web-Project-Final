from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from app.database import (
    chucvu_collection,
    chucvu_helper,
)
from app.models import ChucVuSchema, UpdateChucVuSchema

router = APIRouter()

@router.get("/", response_description="Chuc vu retrieved")
async def get_chucvus():
    chucvus = []
    async for chucvu in chucvu_collection.find():
        chucvus.append(chucvu_helper(chucvu))
    return chucvus

@router.post("/", response_description="Chuc vu data added into the database")
async def add_chucvu(chucvu: ChucVuSchema = Body(...)):
    chucvu = jsonable_encoder(chucvu)
    new_chucvu = await chucvu_collection.insert_one(chucvu)
    created_chucvu = await chucvu_collection.find_one({"_id": new_chucvu.inserted_id})
    return chucvu_helper(created_chucvu)

@router.put("/{id}")
async def update_chucvu(id: str, req: UpdateChucVuSchema = Body(...)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    
    update_data = {}
    if "ma_chuc_vu_moi" in req:
        update_data["ma_chuc_vu"] = req["ma_chuc_vu_moi"]
    if "ten_chuc_vu_moi" in req:
        update_data["ten_chuc_vu"] = req["ten_chuc_vu_moi"]

    if update_data:
        updated_chucvu = await chucvu_collection.update_one(
            {"ma_chuc_vu": id}, {"$set": update_data}
        )
        if updated_chucvu:
            return "Chuc vu updated successfully"
    return "Error updating chuc vu"

@router.delete("/{id}", response_description="Chuc vu data deleted from the database")
async def delete_chucvu(id: str):
    deleted_chucvu = await chucvu_collection.delete_one({"ma_chuc_vu": id})
    if deleted_chucvu.deleted_count > 0:
        return "Chuc vu deleted successfully"
    return "Error deleting chuc vu"
