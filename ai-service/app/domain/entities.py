"""Entidades y reglas de negocio puras del servicio de IA (spec 7.4)."""

from dataclasses import dataclass, replace
from datetime import datetime

ROLES = ("estudiante", "docente", "administrador", "validador")
REVIEWER_ROLES = ("validador", "docente", "administrador")
AUTHOR_ROLES = ("docente", "administrador")

INPUT_PLACEHOLDER = "{{input}}"
JSON_MARKER = "[[formato:json]]"
MAX_INPUT_CHARS = 6000


class DomainError(Exception):
    """Error de negocio con código estable para el formato de error de la spec 3.3."""

    status = 400
    code = "INVALID_BODY"

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class NotFoundError(DomainError):
    status = 404
    code = "NOT_FOUND"


class ForbiddenError(DomainError):
    status = 403
    code = "FORBIDDEN"


class ProviderUnavailableError(DomainError):
    status = 503
    code = "AI_NOT_CONFIGURED"


class ProviderRateLimitedError(DomainError):
    status = 429
    code = "AI_RATE_LIMITED"


class ProviderFailedError(DomainError):
    status = 502
    code = "AI_PROVIDER_ERROR"


@dataclass(frozen=True)
class Claims:
    sub: str
    role: str


@dataclass(frozen=True)
class AIActivity:
    id: str
    activity_id: str
    prompt_template: str
    provider: str
    created_at: datetime

    @property
    def expects_json(self) -> bool:
        return JSON_MARKER in self.prompt_template

    def render(self, student_input: str) -> str:
        """Construye el prompt final; el aporte del estudiante va delimitado."""
        template = self.prompt_template.replace(JSON_MARKER, "").strip()
        delimited = f"<<<\n{student_input.strip()}\n>>>"
        if INPUT_PLACEHOLDER in template:
            return template.replace(INPUT_PLACEHOLDER, delimited)
        return f"{template}\n\nAporte del estudiante:\n{delimited}"


@dataclass(frozen=True)
class AIInteraction:
    id: str
    ai_activity_id: str
    student_id: str
    input: str
    ai_output: str
    validated: bool
    validation_notes: str | None
    created_at: datetime

    def validate(self, validated: bool, notes: str | None) -> "AIInteraction":
        return replace(self, validated=validated, validation_notes=(notes or "").strip() or None)


def validate_template(template: str) -> str:
    template = template.strip()
    if len(template) < 20:
        raise DomainError("prompt_template debe describir la tarea (mínimo 20 caracteres)")
    return template


def validate_student_input(text: str) -> str:
    text = text.strip()
    if not text:
        raise DomainError("input no puede estar vacío")
    if len(text) > MAX_INPUT_CHARS:
        raise DomainError(f"input supera el máximo de {MAX_INPUT_CHARS} caracteres")
    return text
