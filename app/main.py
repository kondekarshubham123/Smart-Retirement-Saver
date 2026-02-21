from fastapi import FastAPI
from app.config.settings import get_settings
from app.api import router as api_router
import logging

settings = get_settings()

app = FastAPI(
    title="Blackrock Hackathon API",
    docs_url="/blackrock/challenge/v1/docs",
    redoc_url="/blackrock/challenge/v1/redoc",
    openapi_url="/blackrock/challenge/v1/openapi.json"
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.include_router(api_router, prefix="/blackrock/challenge/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
