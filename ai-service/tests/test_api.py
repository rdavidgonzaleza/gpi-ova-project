import base64
import hashlib
import hmac
import json
import time

import pytest
from fastapi.testclient import TestClient

from app.domain.entities import ProviderRateLimitedError

SECRET = "secreto-de-prueba"
STUDENT = "0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b20"
TEACHER = "0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10"
VALIDATOR = "0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b12"


def token(sub: str, role: str, exp_offset: int = 3600) -> str:
    payload = base64.urlsafe_b64encode(
        json.dumps({"sub": sub, "role": role, "exp": int(time.time()) + exp_offset}).encode()
    ).rstrip(b"=")
    signature = base64.urlsafe_b64encode(hmac.new(SECRET.encode(), payload, hashlib.sha256).digest()).rstrip(b"=")
    return f"{payload.decode()}.{signature.decode()}"


def bearer(sub: str, role: str) -> dict:
    return {"Authorization": f"Bearer {token(sub, role)}"}


class FakeProvider:
    name = "fake"

    def __init__(self):
        self.calls: list[dict] = []
        self.fail_with: Exception | None = None

    def generate(self, prompt: str, *, system: str, expects_json: bool) -> str:
        if self.fail_with:
            raise self.fail_with
        self.calls.append({"prompt": prompt, "system": system, "expects_json": expects_json})
        return '{"ok": true}' if expects_json else "Buen trabajo, revisa los entregables."


@pytest.fixture
def setup(tmp_path, monkeypatch):
    monkeypatch.setenv("JWT_SECRET", SECRET)
    from app.main import create_app

    provider = FakeProvider()
    app = create_app(provider=provider, database_url=f"sqlite:///{tmp_path / 'ai.db'}")
    return TestClient(app), provider


def create_activity(client, template="Evalúa la EDT del estudiante según la rúbrica: {{input}}"):
    response = client.post(
        "/api/ai-activities",
        json={"activity_id": "a1", "prompt_template": template, "provider": "gemini"},
        headers=bearer(TEACHER, "docente"),
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_healthz(setup):
    client, _ = setup
    assert client.get("/healthz").text == "ok"


def test_run_and_validate_flow(setup):
    client, provider = setup
    activity = create_activity(client)

    run = client.post(
        f"/api/ai-activities/{activity['id']}/run",
        json={"student_id": STUDENT, "input": "1. Gestión 1.1 Acta"},
        headers=bearer(STUDENT, "estudiante"),
    )
    assert run.status_code == 200, run.text
    assert run.json()["ai_output"].startswith("Buen trabajo")
    assert "<<<\n1. Gestión 1.1 Acta\n>>>" in provider.calls[0]["prompt"]

    pending = client.get("/api/ai-interactions?validated=false", headers=bearer(VALIDATOR, "validador"))
    assert pending.status_code == 200
    assert [item["id"] for item in pending.json()] == [run.json()["interaction_id"]]
    assert pending.json()[0]["created_at"].endswith("Z")

    validated = client.post(
        f"/api/ai-interactions/{run.json()['interaction_id']}/validate",
        json={"validated": True, "notes": "Correcta"},
        headers=bearer(VALIDATOR, "validador"),
    )
    assert validated.status_code == 200
    assert validated.json()["validated"] is True
    assert client.get("/api/ai-interactions?validated=false", headers=bearer(VALIDATOR, "validador")).json() == []


def test_json_marker_requests_json_output(setup):
    client, provider = setup
    activity = create_activity(client, "[[formato:json]]\nDevuelve un JSON con la rúbrica aplicada a {{input}}")
    client.post(
        f"/api/ai-activities/{activity['id']}/run",
        json={"student_id": STUDENT, "input": "respuesta"},
        headers=bearer(STUDENT, "estudiante"),
    )
    assert provider.calls[0]["expects_json"] is True
    assert "[[formato:json]]" not in provider.calls[0]["prompt"]


def test_rules(setup):
    client, provider = setup
    activity = create_activity(client)
    run_url = f"/api/ai-activities/{activity['id']}/run"

    assert client.post(run_url, json={"student_id": STUDENT, "input": "x"}).status_code == 401
    other = client.post(run_url, json={"student_id": TEACHER, "input": "x"}, headers=bearer(STUDENT, "estudiante"))
    assert other.status_code == 403 and other.json()["error"]["code"] == "FORBIDDEN"
    empty = client.post(run_url, json={"student_id": STUDENT, "input": "   "}, headers=bearer(STUDENT, "estudiante"))
    assert empty.status_code == 400
    missing = client.post(
        "/api/ai-activities/nope/run", json={"student_id": STUDENT, "input": "x"}, headers=bearer(STUDENT, "estudiante")
    )
    assert missing.status_code == 404
    assert client.get("/api/ai-interactions", headers=bearer(STUDENT, "estudiante")).status_code == 403
    student_create = client.post(
        "/api/ai-activities",
        json={"activity_id": "a1", "prompt_template": "x" * 30, "provider": "gemini"},
        headers=bearer(STUDENT, "estudiante"),
    )
    assert student_create.status_code == 403

    provider.fail_with = ProviderRateLimitedError("espera")
    limited = client.post(run_url, json={"student_id": STUDENT, "input": "x"}, headers=bearer(STUDENT, "estudiante"))
    assert limited.status_code == 429 and limited.json()["error"]["code"] == "AI_RATE_LIMITED"


def test_expired_token_is_rejected(setup):
    client, _ = setup
    expired = {"Authorization": f"Bearer {token(VALIDATOR, 'validador', exp_offset=-10)}"}
    assert client.get("/api/ai-interactions", headers=expired).status_code == 401
