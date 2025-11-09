from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Server
    PORT: int = 5000
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"

settings = Settings()
