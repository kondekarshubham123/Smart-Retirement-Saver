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
        {"date": "2023-10-30 20:15:30", "amount": 250}
    ]
    response = client.post("/blackrock/challenge/v1/transactions:parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data[0]["ceiling"] == 300
    assert data[0]["remanent"] == 50 or data[0]["remanent"] == 50.0

# 2. Transaction Validator

def test_transaction_validator():
    payload = {
        "wage": 50000,
        "transactions": [
            {"date": "2023-10-30 20:15:30", "amount": 250, "ceiling": 300, "remanent": 50}
        ]
    }
    response = client.post("/blackrock/challenge/v1/transactions:validator", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["valid"]) == 1
    assert data["valid"][0]["amount"] == 250

# 3. Temporal Constraints Validator (basic structure)
def test_transaction_filter():
    payload = {
        "q": [],
        "p": [],
        "k": [],
        "transactions": [
            {"date": "2023-10-30 20:15:30", "amount": 250, "ceiling": 300, "remanent": 50}
        ]
    }
    response = client.post("/blackrock/challenge/v1/transactions:filter", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "valid" in data
    assert len(data["valid"]) == 1
