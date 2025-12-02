from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder
from app.database import (
    luong_collection,
    luong_helper,
)
from pydantic import BaseModel, Field

router = APIRouter()

class LuongSchema(BaseModel):
    ma_nhan_vien: str = Field(...)
    thang_nam: str = Field(...)
    tong_gio_lam: str = Field(...)
    gio_tang_ca: str = Field(...)
    luong_co_ban: str = Field(...)
    luong_tang_ca: str = Field(...)
    luong_thuc_nhan: str = Field(...)
    ngay_tinh: str = Field(...)

@router.get("/", response_description="Luong nhan vien retrieved")
async def get_luong():
    luongs = []
    async for luong in luong_collection.find():
        luongs.append(luong_helper(luong))
    return luongs

@router.post("/", response_description="Luong data added")
async def add_luong(luong: LuongSchema = Body(...)):
    luong = jsonable_encoder(luong)
    new_luong = await luong_collection.insert_one(luong)
    created_luong = await luong_collection.find_one({"_id": new_luong.inserted_id})
    return luong_helper(created_luong)
