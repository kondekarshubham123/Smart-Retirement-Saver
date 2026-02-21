from fastapi import APIRouter, HTTPException
from app.services.transactions import (
    parse_transactions, validate_transactions, filter_transactions
)
from app.models.transactions import (
    TransactionInput, TransactionParsed, TransactionValidationRequest, TransactionValidationResponse, TransactionFilterRequest, TransactionFilterResponse
)

router = APIRouter()

# 1. Transaction Builder
@router.post("/transactions:parse", response_model=list[TransactionParsed], tags=["Transactions"], summary="Transaction Builder")
def parse(input: list[TransactionInput]):
    """Receives a list of Expenses and returns a list of transactions enriched with ceiling and remanent."""
    return parse_transactions(input)

# 2. Transaction Validator
@router.post("/transactions:validator", response_model=TransactionValidationResponse, tags=["Transactions"], summary="Transaction Validator")
def validator(request: TransactionValidationRequest):
    """Validates a list of transactions based on the wage and the maximum amount to invest."""
    return validate_transactions(request)

# 3. Temporal Constraints Validator
@router.post("/transactions:filter", response_model=TransactionFilterResponse, tags=["Transactions"], summary="Temporal Constraints Validator")
def filter(request: TransactionFilterRequest):
    """Validates transactions according to the periods defined as q, p, and k."""
    return filter_transactions(request)
