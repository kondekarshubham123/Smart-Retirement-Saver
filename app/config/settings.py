from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    nps_rate: float = 0.0711
    index_rate: float = 0.1449
    inflation: float = 0.055
    port: int = 5477
    celery_broker_url: str = "redis://redis:6379/0"
    celery_result_backend: str = "redis://redis:6379/0"
    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()
