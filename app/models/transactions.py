from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TransactionInput(BaseModel):
    date: datetime
    amount: float

class TransactionParsed(TransactionInput):
    ceiling: float
    remanent: float

class TransactionValidationRequest(BaseModel):
    wage: float
    transactions: List[TransactionParsed]

class InvalidTransaction(TransactionParsed):
    message: str

class TransactionValidationResponse(BaseModel):
    valid: List[TransactionParsed]
    invalid: List[InvalidTransaction]
    duplicate: List[TransactionParsed]

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
    transactions: List[TransactionParsed]

class TransactionFilterResponse(BaseModel):
    valid: List[TransactionParsed]
    invalid: List[InvalidTransaction]
