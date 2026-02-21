from fastapi import APIRouter
from app.services.returns import calculate_nps_returns, calculate_index_returns
from app.models.returns import ReturnsRequest, ReturnsResponse

router = APIRouter()

# 4. Returns Calculation: NPS
@router.post("/returns:nps", response_model=ReturnsResponse, tags=["Returns"], summary="Returns Calculation: NPS")
def nps_returns(request: ReturnsRequest):
    """Calculates the return on investments for NPS."""
    return calculate_nps_returns(request)

# 4. Returns Calculation: Index
@router.post("/returns:index", response_model=ReturnsResponse, tags=["Returns"], summary="Returns Calculation: Index Fund")
def index_returns(request: ReturnsRequest):
    """Calculates the return on investments for Index Fund."""
    return calculate_index_returns(request)
