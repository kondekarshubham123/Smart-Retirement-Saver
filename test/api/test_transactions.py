# Test type: API/Unit
# Validation: Transaction Builder, Validator, and Filter endpoints
# Command: pytest test/api/test_transactions.py

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Transaction Builder

def test_transaction_parse():
    payload = [
        {"date": "2023-10-12 20:15:30", "amount": 250},
        {"date": "2023-02-28 15:49:20", "amount": 375},
        {"date": "2023-07-01 21:59:00", "amount": 620},
        {"date": "2023-12-17 08:09:45", "amount": 480}
    ]
    response = client.post("/blackrock/challenge/v1/transactions:parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    assert data[0]["ceiling"] == 300
    assert data[0]["remanent"] == 50
    assert data[1]["ceiling"] == 400
    assert data[1]["remanent"] == 25

# 2. Transaction Validator

def test_transaction_validator():
    payload = {
        "wage": 50000,
        "transacations": [
            { "date": "2023-01-15 10:30:00", "amount": 2000, "ceiling": 300, "remanent": 50 },
            { "date": "2023-03-20 14:45:00", "amount": 3500, "ceiling": 400, "remanent": 70 },
            { "date": "2023-06-10 09:15:00", "amount": 1500, "ceiling": 200, "remanent": 30 },
            { "date": "2023-07-10 09:15:00", "amount": -250, "ceiling": 200, "remanent": 30 },
        ]
    }
    response = client.post("/blackrock/challenge/v1/transactions:validator", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["valid"]) == 3
    assert len(data["invalid"]) == 1
    assert data["invalid"][0]["message"] == "Negative amounts are not allowed"

# 3. Temporal Constraints Validator
def test_transaction_filter():
    payload = {
        "q": [{"fixed": 0, "start": "2023-02-28 00:00:00", "end": "2023-07-31 23:59:59"}],
        "p": [{"extra": 30, "start": "2023-02-28 00:00:00", "end": "2023-12-31 23:59:59"}],
        "k": [{"start": "2023-01-01 00:00:00", "end": "2023-12-31 23:59:59"}],
        "wage": 50000,
        "transactions": [
            { "date": "2023-02-28 15:49:20", "amount": 375 },
            { "date": "2023-10-12 20:15:30", "amount": 250 },
            { "date": "2023-10-12 20:15:30", "amount": 250 },
            { "date": "2023-10-17 08:09:45", "amount": -480 }
        ]
    }
    response = client.post("/blackrock/challenge/v1/transactions:filter", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Assert Valid Transactions
    assert len(data["valid"]) == 2
    # First valid: 375, ceiling 400, remanent 25 (matches Q, extra not added because Q precedence)
    assert data["valid"][0]["amount"] == 375.0
    assert data["valid"][0]["ceiling"] == 400.0
    assert data["valid"][0]["remanent"] == 25.0
    assert data["valid"][0]["inKPeriod"] is True
    
    # Second valid: 250, ceiling 300, remanent 80 (matches P, not Q, extra 30 added)
    assert data["valid"][1]["amount"] == 250.0
    assert data["valid"][1]["ceiling"] == 300.0
    assert data["valid"][1]["remanent"] == 80.0
    assert data["valid"][1]["inKPeriod"] is True
    
    # Assert Invalid Transactions
    assert len(data["invalid"]) == 2
    assert data["invalid"][0]["message"] == "Duplicate transaction"
    assert data["invalid"][1]["message"] == "Negative amounts are not allowed"
