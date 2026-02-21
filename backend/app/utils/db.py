from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config.settings import get_settings
import os

settings = get_settings()

# Use the environment variable if present, otherwise fallback to settings
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/blackrock")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
