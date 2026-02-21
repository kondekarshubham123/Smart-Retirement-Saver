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
        "inflation": 5.5,
        "q": [{"fixed": 0, "start": "2023-07-01 00:00:00", "end": "2023-07-31 23:59:59"}],
        "p": [{"extra": 25, "start": "2023-10-01 08:00:00", "end": "2023-12-31 19:59:59"}],
        "k": [
                {"start": "2023-01-01 00:00:00", "end": "2023-12-31 23:59:59"},
                {"start": "2023-03-01 00:00:00", "end": "2023-11-30 23:59:59"}
            ],
        "transactions": [
            { "date": "2023-02-28 15:49:20", "amount": 375 },
            { "date": "2023-07-01 21:59:00", "amount": 620 },
            { "date": "2023-10-12 20:15:30", "amount": 250 },
            { "date": "2023-10-17 08:09:45", "amount": 480 },
            { "date": "2023-10-17 08:09:45", "amount": -10 }
        ]
    }
    response = client.post("/blackrock/challenge/v1/returns:nps", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "totalTranscationAmount" in data
    assert "totalCeiling" in data
    assert "savingByDates" in data

def test_returns_index():
    payload = {
        "age": 29,
        "wage": 50000,
        "inflation": 5.5,
        "q": [],
        "p": [],
        "k": [
            {"start": "2023-01-01 00:00:00", "end": "2023-12-31 23:59:59"}
        ],
        "transactions": [
            {"date": "2023-10-30 20:15:30", "amount": 250}
        ]
    }
    response = client.post("/blackrock/challenge/v1/returns:index", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "totalTranscationAmount" in data
    assert "totalCeiling" in data
    assert "savingByDates" in data
