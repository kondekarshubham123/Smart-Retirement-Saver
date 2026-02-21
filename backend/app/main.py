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

# configure CORS so that web clients (e.g. localhost:3000) can make
# requests to the API.  adjust the origins list as appropriate for
# production.  preflight requests must be handled by the middleware.
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    # add other allowed origins here, or use ["*"] for all
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.include_router(api_router, prefix="/blackrock/challenge/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
