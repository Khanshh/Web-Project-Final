import uuid
from datetime import datetime, date
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.db_models import ChamCong
from app.models import CheckInCheckOutSchema

router = APIRouter()


def serialize_cc(cc: ChamCong):
    return {
        "id": cc.id,
        "ma_nhan_vien": cc.ma_nhan_vien,
        "ngay": cc.ngay.isoformat(),
        "checkin": cc.checkin or "",
        "checkout": cc.checkout or "",
    }


@router.get("/", response_description="Get all attendance records")
async def get_chamcong(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ChamCong))
    return [serialize_cc(cc) for cc in result.scalars().all()]


@router.post("/", response_description="Check in/out")
async def check_in_out(
    data: CheckInCheckOutSchema = Body(...),
    session: AsyncSession = Depends(get_session),
):
    today: date = datetime.now().date()

    stmt = select(ChamCong).where(
        ChamCong.ma_nhan_vien == data.ma_nhan_vien,
        ChamCong.ngay == today,
    )
    existing_record = await session.scalar(stmt)

    if data.type == "checkin":
        if existing_record:
            return {"message": "Already checked in today", "record": serialize_cc(existing_record)}

        entity = ChamCong(
            id=str(uuid.uuid4()),
            ma_nhan_vien=data.ma_nhan_vien,
            ngay=today,
            checkin=data.time,
            checkout=None,
        )
        session.add(entity)
        await session.commit()
        return {"message": "Check-in successful"}

    if data.type == "checkout":
        if not existing_record:
            raise HTTPException(status_code=400, detail="Cannot check out without check in")
        existing_record.checkout = data.time
        await session.commit()
        return {"message": "Check-out successful"}

    raise HTTPException(status_code=400, detail="Invalid type")


@router.get("/my-attendance/{ma_nhan_vien}", response_description="Get my attendance")
async def get_my_attendance(
    ma_nhan_vien: str,
    session: AsyncSession = Depends(get_session),
):
    stmt = select(ChamCong).where(ChamCong.ma_nhan_vien == ma_nhan_vien)
    result = await session.execute(stmt)
    return [serialize_cc(cc) for cc in result.scalars().all()]
