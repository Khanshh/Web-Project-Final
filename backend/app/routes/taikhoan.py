from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal
from datetime import date, timedelta
import uuid

from app.db import get_session
from app.db_models import NhanVien, User, PhongBan, ChucVu, ChamCong, Luong

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


@router.post("/reset-data")
async def reset_data(session: AsyncSession = Depends(get_session)):
    """
    Xóa hết dữ liệu trong DB, chỉ giữ lại tài khoản admin (username='admin').
    Dùng để reset dữ liệu test.
    """
    # 1. Xóa tất cả user KHÔNG phải admin trước (do có FK tới NhanVien)
    await session.execute(delete(User).where(User.username != "admin"))

    # 2. Xóa các bản ghi lương, chấm công, nhân viên, phòng ban, chức vụ
    await session.execute(delete(Luong))
    await session.execute(delete(ChamCong))
    await session.execute(delete(NhanVien))
    await session.execute(delete(PhongBan))
    await session.execute(delete(ChucVu))

    await session.commit()

    return {"message": "Đã reset dữ liệu, chỉ giữ lại tài khoản admin"}


@router.post("/seed-demo-employees")
async def seed_demo_employees(session: AsyncSession = Depends(get_session)):
    """
    Tạo khoảng 50 nhân viên demo với phòng ban, chức vụ, lương cơ bản và mã NV đúng quy tắc.
    """
    # Đảm bảo có một số phòng ban demo
    demo_phongbans = [
        {"ma_phong": "PDT", "ten_phong": "Phòng Đào tạo", "nam_thanh_lap": "2015", "trang_thai": "Hoạt động"},
        {"ma_phong": "PNS", "ten_phong": "Phòng Nhân sự", "nam_thanh_lap": "2016", "trang_thai": "Hoạt động"},
        {"ma_phong": "PKT", "ten_phong": "Phòng Kế toán", "nam_thanh_lap": "2014", "trang_thai": "Hoạt động"},
        {"ma_phong": "PKD", "ten_phong": "Phòng Kinh doanh", "nam_thanh_lap": "2018", "trang_thai": "Hoạt động"},
    ]

    for pb_data in demo_phongbans:
        existing_pb = await session.get(PhongBan, pb_data["ma_phong"])
        if not existing_pb:
            session.add(PhongBan(**pb_data))

    # Đảm bảo có các chức vụ cơ bản (TP, PP, NV) - trùng với seed_default_chucvu
    demo_chucvu_defs = [
        {"ma_chuc_vu": "TP", "ten_chuc_vu": "Trưởng phòng"},
        {"ma_chuc_vu": "PP", "ten_chuc_vu": "Phó phòng"},
        {"ma_chuc_vu": "NV", "ten_chuc_vu": "Nhân viên"},
    ]

    for cv_data in demo_chucvu_defs:
        existing_cv = await session.get(ChucVu, cv_data["ma_chuc_vu"])
        if not existing_cv:
            session.add(ChucVu(**cv_data))

    demo_chucvus = [cv["ma_chuc_vu"] for cv in demo_chucvu_defs]

    # Lấy thứ tự hiện tại lớn nhất
    result = await session.execute(select(func.max(NhanVien.thu_tu_vao_cong_ty)))
    current_max = result.scalar() or 0
    next_order = current_max

    created = 0
    for i in range(1, 51):
        next_order += 1
        order_str = f"{next_order:04d}"

        pb = demo_phongbans[(i - 1) % len(demo_phongbans)]
        ma_phong = pb["ma_phong"]
        ma_chuc_vu = demo_chucvus[(i - 1) % len(demo_chucvus)]

        ma_nhan_vien = f"{ma_phong}{ma_chuc_vu}{order_str}"

        # Tạo nhân viên
        base_salary = Decimal("8000000") + Decimal(str((i % 5) * 500000))
        nv = NhanVien(
            ma_nhan_vien=ma_nhan_vien,
            ho_ten=f"Nhân viên {i:02d}",
            ma_phong=ma_phong,
            ma_chuc_vu=ma_chuc_vu,
            muc_luong_co_ban=base_salary,
            thu_tu_vao_cong_ty=next_order,
        )
        session.add(nv)

        # Tạo tài khoản tương ứng cho nhân viên
        username = f"nv{i:02d}"
        user = User(
            id=str(uuid.uuid4()),
            username=username,
            password="123456",
            ho_ten=nv.ho_ten,
            ma_nhan_vien=ma_nhan_vien,
        )
        session.add(user)

        # Tạo dữ liệu chấm công mẫu (3 ngày gần nhất)
        today = date.today()
        for d in range(1, 4):
            work_date = today - timedelta(days=d)
            cc = ChamCong(
                id=str(uuid.uuid4()),
                ma_nhan_vien=ma_nhan_vien,
                ngay=work_date,
                checkin_sang="08:00",
                checkout_sang="12:00",
                checkin_chieu="13:30",
                checkout_chieu="17:30",
            )
            session.add(cc)

        # Tạo dữ liệu lương mẫu cho tháng hiện tại
        thang_nam = today.strftime("%Y-%m")
        luong = Luong(
            id=str(uuid.uuid4()),
            ma_nhan_vien=ma_nhan_vien,
            thang_nam=thang_nam,
            tong_gio_lam=Decimal("160.0"),
            gio_tang_ca=Decimal("10.0"),
            luong_co_ban=base_salary,
            luong_tang_ca=Decimal("1000000"),
            luong_thuc_nhan=base_salary + Decimal("1000000"),
            ngay_tinh=today,
            ghi_chu="Dữ liệu lương demo",
        )
        session.add(luong)

        created += 1

    await session.commit()

    return {
        "message": f"Đã tạo {created} nhân viên demo",
        "from_order": current_max + 1,
        "to_order": next_order,
    }
