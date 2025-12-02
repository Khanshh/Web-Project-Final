from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from app.database import users_collection, user_helper, nhanvien_collection, nhanvien_helper

router = APIRouter()

@router.get("/", response_description="Get all users")
async def get_users():
    users = []
    async for user in users_collection.find():
        users.append(user_helper(user))
    return users

@router.get("/{username}", response_description="Get user info")
async def get_user(username: str):
    user = await users_collection.find_one({"username": username})
    if user:
        # Try to find associated employee info if possible
        # Assuming username might be related to ma_nhan_vien or we just return user info
        # The frontend expects: name, email, username, department, employeeId, role
        # We might need to join with nhanvien collection if we had a link.
        # For now, return basic info.
        
        return {
            "name": user.get("ho_ten", ""),
            "email": f"{username}@example.com", # Mock
            "username": user["username"],
            "department": "Unknown", # Need link
            "employeeId": "Unknown", # Need link
            "role": "Admin" if username == "admin" else "User"
        }
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/{username}", response_description="Update user password")
async def update_user(username: str, data: dict = Body(...)):
    user = await users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if "password_new" in data:
        await users_collection.update_one(
            {"username": username},
            {"$set": {"password": data["password_new"]}}
        )
        return {"message": "Password updated"}
    
    return {"message": "No changes"}
