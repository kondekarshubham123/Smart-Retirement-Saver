from app.models.returns import *
from app.models.transactions import TransactionFilterRequest, TransactionInput
from app.services.transactions import filter_transactions, calculate_remanent
from decimal import Decimal
import math

def calculate_tax(income: float) -> float:
    """Calculates progressive tax based on simplified Indian tax slabs."""
    if income <= 700000:
        return 0.0
    tax = 0.0
    rem_income = income
    if rem_income > 1500000:
        tax += (rem_income - 1500000) * 0.30
        rem_income = 1500000
    if rem_income > 1200000:
        tax += (rem_income - 1200000) * 0.20
        rem_income = 1200000
    if rem_income > 1000000:
        tax += (rem_income - 1000000) * 0.15
        rem_income = 1000000
    if rem_income > 700000:
        tax += (rem_income - 700000) * 0.10
    return round(float(tax), 2)

def calculate_real_return(principal: float, rate: float, years: int, inflation: float) -> float:
    """Calculates compound interest and adjusts for inflation."""
    # A = P(1+r)^t
    amount = principal * math.pow(1 + rate, years)
    # A_real = A / (1 + inflation)^t
    real_value = amount / math.pow(1 + (inflation / 100.0), years)
    return round(real_value, 2)

def get_processed_transactions_for_returns(request: ReturnsRequest):
    """Processes transactions once to apply Q and P rules."""
    # We use filter_transactions but since it only handles a single KPeriod check (any),
    # we'll just use it to get the 'valid' transactions with their refined 'remanent'
    # and then manually group by K periods.
    filter_req = TransactionFilterRequest(
        q=request.q,
        p=request.p,
        k=[], # We'll handle K periods manually
        wage=request.wage,
        transactions=request.transactions
    )
    result = filter_transactions(filter_req)
    return result.valid

def calculate_nps_returns(request: ReturnsRequest) -> ReturnsResponse:
    processed_txs = get_processed_transactions_for_returns(request)
    annual_income = request.wage * 12
    years = 60 - request.age if request.age < 60 else 5
    nps_rate = 0.0711
    
    saving_by_dates = []
    
    total_tx_amount = 0.0
    total_tx_ceiling = 0.0
    
    # Calculate for each K period
    for k in request.k:
        # Filter transactions for this specific K period
        k_txs = [tx for tx in processed_txs if k.start <= tx.date <= k.end]
        invested_amount = sum(tx.remanent for tx in k_txs)
        
        # Calculate returns
        real_value = calculate_real_return(invested_amount, nps_rate, years, request.inflation)
        profit = round(real_value - invested_amount, 2)
        
        # Calculate Tax Benefit
        # NPS_Deduction = min(invested, 10% of annual_income, 2,00,000)
        nps_deduction = min(invested_amount, annual_income * 0.10, 200000.0)
        tax_before = calculate_tax(annual_income)
        tax_after = calculate_tax(annual_income - nps_deduction)
        tax_benefit = round(tax_before - tax_after, 2)
        
        saving_by_dates.append(SavingsByDate(
            start=k.start,
            end=k.end,
            amount=round(invested_amount, 2),
            profit=profit,
            taxBenefit=tax_benefit
        ))
        
    # Totals (based on all transactions provided, though ceiling calculation is tricky per k)
    # For global totals, we'll just sum all transactions provided once
    for tx in request.transactions:
        total_tx_amount += tx.amount
        cl, _ = calculate_remanent(tx.amount)
        total_tx_ceiling += cl

    return ReturnsResponse(
        totalTranscationAmount=round(total_tx_amount, 2),
        totalCeiling=round(total_tx_ceiling, 2),
        savingByDates=saving_by_dates
    )

def calculate_index_returns(request: ReturnsRequest) -> ReturnsResponse:
    processed_txs = get_processed_transactions_for_returns(request)
    years = 60 - request.age if request.age < 60 else 5
    index_rate = 0.1449
    
    saving_by_dates = []
    
    total_tx_amount = 0.0
    total_tx_ceiling = 0.0
    
    for k in request.k:
        k_txs = [tx for tx in processed_txs if k.start <= tx.date <= k.end]
        invested_amount = sum(tx.remanent for tx in k_txs)
        
        real_value = calculate_real_return(invested_amount, index_rate, years, request.inflation)
        profit = round(real_value - invested_amount, 2)
        
        saving_by_dates.append(SavingsByDate(
            start=k.start,
            end=k.end,
            amount=round(invested_amount, 2),
            profit=profit,
            taxBenefit=0.0 # No tax benefit for Index Fund
        ))
        
    for tx in request.transactions:
        total_tx_amount += tx.amount
        cl, _ = calculate_remanent(tx.amount)
        total_tx_ceiling += cl

    return ReturnsResponse(
        totalTranscationAmount=round(total_tx_amount, 2),
        totalCeiling=round(total_tx_ceiling, 2),
        savingByDates=saving_by_dates
    )
