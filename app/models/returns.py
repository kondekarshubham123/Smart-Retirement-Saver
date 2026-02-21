from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SavingsByDate(BaseModel):
    start: datetime
    end: datetime
    amount: float
    profits: Optional[float] = None
    taxBenefit: Optional[float] = None

class ReturnsRequest(BaseModel):
    age: int
    wage: float
    inflation: float
    q: List[dict]
    p: List[dict]
    k: List[dict]
    transactions: List[dict]

class ReturnsResponse(BaseModel):
    transactionsTotalAmount: float
    transactionsTotalCeiling: float
    savingsByDates: List[SavingsByDate]
