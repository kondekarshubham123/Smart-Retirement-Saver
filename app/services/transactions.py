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
    valid, invalid = [], []
    for tx in request.transacations:
        key = (tx.date, tx.amount)
        if key in seen:
            invalid.append(InvalidTransaction(**tx.dict(), message="Duplicate transaction"))
            continue
        seen.add(key)
        if tx.amount < 0 or tx.remanent < 0:
            invalid.append(InvalidTransaction(**tx.dict(), message="Negative amounts are not allowed"))
        elif tx.amount > request.wage * 12:
            invalid.append(InvalidTransaction(**tx.dict(), message="Amount exceeds annual wage"))
        else:
            valid.append(tx)
    return TransactionValidationResponse(valid=valid, invalid=invalid)

def filter_transactions(request: TransactionFilterRequest) -> TransactionFilterResponse:
    seen = set()
    valid, invalid = [], []
    
    # Pre-parse and validate basic rules
    for tx in request.transactions:
        # 1. Enrichment (Ceiling/Remanent based on decimal logic)
        amount = tx.amount
        ceiling = float(Decimal(amount).to_integral_value(rounding=ROUND_CEILING) if amount % 100 == 0 else (Decimal((int(amount/100)+1)*100)))
        base_remanent = float(Decimal(ceiling) - Decimal(amount))
        
        # 2. Duplicate Detection
        key = (tx.date, tx.amount)
        if key in seen:
            invalid.append(InvalidTransaction(date=tx.date, amount=amount, ceiling=ceiling, remanent=base_remanent, message="Duplicate transaction"))
            continue
        seen.add(key)
        
        # 3. Negative Amount Check
        if amount < 0:
            invalid.append(InvalidTransaction(date=tx.date, amount=amount, ceiling=ceiling, remanent=base_remanent, message="Negative amounts are not allowed"))
            continue
            
        # 4. Temporal Constraints (q, p, k)
        # Find if it matches any Q period
        q_match = next((q for q in request.q if q.start <= tx.date <= q.end), None)
        # Find if it matches any P period
        p_match = next((p for p in request.p if p.start <= tx.date <= p.end), None)
        # Find if it matches any K period
        k_match = next((k for k in request.k if k.start <= tx.date <= k.end), None)
        
        final_remanent = base_remanent
        if q_match:
            final_remanent += q_match.fixed
        elif p_match:
            final_remanent += p_match.extra
            
        in_k = k_match is not None
        
        valid.append(TransactionParsed(
            date=tx.date,
            amount=amount,
            ceiling=ceiling,
            remanent=final_remanent,
            inKPeriod=in_k
        ))
        
    return TransactionFilterResponse(valid=valid, invalid=invalid)
