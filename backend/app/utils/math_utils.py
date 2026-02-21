from decimal import Decimal, ROUND_CEILING

def round_up_to_100(amount: float) -> float:
    d = Decimal(amount)
    if d % 100 == 0:
        return float(d)
    return float((d // 100 + 1) * 100)
