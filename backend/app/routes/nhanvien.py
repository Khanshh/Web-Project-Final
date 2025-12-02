import uuid
from decimal import Decimal
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.db_models import NhanVien
from app.models import NhanVienSchema, UpdateNhanVienSchema

router = APIRouter()


def serialize_nv(nv: NhanVien):
    return {
        "ma_nhan_vien": nv.ma_nhan_vien,
        "ho_ten": nv.ho_ten,
        "ma_phong": nv.ma_phong,
        "ma_chuc_vu": nv.ma_chuc_vu,
        "muc_luong_co_ban": str(nv.muc_luong_co_ban or Decimal("0")),
    }


@router.get("/", response_description="Nhan vien retrieved")
async def get_nhanviens(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(NhanVien))
    return [serialize_nv(nv) for nv in result.scalars().all()]

@router.post("/", response_description="Nhan vien data added into the database")
async def add_nhanvien(
    nhanvien: NhanVienSchema = Body(...),
    session: AsyncSession = Depends(get_session),
):
    data = jsonable_encoder(nhanvien)

    next_id = f"NV{uuid.uuid4().hex[:5].upper()}"
    new_nv = NhanVien(
        ma_nhan_vien=data.get("ma_nhan_vien", next_id),
        ho_ten=data["ho_ten"],
        ma_phong=data["ma_phong"],
        ma_chuc_vu=data["ma_chuc_vu"],
        muc_luong_co_ban=Decimal(data["muc_luong_co_ban"]),
    )
    session.add(new_nv)
    await session.commit()
    await session.refresh(new_nv)
    return serialize_nv(new_nv)

@router.put("/{id}")
async def update_nhanvien(
    id: str,
    req: UpdateNhanVienSchema = Body(...),
    session: AsyncSession = Depends(get_session),
):
    req = {k: v for k, v in req.dict().items() if v is not None}

    update_data = {}
    if "ho_ten_moi" in req:
        update_data["ho_ten"] = req["ho_ten_moi"]
    if "ma_phong_moi" in req:
        update_data["ma_phong"] = req["ma_phong_moi"]
    if "ma_chuc_vu_moi" in req:
        update_data["ma_chuc_vu"] = req["ma_chuc_vu_moi"]
    if "muc_luong_co_ban_moi" in req:
        update_data["muc_luong_co_ban"] = Decimal(req["muc_luong_co_ban_moi"])

    if update_data:
        stmt = (
            update(NhanVien)
            .where(NhanVien.ma_nhan_vien == id)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )
        result = await session.execute(stmt)
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Nhan vien not found")
        await session.commit()
        return {"message": "Nhan vien updated successfully"}
    raise HTTPException(status_code=400, detail="No data to update")

@router.delete("/{id}", response_description="Nhan vien data deleted from the database")
async def delete_nhanvien(id: str, session: AsyncSession = Depends(get_session)):
    nv = await session.get(NhanVien, id)
    if not nv:
        raise HTTPException(status_code=404, detail="Nhan vien not found")
    await session.delete(nv)
    await session.commit()
    return {"message": "Nhan vien deleted successfully"}
