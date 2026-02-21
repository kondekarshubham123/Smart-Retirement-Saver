from fastapi import APIRouter
from .transactions import router as transactions_router
from .returns import router as returns_router
from .performance import router as performance_router
from .auth import router as auth_router
from .corpus import router as corpus_router

router = APIRouter()
router.include_router(transactions_router)
router.include_router(returns_router)
router.include_router(performance_router)
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(corpus_router, prefix="/corpus", tags=["corpus"])
