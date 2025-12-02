from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from app.database import chamcong_collection, chamcong_helper
from app.models import ChamCongSchema, CheckInCheckOutSchema
from datetime import datetime

router = APIRouter()

@router.get("/", response_description="Get all attendance records")
async def get_chamcong():
    chamcongs = []
    async for cc in chamcong_collection.find():
        chamcongs.append(chamcong_helper(cc))
    return chamcongs

@router.post("/", response_description="Check in/out")
async def check_in_out(data: CheckInCheckOutSchema = Body(...)):
    # Find record for today
    today = datetime.now().strftime("%Y-%m-%d")
    
    existing_record = await chamcong_collection.find_one({
        "ma_nhan_vien": data.ma_nhan_vien,
        "ngay": today
    })
    
    if data.type == "checkin":
        if existing_record:
             # Already checked in, maybe update checkin time? Or ignore.
             # For simplicity, let's say we update checkin if it was empty (unlikely) or just return success.
             return {"message": "Already checked in today", "record": chamcong_helper(existing_record)}
        
        # Create new record
        new_record = {
            "ma_nhan_vien": data.ma_nhan_vien,
            "ngay": today,
            "checkin": data.time,
            "checkout": ""
        }
        await chamcong_collection.insert_one(new_record)
        return {"message": "Check-in successful"}

    elif data.type == "checkout":
        if not existing_record:
            raise HTTPException(status_code=400, detail="Cannot check out without check in")
        
        await chamcong_collection.update_one(
            {"_id": existing_record["_id"]},
            {"$set": {"checkout": data.time}}
        )
        return {"message": "Check-out successful"}
    
    raise HTTPException(status_code=400, detail="Invalid type")

@router.get("/my-attendance/{ma_nhan_vien}", response_description="Get my attendance")
async def get_my_attendance(ma_nhan_vien: str):
    chamcongs = []
    async for cc in chamcong_collection.find(): # JsonDB find() yields all, we filter manually or use find_list
        if cc.get("ma_nhan_vien") == ma_nhan_vien:
             chamcongs.append(chamcong_helper(cc))
    return chamcongs
