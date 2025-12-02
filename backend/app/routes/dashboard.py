from fastapi import APIRouter
from app.database import nhanvien_collection, chamcong_collection, phongban_collection, chucvu_collection
from datetime import datetime

router = APIRouter()

@router.get("/stats", response_description="Get dashboard stats")
async def get_stats():
    # Count employees
    nv_count = await nhanvien_collection.count_documents({})
    
    # Count attendance today
    today = datetime.now().strftime("%Y-%m-%d")
    cc_count = await chamcong_collection.count_documents({"ngay": today})
    
    # Count departments
    pb_count = await phongban_collection.count_documents({})
    
    # Count positions
    cv_count = await chucvu_collection.count_documents({})

    return {
        "nhan_vien_count": nv_count,
        "cham_cong_today": cc_count,
        "phong_ban_count": pb_count,
        "chuc_vu_count": cv_count
    }
