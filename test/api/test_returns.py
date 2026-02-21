# Test type: API/Unit
# Validation: Returns Calculation endpoints (NPS and Index)
# Command: pytest test/api/test_returns.py

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_returns_nps():
    payload = {
        "age": 29,
        "wage": 50000,
        "inflation": 0.055,
        "q": [],
        "p": [],
        "k": [
            {"start": "2023-01-01 00:00:00", "end": "2023-12-31 23:59:59"}
        ],
        "transactions": [
            {"date": "2023-10-30 20:15:30", "amount": 250, "ceiling": 300, "remanent": 50}
        ]
    }
    response = client.post("/blackrock/challenge/v1/returns:nps", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "transactionsTotalAmount" in data
    assert "savingsByDates" in data

def test_returns_index():
    payload = {
        "age": 29,
        "wage": 50000,
        "inflation": 0.055,
        "q": [],
        "p": [],
        "k": [
            {"start": "2023-01-01 00:00:00", "end": "2023-12-31 23:59:59"}
        ],
        "transactions": [
            {"date": "2023-10-30 20:15:30", "amount": 250, "ceiling": 300, "remanent": 50}
        ]
    }
    response = client.post("/blackrock/challenge/v1/returns:index", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "transactionsTotalAmount" in data
    assert "savingsByDates" in data
