# Test type: API/Unit
# Validation: Performance endpoint
# Command: pytest test/api/test_performance.py

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_performance():
    response = client.get("/blackrock/challenge/v1/performance")
    assert response.status_code == 200
    data = response.json()
    assert "time" in data
    assert "memory" in data
    assert "threads" in data
