from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import test_routes

# Khởi tạo FastAPI app
app = FastAPI(
    title="Backend API",
    description="FastAPI Backend Base",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(test_routes.router, prefix="/api", tags=["test"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to FastAPI Backend!",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG
    )
