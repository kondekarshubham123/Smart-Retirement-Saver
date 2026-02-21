from app.models.transactions import *
from decimal import Decimal, ROUND_CEILING
import pandas as pd

def parse_transactions(inputs: list[TransactionInput]) -> list[TransactionParsed]:
    parsed = []
    for tx in inputs:
        ceiling = float(Decimal(tx.amount).to_integral_value(rounding=ROUND_CEILING) if tx.amount % 100 == 0 else (Decimal((int(tx.amount/100)+1)*100)))
        remanent = float(Decimal(ceiling) - Decimal(tx.amount))
        parsed.append(TransactionParsed(date=tx.date, amount=tx.amount, ceiling=ceiling, remanent=remanent))
    return parsed

def validate_transactions(request: TransactionValidationRequest) -> TransactionValidationResponse:
    seen = set()
    valid, invalid, duplicate = [], [], []
    for tx in request.transactions:
        key = (tx.date, tx.amount)
        if key in seen:
            duplicate.append(tx)
            continue
        seen.add(key)
        if tx.amount < 0 or tx.remanent < 0:
            invalid.append(InvalidTransaction(**tx.dict(), message="Negative values not allowed"))
        elif tx.amount > request.wage * 12:
            invalid.append(InvalidTransaction(**tx.dict(), message="Amount exceeds annual wage"))
        else:
            valid.append(tx)
    return TransactionValidationResponse(valid=valid, invalid=invalid, duplicate=duplicate)

def filter_transactions(request: TransactionFilterRequest) -> TransactionFilterResponse:
    # Placeholder: implement q, p, k period logic
    return TransactionFilterResponse(valid=request.transactions, invalid=[])
