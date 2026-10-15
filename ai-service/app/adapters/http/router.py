from dataclasses import dataclass
from typing import Annotated

from fastapi import APIRouter, Depends, Header, Query
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import PlainTextResponse

from app.adapters.http.schemas import (
    AIActivityResponse,
    AIInteractionResponse,
    CreateAIActivityRequest,
    RunRequest,
    RunResponse,
    ValidateRequest,
)
from app.application.create_ai_activity import CreateAIActivity
from app.application.list_interactions import ListInteractions
from app.application.run_ai_activity import RunAIActivity
from app.application.validate_interaction import ValidateInteraction
from app.domain.entities import Claims, DomainError
from app.ports.token_verifier import TokenVerifier


class UnauthorizedError(DomainError):
    status = 401
    code = "UNAUTHORIZED"


@dataclass
class Dependencies:
    tokens: TokenVerifier
    create_activity: CreateAIActivity
    run_activity: RunAIActivity
    list_interactions: ListInteractions
    validate_interaction: ValidateInteraction


def create_router(deps: Dependencies) -> APIRouter:
    router = APIRouter()

    def claims(authorization: Annotated[str | None, Header()] = None) -> Claims:
        if not authorization or not authorization.startswith("Bearer "):
            raise UnauthorizedError("token no proporcionado o inválido")
        verified = deps.tokens.verify(authorization.removeprefix("Bearer "))
        if verified is None:
            raise UnauthorizedError("token inválido o expirado")
        return verified

    Auth = Annotated[Claims, Depends(claims)]

    @router.get("/healthz", response_class=PlainTextResponse)
    def healthz() -> str:
        return "ok"

    @router.post("/api/ai-activities", status_code=201, response_model=AIActivityResponse)
    def create_ai_activity(body: CreateAIActivityRequest, auth: Auth):
        activity = deps.create_activity.execute(auth, body.activity_id, body.prompt_template, body.provider)
        return AIActivityResponse(**activity.__dict__)

    @router.post("/api/ai-activities/{ai_activity_id}/run", response_model=RunResponse)
    async def run_ai_activity(ai_activity_id: str, body: RunRequest, auth: Auth):
        # La llamada al proveedor es bloqueante: se ejecuta fuera del event loop.
        interaction = await run_in_threadpool(
            deps.run_activity.execute, auth, ai_activity_id, body.student_id, body.input
        )
        return RunResponse(interaction_id=interaction.id, ai_output=interaction.ai_output)

    @router.get("/api/ai-interactions", response_model=list[AIInteractionResponse])
    def list_ai_interactions(auth: Auth, validated: Annotated[bool | None, Query()] = None):
        return [AIInteractionResponse(**item.__dict__) for item in deps.list_interactions.execute(auth, validated)]

    @router.post("/api/ai-interactions/{interaction_id}/validate", response_model=AIInteractionResponse)
    def validate_ai_interaction(interaction_id: str, body: ValidateRequest, auth: Auth):
        interaction = deps.validate_interaction.execute(auth, interaction_id, body.validated, body.notes)
        return AIInteractionResponse(**interaction.__dict__)

    return router
