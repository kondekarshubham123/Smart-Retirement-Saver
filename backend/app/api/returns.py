from fastapi import APIRouter, HTTPException
from app.services.returns import calculate_nps_returns, calculate_index_returns
from app.models.returns import ReturnsRequest, ReturnsResponse, TaskResponse
from app.tasks.calculations import compute_nps_returns_task, compute_index_returns_task
from app.tasks.celery_app import celery
from celery.result import AsyncResult

router = APIRouter()

# 4. Returns Calculation: NPS (Sync)
@router.post("/returns:nps", response_model=ReturnsResponse, tags=["Returns"], summary="Returns Calculation: NPS (Sync)")
def nps_returns(request: ReturnsRequest):
    """Calculates the return on investments for NPS (Sync)."""
    return calculate_nps_returns(request)

# 4. Returns Calculation: Index (Sync)
@router.post("/returns:index", response_model=ReturnsResponse, tags=["Returns"], summary="Returns Calculation: Index Fund (Sync)")
def index_returns(request: ReturnsRequest):
    """Calculates the return on investments for Index Fund (Sync)."""
    return calculate_index_returns(request)

# 5. Async Returns Calculation
@router.post("/returns:nps_async", response_model=TaskResponse, tags=["Returns"], summary="Returns Calculation: NPS (Async)")
def nps_returns_async(request: ReturnsRequest):
    """Submits a background task to calculate NPS returns."""
    task = compute_nps_returns_task.delay(request.model_dump())
    return TaskResponse(task_id=task.id, status="PENDING")

@router.post("/returns:index_async", response_model=TaskResponse, tags=["Returns"], summary="Returns Calculation: Index Fund (Async)")
def index_returns_async(request: ReturnsRequest):
    """Submits a background task to calculate Index returns."""
    task = compute_index_returns_task.delay(request.model_dump())
    return TaskResponse(task_id=task.id, status="PENDING")

@router.get("/returns/status/{task_id}", tags=["Returns"], summary="Get Task Status")
def get_task_status(task_id: str):
    """Polls the status of a background task."""
    result = AsyncResult(task_id, app=celery)
    if result.ready():
        if result.successful():
            return {"task_id": task_id, "status": "SUCCESS", "result": result.result}
        else:
            return {"task_id": task_id, "status": "FAILURE", "error": str(result.result)}
    return {"task_id": task_id, "status": result.status}
