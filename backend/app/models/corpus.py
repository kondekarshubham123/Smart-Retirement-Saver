from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class TransactionBase(BaseModel):
    date: datetime
    amount: float

class TransactionCreate(TransactionBase):
    pass

class TransactionSchema(TransactionBase):
    id: int
    profile_id: int
    model_config = ConfigDict(from_attributes=True)

class RuleBase(BaseModel):
    type: str
    value: Optional[float] = None
    start_date: datetime
    end_date: datetime

class RuleCreate(RuleBase):
    pass

class RuleSchema(RuleBase):
    id: int
    profile_id: int
    model_config = ConfigDict(from_attributes=True)

class CorpusProfileBase(BaseModel):
    name: str
    age: int = 30
    wage: float = 125000
    inflation: float = 5.5

class CorpusProfileCreate(CorpusProfileBase):
    transactions: List[TransactionCreate] = []
    rules: List[RuleCreate] = []

class CorpusProfileSchema(CorpusProfileBase):
    id: int
    user_id: int
    transactions: List[TransactionSchema] = []
    rules: List[RuleSchema] = []
    model_config = ConfigDict(from_attributes=True)
