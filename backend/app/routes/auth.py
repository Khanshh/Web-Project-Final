from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from app.database import users_collection, user_helper
from app.models import UserRegisterSchema, UserLoginSchema

router = APIRouter()

@router.post("/register", response_description="Register new user")
async def register(user: UserRegisterSchema = Body(...)):
    user_data = jsonable_encoder(user)
    
    # Check if username exists
    existing_user = await users_collection.find_one({"username": user_data["username"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = await users_collection.insert_one(user_data)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    return user_helper(created_user)

@router.post("/login", response_description="Login user")
async def login(user: UserLoginSchema = Body(...)):
    user_data = jsonable_encoder(user)
    
    existing_user = await users_collection.find_one({
        "username": user_data["username"],
        "password": user_data["password"] # In real app, hash password!
    })
    
    if existing_user:
        return {
            "message": "Login successful",
            "user": user_helper(existing_user),
            "role": "admin" if existing_user["username"] == "admin" else "user"
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")
