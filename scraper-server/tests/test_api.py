"""
Tests for FastAPI application endpoints
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


def test_root_endpoint(client):
    """Test root endpoint returns service info"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert "version" in data


def test_health_endpoint(client):
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "database" in data
    assert "scheduler" in data


def test_liveness_endpoint(client):
    """Test liveness probe"""
    response = client.get("/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"


def test_scrape_status_endpoint(client):
    """Test scraping status endpoint"""
    response = client.get("/api/scrape/status")
    assert response.status_code == 200
    data = response.json()
    assert "scraper" in data
    assert "scheduler" in data
