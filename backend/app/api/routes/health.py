from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.services.ai_service import ai_service
from backend.app.services.mongodb_service import mongodb_service

router = APIRouter()

@router.get("/health")
async def health_check():
    mongo_status = await mongodb_service.ping_async()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_enabled": ai_service.has_api_key,
        "mongodb_connected": mongo_status
    }


