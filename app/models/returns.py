from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.models.transactions import QPeriod, PPeriod, KPeriod, TransactionInput

class SavingsByDate(BaseModel):
    start: datetime
    end: datetime
    amount: float
    profit: Optional[float] = None
    taxBenefit: Optional[float] = None

class ReturnsRequest(BaseModel):
    age: int
    wage: float
    inflation: float
    q: List[QPeriod]
    p: List[PPeriod]
    k: List[KPeriod]
    transactions: List[TransactionInput]

class ReturnsResponse(BaseModel):
    totalTranscationAmount: float
    totalCeiling: float
    savingByDates: List[SavingsByDate]
