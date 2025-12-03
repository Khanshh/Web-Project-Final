from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.db_models import NhanVien, User, PhongBan, ChucVu

router = APIRouter()

@router.get("/", response_description="Get all users")
async def get_users(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    users = result.scalars().all()
    return [
        {"id": user.id, "username": user.username, "ho_ten": user.ho_ten}
        for user in users
    ]

@router.get("/{username}", response_description="Get user info")
async def get_user(username: str, session: AsyncSession = Depends(get_session)):
    user = await session.scalar(select(User).where(User.username == username))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    department = "Unknown"
    department_name = "Unknown"
    employee_id = "Unknown"
    chuc_vu = "Unknown"
    chuc_vu_name = "Unknown"
    muc_luong_co_ban = "0"
    
    if user.ma_nhan_vien:
        nv = await session.get(NhanVien, user.ma_nhan_vien)
        if nv:
            employee_id = nv.ma_nhan_vien
            department = nv.ma_phong
            muc_luong_co_ban = str(nv.muc_luong_co_ban or 0)
            
            # Lấy tên phòng ban
            if nv.ma_phong:
                pb = await session.get(PhongBan, nv.ma_phong)
                if pb:
                    department_name = pb.ten_phong
            
            # Lấy tên chức vụ
            if nv.ma_chuc_vu:
                cv = await session.get(ChucVu, nv.ma_chuc_vu)
                if cv:
                    chuc_vu = nv.ma_chuc_vu
                    chuc_vu_name = cv.ten_chuc_vu

    return {
        "name": user.ho_ten,
        "email": f"{username}@example.com",
        "username": user.username,
        "department": department_name,
        "department_code": department,
        "employeeId": employee_id,
        "chuc_vu": chuc_vu_name,
        "chuc_vu_code": chuc_vu,
        "muc_luong_co_ban": muc_luong_co_ban,
        "role": "Admin" if username == "admin" else "User",
    }

@router.put("/{username}", response_description="Update user password")
async def update_user(
    username: str,
    data: dict = Body(...),
    session: AsyncSession = Depends(get_session),
):
    user = await session.scalar(select(User).where(User.username == username))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if "password_new" in data:
        stmt = (
            update(User)
            .where(User.username == username)
            .values(password=data["password_new"])
        )
        await session.execute(stmt)
        await session.commit()
        return {"message": "Password updated"}

    return {"message": "No changes"}
