"""Composition root: conecta adapters con casos de uso y crea la app FastAPI."""

import json
import logging
import os
from datetime import UTC, datetime
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from app.adapters.ai_provider.gemini_provider import GeminiProvider
from app.adapters.http.router import Dependencies, create_router
from app.adapters.repository.postgres_repository import (
    SqlAIActivityRepository,
    SqlAIInteractionRepository,
    create_db_engine,
)
from app.adapters.token.hmac_token import HmacTokenVerifier
from app.application.create_ai_activity import CreateAIActivity
from app.application.list_interactions import ListInteractions
from app.application.run_ai_activity import RunAIActivity
from app.application.validate_interaction import ValidateInteraction
from app.domain.entities import AIActivity, DomainError
from app.ports.ai_provider import AIProvider
from app.ports.repositories import AIActivityRepository

SEED_FILE = Path(__file__).resolve().parent.parent / "seed" / "ai_activities.json"


def error_body(code: str, message: str) -> dict:
    return {"error": {"code": code, "message": message}}


def load_seed(activities: AIActivityRepository, path: Path = SEED_FILE) -> int:
    """Carga (o actualiza) las actividades de IA definidas por el equipo docente."""
    if not path.exists():
        return 0
    rows = json.loads(path.read_text(encoding="utf-8"))
    for row in rows:
        template = row["prompt_template"]
        if isinstance(template, list):
            template = "\n".join(template)
        activities.upsert(
            AIActivity(
                id=row["id"],
                activity_id=row["activity_id"],
                prompt_template=template,
                provider=row.get("provider", "gemini"),
                created_at=datetime.now(UTC),
            )
        )
    return len(rows)


def create_app(provider: AIProvider | None = None, database_url: str | None = None) -> FastAPI:
    load_dotenv()
    logging.basicConfig(level=os.getenv("LOG_LEVEL", "info").upper())

    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET es obligatorio")
    engine = create_db_engine(database_url or os.getenv("DATABASE_URL", "sqlite:///./ai.db"))
    activities = SqlAIActivityRepository(engine)
    interactions = SqlAIInteractionRepository(engine)
    provider = provider or GeminiProvider(
        api_key=os.getenv("AI_PROVIDER_API_KEY") or None,
        model=os.getenv("AI_MODEL", "gemini-3.8-flash"),
    )
    loaded = load_seed(activities)
    logging.getLogger(__name__).info("actividades de IA cargadas: %d", loaded)

    app = FastAPI(title="ai-service", version="1.0.0")
    origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    @app.exception_handler(DomainError)
    async def domain_error(_: Request, error: DomainError):
        return JSONResponse(error_body(error.code, error.message), status_code=error.status)

    @app.exception_handler(RequestValidationError)
    async def invalid_body(_: Request, error: RequestValidationError):
        return JSONResponse(error_body("INVALID_BODY", "cuerpo de la solicitud inválido"), status_code=400)

    @app.exception_handler(HTTPException)
    async def http_error(_: Request, error: HTTPException):
        code = "NOT_FOUND" if error.status_code == 404 else "HTTP_ERROR"
        return JSONResponse(error_body(code, str(error.detail)), status_code=error.status_code)

    app.include_router(
        create_router(
            Dependencies(
                tokens=HmacTokenVerifier(secret),
                create_activity=CreateAIActivity(activities),
                run_activity=RunAIActivity(activities, interactions, provider),
                list_interactions=ListInteractions(interactions),
                validate_interaction=ValidateInteraction(interactions),
            )
        )
    )
    return app


if __name__ == "__main__":
    import uvicorn

    load_dotenv()
    uvicorn.run(create_app(), host="0.0.0.0", port=int(os.getenv("PORT", "8084")))
