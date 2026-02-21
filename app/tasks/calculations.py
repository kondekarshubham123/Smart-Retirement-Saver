from app.tasks.celery_app import celery
from app.models.returns import ReturnsRequest
from app.services.returns import calculate_nps_returns, calculate_index_returns
import logging

logger = logging.getLogger(__name__)

@celery.task(name="tasks.calculations.compute_nps_returns")
def compute_nps_returns_task(request_data: dict):
    """Background task to calculate NPS returns."""
    try:
        # Convert dict back to Pydantic model
        request = ReturnsRequest(**request_data)
        result = calculate_nps_returns(request)
        return result.model_dump()
    except Exception as e:
        logger.error(f"Error in compute_nps_returns_task: {str(e)}")
        raise

@celery.task(name="tasks.calculations.compute_index_returns")
def compute_index_returns_task(request_data: dict):
    """Background task to calculate Index Fund returns."""
    try:
        request = ReturnsRequest(**request_data)
        result = calculate_index_returns(request)
        return result.model_dump()
    except Exception as e:
        logger.error(f"Error in compute_index_returns_task: {str(e)}")
        raise
