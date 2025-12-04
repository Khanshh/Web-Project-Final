import uuid
from decimal import Decimal
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, update, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.db_models import NhanVien, User, ChamCong, Luong
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

    username = data.pop("username", None)
    password = data.pop("password", None)

    # Nếu truyền username/password thì kiểm tra trùng trước
    if username and password:
        existing = await session.scalar(select(User).where(User.username == username))
        if existing:
            raise HTTPException(status_code=400, detail="Username đã tồn tại")

    # Tính thứ tự vào công ty (tối đa 4 chữ số)
    # Lấy MAX(thu_tu_vao_cong_ty) hiện tại rồi +1
    result = await session.execute(select(func.max(NhanVien.thu_tu_vao_cong_ty)))
    current_max = result.scalar() or 0
    next_order = current_max + 1
    order_str = f"{next_order:04d}"

    # Sinh mã nhân viên theo cú pháp: <Mã phòng><Mã chức vụ><Thứ tự vào công ty>
    ma_phong = data["ma_phong"]
    ma_chuc_vu = data["ma_chuc_vu"]
    ma_nhan_vien = f"{ma_phong}{ma_chuc_vu}{order_str}"

    new_nv = NhanVien(
        ma_nhan_vien=ma_nhan_vien,
        ho_ten=data["ho_ten"],
        ma_phong=ma_phong,
        ma_chuc_vu=ma_chuc_vu,
        muc_luong_co_ban=Decimal(data["muc_luong_co_ban"]),
        thu_tu_vao_cong_ty=next_order,
    )
    session.add(new_nv)

    # Nếu có thông tin tài khoản thì tạo luôn user gắn với nhân viên
    if username and password:
        new_user = User(
            id=str(uuid.uuid4()),
            username=username,
            password=password,
            ho_ten=new_nv.ho_ten,
            ma_nhan_vien=new_nv.ma_nhan_vien,
        )
        session.add(new_user)

    await session.commit()
    await session.refresh(new_nv)
    return serialize_nv(new_nv)

@router.put("/{id}")
async def update_nhanvien(
    id: str,
    req: UpdateNhanVienSchema = Body(...),
    session: AsyncSession = Depends(get_session),
):
    req_data = {k: v for k, v in req.dict().items() if v is not None}

    # Lấy nhân viên hiện tại
    nv = await session.scalar(select(NhanVien).where(NhanVien.ma_nhan_vien == id))
    if not nv:
        raise HTTPException(status_code=404, detail="Nhan vien not found")

    # Cập nhật các trường cơ bản
    if "ho_ten_moi" in req_data:
        nv.ho_ten = req_data["ho_ten_moi"]
    if "muc_luong_co_ban_moi" in req_data:
        nv.muc_luong_co_ban = Decimal(req_data["muc_luong_co_ban_moi"])

    # Nếu thay đổi phòng ban hoặc chức vụ thì sinh lại mã nhân viên
    ma_phong_moi = req_data.get("ma_phong_moi")
    ma_chuc_vu_moi = req_data.get("ma_chuc_vu_moi")

    if ma_phong_moi or ma_chuc_vu_moi:
        new_ma_phong = ma_phong_moi or nv.ma_phong
        new_ma_chuc_vu = ma_chuc_vu_moi or nv.ma_chuc_vu

        # Thứ tự vào công ty giữ nguyên, chỉ thay đổi tiền tố
        order = nv.thu_tu_vao_cong_ty or 0
        order_str = f"{order:04d}"
        nv.ma_phong = new_ma_phong
        nv.ma_chuc_vu = new_ma_chuc_vu
        nv.ma_nhan_vien = f"{new_ma_phong}{new_ma_chuc_vu}{order_str}"

    await session.commit()
    return {"message": "Nhan vien updated successfully"}

@router.delete("/{id}", response_description="Nhan vien data deleted from the database")
async def delete_nhanvien(id: str, session: AsyncSession = Depends(get_session)):
    nv = await session.get(NhanVien, id)
    if not nv:
        raise HTTPException(status_code=404, detail="Nhan vien not found")
    
    # Xóa tất cả các bản ghi liên quan trước
    # 1. Xóa các user liên quan
    users_stmt = select(User).where(User.ma_nhan_vien == id)
    users_result = await session.execute(users_stmt)
    users = users_result.scalars().all()
    for user in users:
        await session.delete(user)
    
    # 2. Xóa các bản ghi chấm công liên quan
    chamcong_stmt = select(ChamCong).where(ChamCong.ma_nhan_vien == id)
    chamcong_result = await session.execute(chamcong_stmt)
    chamcongs = chamcong_result.scalars().all()
    for cc in chamcongs:
        await session.delete(cc)
    
    # 3. Xóa các bản ghi lương liên quan
    luong_stmt = select(Luong).where(Luong.ma_nhan_vien == id)
    luong_result = await session.execute(luong_stmt)
    luongs = luong_result.scalars().all()
    for luong in luongs:
        await session.delete(luong)
    
    # 4. Cuối cùng mới xóa nhân viên
    await session.delete(nv)
    await session.commit()
    return {"message": "Nhan vien deleted successfully"}
