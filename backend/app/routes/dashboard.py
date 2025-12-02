from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.db_models import ChamCong, ChucVu, NhanVien, PhongBan

router = APIRouter()


@router.get("/stats", response_description="Get dashboard stats")
async def get_stats(session: AsyncSession = Depends(get_session)):
    nv_count = await session.scalar(select(func.count()).select_from(NhanVien)) or 0
    pb_count = await session.scalar(select(func.count()).select_from(PhongBan)) or 0
    cv_count = await session.scalar(select(func.count()).select_from(ChucVu)) or 0

    today = datetime.now().date()
    cc_stmt = select(func.count()).select_from(ChamCong).where(ChamCong.ngay == today)
    cc_count = await session.scalar(cc_stmt) or 0

    return {
        "nhan_vien_count": nv_count,
        "cham_cong_today": cc_count,
        "phong_ban_count": pb_count,
        "chuc_vu_count": cv_count,
    }
