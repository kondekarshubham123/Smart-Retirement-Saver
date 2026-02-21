from fastapi import APIRouter
from app.services.performance import get_performance_report
from app.models.performance import PerformanceResponse

router = APIRouter()

# 5. Performance Report
@router.get("/performance", response_model=PerformanceResponse, tags=["Performance"], summary="Performance Report")
def performance() -> PerformanceResponse:
    """Reports system execution metrics such as response time, memory usage, and number of threads used."""
    return get_performance_report()
