from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class TransactionInput(BaseModel):
    date: datetime
    amount: float

class TransactionParsed(TransactionInput):
    ceiling: float
    remanent: float
    inKPeriod: Optional[bool] = None

class TransactionValidationRequest(BaseModel):
    wage: float
    transacations: List[TransactionParsed]

class InvalidTransaction(TransactionParsed):
    message: str

class TransactionValidationResponse(BaseModel):
    valid: List[TransactionParsed]
    invalid: List[InvalidTransaction]

class QPeriod(BaseModel):
    fixed: float
    start: datetime
    end: datetime

class PPeriod(BaseModel):
    extra: float
    start: datetime
    end: datetime

class KPeriod(BaseModel):
    start: datetime
    end: datetime

class TransactionFilterRequest(BaseModel):
    q: List[QPeriod]
    p: List[PPeriod]
    k: List[KPeriod]
    wage: float
    transactions: List[TransactionInput]

class TransactionFilterResponse(BaseModel):
    valid: List[TransactionParsed]
    invalid: List[InvalidTransaction]
