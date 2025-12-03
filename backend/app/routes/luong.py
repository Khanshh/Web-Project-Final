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

    # Chuyển sang Decimal để xử lý nghiệp vụ
    tong_gio_lam = Decimal(data["tong_gio_lam"])
    gio_tang_ca = Decimal(data["gio_tang_ca"])
    luong_co_ban = Decimal(data["luong_co_ban"])
    luong_tang_ca = Decimal(data["luong_tang_ca"])
    luong_thuc_nhan = Decimal(data["luong_thuc_nhan"])

    # RULE: Chỉ những người làm đủ 40 giờ trở lên mới được nhận lương cứng (lương cơ bản)
    # Nếu < 40 giờ thì lương cơ bản = 0, lương thực nhận = chỉ còn lương tăng ca
    if tong_gio_lam < Decimal("40"):
        luong_co_ban = Decimal("0")
        # giữ lại tiền tăng ca nếu có
        luong_thuc_nhan = luong_tang_ca
    entity = Luong(
        id=str(uuid.uuid4()),
        ma_nhan_vien=data["ma_nhan_vien"],
        thang_nam=data["thang_nam"],
        tong_gio_lam=tong_gio_lam,
        gio_tang_ca=gio_tang_ca,
        luong_co_ban=luong_co_ban,
        luong_tang_ca=luong_tang_ca,
        luong_thuc_nhan=luong_thuc_nhan,
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


@router.get("/my-salary/{ma_nhan_vien}", response_description="Get salary by employee")
async def get_my_salary(
    ma_nhan_vien: str,
    session: AsyncSession = Depends(get_session),
):
    """Lấy tất cả lương của nhân viên"""
    stmt = select(Luong).where(Luong.ma_nhan_vien == ma_nhan_vien).order_by(Luong.thang_nam.desc())
    result = await session.execute(stmt)
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


@router.get("/my-salary/{ma_nhan_vien}/{year}", response_description="Get salary by employee and year")
async def get_my_salary_by_year(
    ma_nhan_vien: str,
    year: int,
    session: AsyncSession = Depends(get_session),
):
    """Lấy lương của nhân viên theo năm"""
    year_str = str(year)
    stmt = select(Luong).where(
        Luong.ma_nhan_vien == ma_nhan_vien,
        Luong.thang_nam.like(f"{year_str}-%")
    ).order_by(Luong.thang_nam.asc())
    result = await session.execute(stmt)
    luongs = result.scalars().all()
    
    # Tính tổng
    tong_thu_nhap = sum(float(lg.luong_thuc_nhan) for lg in luongs)
    tong_gio_lam = sum(float(lg.tong_gio_lam) for lg in luongs)
    tong_gio_tang_ca = sum(float(lg.gio_tang_ca) for lg in luongs)
    
    return {
        "ma_nhan_vien": ma_nhan_vien,
        "nam": year,
        "tong_thu_nhap": str(tong_thu_nhap),
        "tong_gio_lam": str(tong_gio_lam),
        "tong_gio_tang_ca": str(tong_gio_tang_ca),
        "chi_tiet": [
            {
                "id": lg.id,
                "thang_nam": lg.thang_nam,
                "tong_gio_lam": str(lg.tong_gio_lam),
                "gio_tang_ca": str(lg.gio_tang_ca),
                "luong_co_ban": str(lg.luong_co_ban),
                "luong_tang_ca": str(lg.luong_tang_ca),
                "luong_thuc_nhan": str(lg.luong_thuc_nhan),
            }
            for lg in luongs
        ]
    }
