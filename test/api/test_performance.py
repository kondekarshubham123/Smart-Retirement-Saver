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
    
    # Verify time format (YYYY-MM-DD HH:MM:SS.mmm)
    from datetime import datetime
    try:
        datetime.strptime(data["time"], "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        pytest.fail(f"Time format is incorrect: {data['time']}")
    
    # Verify memory format (decimal string)
    try:
        float(data["memory"])
        assert " MB" not in data["memory"]
    except ValueError:
        pytest.fail(f"Memory format is incorrect: {data['memory']}")
