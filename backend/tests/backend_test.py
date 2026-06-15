"""Backend API tests for Iglesia Nueva Vida Internacional."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://fe-y-radio.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@iglesianuevavida.org"
ADMIN_PASSWORD = "NuevaVida2025!"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data and data["user"]["email"] == ADMIN_EMAIL
    return data["access_token"]


@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# --- Health
def test_health(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    body = r.json()
    assert body.get("status") == "ok"


# --- Public reads with seeded data
def test_list_news_seeded(session):
    r = session.get(f"{API}/news")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) >= 1
    item = items[0]
    for k in ("id", "title", "summary", "content", "published_at"):
        assert k in item


def test_list_events_seeded_has_featured(session):
    r = session.get(f"{API}/events")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) >= 1
    assert any(e.get("featured") is True for e in items), "no featured event found"


# --- Auth
def test_login_invalid(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_me_with_token(session, auth_headers):
    r = session.get(f"{API}/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_create_news_unauthorized(session):
    r = session.post(f"{API}/news", json={"title": "x", "summary": "x", "content": "x"})
    assert r.status_code == 401


# --- News CRUD
def test_news_crud(session, auth_headers):
    payload = {
        "title": "TEST_News_Title",
        "summary": "TEST summary",
        "content": "TEST content body",
        "image_url": "https://example.com/img.jpg",
    }
    cr = session.post(f"{API}/news", headers=auth_headers, json=payload)
    assert cr.status_code == 200, cr.text
    created = cr.json()
    nid = created["id"]
    assert created["title"] == payload["title"]

    # verify via list
    lr = session.get(f"{API}/news")
    assert any(n["id"] == nid for n in lr.json())

    # update
    upd = {**payload, "title": "TEST_News_Updated"}
    ur = session.put(f"{API}/news/{nid}", headers=auth_headers, json=upd)
    assert ur.status_code == 200
    assert ur.json()["title"] == "TEST_News_Updated"

    # verify persistence
    lr2 = session.get(f"{API}/news")
    found = next((n for n in lr2.json() if n["id"] == nid), None)
    assert found and found["title"] == "TEST_News_Updated"

    # delete
    dr = session.delete(f"{API}/news/{nid}", headers=auth_headers)
    assert dr.status_code == 200

    # verify gone
    lr3 = session.get(f"{API}/news")
    assert not any(n["id"] == nid for n in lr3.json())

    # delete again -> 404
    dr2 = session.delete(f"{API}/news/{nid}", headers=auth_headers)
    assert dr2.status_code == 404


# --- Events CRUD
def test_events_crud(session, auth_headers):
    payload = {
        "title": "TEST_Event_Title",
        "description": "TEST desc",
        "location": "TEST location",
        "event_date": "2026-12-25T18:00:00+00:00",
        "image_url": "https://example.com/e.jpg",
        "featured": True,
    }
    cr = session.post(f"{API}/events", headers=auth_headers, json=payload)
    assert cr.status_code == 200, cr.text
    eid = cr.json()["id"]
    assert cr.json()["featured"] is True

    lr = session.get(f"{API}/events")
    assert any(e["id"] == eid for e in lr.json())

    upd = {**payload, "title": "TEST_Event_Updated", "featured": False}
    ur = session.put(f"{API}/events/{eid}", headers=auth_headers, json=upd)
    assert ur.status_code == 200
    assert ur.json()["title"] == "TEST_Event_Updated"
    assert ur.json()["featured"] is False

    dr = session.delete(f"{API}/events/{eid}", headers=auth_headers)
    assert dr.status_code == 200

    dr2 = session.delete(f"{API}/events/{eid}", headers=auth_headers)
    assert dr2.status_code == 404
