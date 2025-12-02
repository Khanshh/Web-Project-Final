import uuid
from datetime import datetime
from decimal import Decimal
from fastapi import APIRouter, Body, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field

from app.db import get_session
from app.db_models import Luong

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
async def get_luong(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Luong))
    luongs = result.scalars().all()
    return [
        {
            "id": lg.id,
            "ma_nhan_vien": lg.ma_nhan_vien,
            "thang_nam": lg.thang_nam,
            "tong_gio_lam": str(lg.tong_gio_lam),
            "gio_tang_ca": str(lg.gio_tang_ca),
            "luong_co_ban": str(lg.luong_co_ban),
            "luong_tang_ca": str(lg.luong_tang_ca),
            "luong_thuc_nhan": str(lg.luong_thuc_nhan),
            "ngay_tinh": lg.ngay_tinh.isoformat(),
        }
        for lg in luongs
    ]


@router.post("/", response_description="Luong data added")
async def add_luong(
    luong: LuongSchema = Body(...),
    session: AsyncSession = Depends(get_session),
):
    data = jsonable_encoder(luong)
    entity = Luong(
        id=str(uuid.uuid4()),
        ma_nhan_vien=data["ma_nhan_vien"],
        thang_nam=data["thang_nam"],
        tong_gio_lam=Decimal(data["tong_gio_lam"]),
        gio_tang_ca=Decimal(data["gio_tang_ca"]),
        luong_co_ban=Decimal(data["luong_co_ban"]),
        luong_tang_ca=Decimal(data["luong_tang_ca"]),
        luong_thuc_nhan=Decimal(data["luong_thuc_nhan"]),
        ngay_tinh=datetime.strptime(data["ngay_tinh"], "%Y-%m-%d").date(),
    )
    session.add(entity)
    await session.commit()
    await session.refresh(entity)
    return {
        "id": entity.id,
        "ma_nhan_vien": entity.ma_nhan_vien,
        "thang_nam": entity.thang_nam,
        "tong_gio_lam": str(entity.tong_gio_lam),
        "gio_tang_ca": str(entity.gio_tang_ca),
        "luong_co_ban": str(entity.luong_co_ban),
        "luong_tang_ca": str(entity.luong_tang_ca),
        "luong_thuc_nhan": str(entity.luong_thuc_nhan),
        "ngay_tinh": entity.ngay_tinh.isoformat(),
    }
