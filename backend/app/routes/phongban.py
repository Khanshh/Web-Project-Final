from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from app.database import (
    phongban_collection,
    phongban_helper,
)
from app.models import PhongBanSchema, UpdatePhongBanSchema

router = APIRouter()

@router.get("/", response_description="Phong ban retrieved")
async def get_phongbans():
    phongbans = []
    async for phongban in phongban_collection.find():
        phongbans.append(phongban_helper(phongban))
    return phongbans

@router.post("/", response_description="Phong ban data added into the database")
async def add_phongban(phongban: PhongBanSchema = Body(...)):
    phongban = jsonable_encoder(phongban)
    new_phongban = await phongban_collection.insert_one(phongban)
    created_phongban = await phongban_collection.find_one({"_id": new_phongban.inserted_id})
    return phongban_helper(created_phongban)

@router.put("/{id}")
async def update_phongban(id: str, req: UpdatePhongBanSchema = Body(...)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    
    update_data = {}
    if "ma_phong_ban_moi" in req:
        update_data["ma_phong"] = req["ma_phong_ban_moi"]
    if "ten_phong_ban_moi" in req:
        update_data["ten_phong"] = req["ten_phong_ban_moi"]
    if "nam_thanh_lap_moi" in req:
        update_data["nam_thanh_lap"] = req["nam_thanh_lap_moi"]
    if "trang_thai_moi" in req:
        update_data["trang_thai"] = req["trang_thai_moi"]

    if update_data:
        updated_phongban = await phongban_collection.update_one(
            {"ma_phong": id}, {"$set": update_data}
        )
        if updated_phongban:
            return "Phong ban updated successfully"
    return "Error updating phong ban"

@router.delete("/{id}", response_description="Phong ban data deleted from the database")
async def delete_phongban(id: str):
    deleted_phongban = await phongban_collection.delete_one({"ma_phong": id})
    if deleted_phongban.deleted_count > 0:
        return "Phong ban deleted successfully"
    return "Error deleting phong ban"
