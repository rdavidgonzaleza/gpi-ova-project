from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_serializer


class _Model(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CreateAIActivityRequest(_Model):
    activity_id: str = Field(min_length=1, max_length=36)
    prompt_template: str = Field(min_length=1)
    provider: str = Field(min_length=1, max_length=50)


class RunRequest(_Model):
    student_id: str = Field(min_length=1, max_length=36)
    input: str = Field(min_length=1)


class ValidateRequest(_Model):
    validated: bool
    notes: str | None = None


class _Timestamped(BaseModel):
    created_at: datetime

    @field_serializer("created_at")
    def _iso(self, value: datetime) -> str:
        # ISO 8601 UTC con sufijo Z (spec 3.2).
        return value.strftime("%Y-%m-%dT%H:%M:%SZ")


class AIActivityResponse(_Timestamped):
    id: str
    activity_id: str
    prompt_template: str
    provider: str


class RunResponse(BaseModel):
    interaction_id: str
    ai_output: str


class AIInteractionResponse(_Timestamped):
    id: str
    ai_activity_id: str
    student_id: str
    input: str
    ai_output: str
    validated: bool
    validation_notes: str | None
