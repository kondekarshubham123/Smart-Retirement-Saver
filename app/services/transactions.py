from app.models.transactions import *
from decimal import Decimal, ROUND_CEILING
from typing import List

def calculate_remanent(amount: float) -> tuple[float, float]:
    """Calculates ceiling and remanent using Decimal for precision."""
    dec_amount = Decimal(str(amount))
    # Round up to next multiple of 100. 
    # If already a multiple of 100, it stays (standard ceiling logic).
    ceiling = (dec_amount / 100).to_integral_value(rounding=ROUND_CEILING) * 100
    remanent = ceiling - dec_amount
    return float(ceiling), float(remanent)

def parse_transactions(inputs: List[TransactionInput]) -> List[TransactionParsed]:
    parsed = []
    for tx in inputs:
        ceiling, remanent = calculate_remanent(tx.amount)
        parsed.append(TransactionParsed(
            date=tx.date, 
            amount=tx.amount, 
            ceiling=ceiling, 
            remanent=remanent
        ))
    return parsed

def validate_transactions(request: TransactionValidationRequest) -> TransactionValidationResponse:
    seen = set()
    valid, invalid = [], []
    for tx in request.transactions:
        # Check for duplicates (date and amount)
        key = (tx.date, tx.amount)
        if key in seen:
            invalid.append(InvalidTransaction(**tx.model_dump(), message="Duplicate transaction"))
            continue
        seen.add(key)

        if tx.amount < 0:
            invalid.append(InvalidTransaction(**tx.model_dump(), message="Negative amounts are not allowed"))
        elif tx.amount > 500000: # Constraint: x < 5 * 10^5
            invalid.append(InvalidTransaction(**tx.model_dump(), message="Amount exceeds maximum allowed per transaction"))
        elif tx.amount > request.wage * 12:
            invalid.append(InvalidTransaction(**tx.model_dump(), message="Amount exceeds annual wage"))
        else:
            valid.append(tx)
    return TransactionValidationResponse(valid=valid, invalid=invalid)

def filter_transactions(request: TransactionFilterRequest) -> TransactionFilterResponse:
    seen = set()
    valid, invalid = [], []
    
    # Sort Q periods by start date descending to easily find the one that starts latest
    q_periods = sorted(request.q, key=lambda q: q.start, reverse=True)
    
    for tx in request.transactions:
        # 1. Enrichment
        ceiling, base_remanent = calculate_remanent(tx.amount)
        
        # 2. Duplicate Detection
        key = (tx.date, tx.amount)
        if key in seen:
            invalid.append(InvalidTransaction(
                date=tx.date, amount=tx.amount, 
                ceiling=ceiling, remanent=base_remanent, 
                message="Duplicate transaction"
            ))
            continue
        seen.add(key)
        
        # 3. Basic Validation
        if tx.amount < 0:
            invalid.append(InvalidTransaction(
                date=tx.date, amount=tx.amount, 
                ceiling=ceiling, remanent=base_remanent, 
                message="Negative amounts are not allowed"
            ))
            continue
            
        # 4. Apply Q Rules (Override)
        # Use the one that starts latest (closest to transaction date or just latest start date)
        matching_q = next((q for q in q_periods if q.start <= tx.date <= q.end), None)
        
        current_remanent = base_remanent
        if matching_q:
            current_remanent = matching_q.fixed
            
        # 5. Apply P Rules (Addition)
        # "add all their extra amounts together" - p is an addition to q rules.
        matching_p_extras = [p.extra for p in request.p if p.start <= tx.date <= p.end]
        current_remanent += sum(matching_p_extras)
        
        # 6. Check K Periods
        in_k = any(k.start <= tx.date <= k.end for k in request.k)
        
        valid.append(TransactionParsed(
            date=tx.date,
            amount=tx.amount,
            ceiling=ceiling,
            remanent=float(current_remanent),
            inKPeriod=in_k
        ))
        
    return TransactionFilterResponse(valid=valid, invalid=invalid)
