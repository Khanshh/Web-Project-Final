from app.json_db import JsonDB

# Replace motor client with JsonDB instances
nhanvien_collection = JsonDB("nhanvien")
phongban_collection = JsonDB("phongban")
chucvu_collection = JsonDB("chucvu")
luong_collection = JsonDB("luong")
users_collection = JsonDB("users")
chamcong_collection = JsonDB("chamcong")

# Helpers
def nhanvien_helper(nhanvien) -> dict:
    return {
        "ma_nhan_vien": nhanvien.get("ma_nhan_vien"),
        "ho_ten": nhanvien.get("ho_ten"),
        "ma_phong": nhanvien.get("ma_phong"),
        "ma_chuc_vu": nhanvien.get("ma_chuc_vu"),
        "muc_luong_co_ban": str(nhanvien.get("muc_luong_co_ban", "")),
    }

def phongban_helper(phongban) -> dict:
    return {
        "ma_phong": phongban.get("ma_phong"),
        "ten_phong": phongban.get("ten_phong"),
        "nam_thanh_lap": str(phongban.get("nam_thanh_lap", "")),
        "trang_thai": phongban.get("trang_thai"),
    }

def chucvu_helper(chucvu) -> dict:
    return {
        "ma_chuc_vu": chucvu.get("ma_chuc_vu"),
        "ten_chuc_vu": chucvu.get("ten_chuc_vu"),
    }

def luong_helper(luong) -> dict:
    return {
        "id": str(luong.get("_id", "")),
        "ma_nhan_vien": luong.get("ma_nhan_vien"),
        "thang_nam": luong.get("thang_nam"),
        "tong_gio_lam": str(luong.get("tong_gio_lam", "")),
        "gio_tang_ca": str(luong.get("gio_tang_ca", "")),
        "luong_co_ban": str(luong.get("luong_co_ban", "")),
        "luong_tang_ca": str(luong.get("luong_tang_ca", "")),
        "luong_thuc_nhan": str(luong.get("luong_thuc_nhan", "")),
        "ngay_tinh": luong.get("ngay_tinh"),
    }

def user_helper(user) -> dict:
    return {
        "id": str(user.get("_id", "")),
        "username": user.get("username"),
        "ho_ten": user.get("ho_ten"),
        # Password should not be returned usually, but for internal check maybe
    }

def chamcong_helper(cc) -> dict:
    return {
        "id": str(cc.get("_id", "")),
        "ma_nhan_vien": cc.get("ma_nhan_vien"),
        "ngay": cc.get("ngay"),
        "checkin": cc.get("checkin"),
        "checkout": cc.get("checkout"),
    }
