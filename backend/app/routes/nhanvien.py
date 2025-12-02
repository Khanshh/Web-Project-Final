from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from app.database import (
    nhanvien_collection,
    nhanvien_helper,
)
from app.models import NhanVienSchema, UpdateNhanVienSchema

router = APIRouter()

@router.get("/", response_description="Nhan vien retrieved")
async def get_nhanviens():
    nhanviens = []
    async for nhanvien in nhanvien_collection.find():
        nhanviens.append(nhanvien_helper(nhanvien))
    return nhanviens

@router.post("/", response_description="Nhan vien data added into the database")
async def add_nhanvien(nhanvien: NhanVienSchema = Body(...)):
    nhanvien = jsonable_encoder(nhanvien)
    
    # Generate ID
    # Simple logic: count existing docs and add 1. Not concurrency safe but fine for this project.
    count = await nhanvien_collection.count_documents({})
    new_id = f"NV{count + 1:03d}"
    nhanvien["ma_nhan_vien"] = new_id
    
    new_nhanvien = await nhanvien_collection.insert_one(nhanvien)
    created_nhanvien = await nhanvien_collection.find_one({"_id": new_nhanvien.inserted_id})
    return nhanvien_helper(created_nhanvien)

@router.put("/{id}")
async def update_nhanvien(id: str, req: UpdateNhanVienSchema = Body(...)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    
    # Map frontend "moi" fields to db fields
    update_data = {}
    if "ho_ten_moi" in req:
        update_data["ho_ten"] = req["ho_ten_moi"]
    if "ma_phong_moi" in req:
        update_data["ma_phong"] = req["ma_phong_moi"]
    if "ma_chuc_vu_moi" in req:
        update_data["ma_chuc_vu"] = req["ma_chuc_vu_moi"]
    if "muc_luong_co_ban_moi" in req:
        update_data["muc_luong_co_ban"] = req["muc_luong_co_ban_moi"]

    if update_data:
        updated_nhanvien = await nhanvien_collection.update_one(
            {"ma_nhan_vien": id}, {"$set": update_data}
        )
        if updated_nhanvien:
            return "Nhan vien updated successfully"
    return "Error updating nhan vien"

@router.delete("/{id}", response_description="Nhan vien data deleted from the database")
async def delete_nhanvien(id: str):
    deleted_nhanvien = await nhanvien_collection.delete_one({"ma_nhan_vien": id})
    if deleted_nhanvien.deleted_count > 0:
        return "Nhan vien deleted successfully"
    return "Error deleting nhan vien"
