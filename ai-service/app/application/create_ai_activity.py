import uuid
from datetime import UTC, datetime

from app.domain.entities import AUTHOR_ROLES, AIActivity, Claims, ForbiddenError, validate_template
from app.ports.repositories import AIActivityRepository


class CreateAIActivity:
    def __init__(self, activities: AIActivityRepository):
        self.activities = activities

    def execute(self, claims: Claims, activity_id: str, prompt_template: str, provider: str) -> AIActivity:
        if claims.role not in AUTHOR_ROLES:
            raise ForbiddenError("solo docentes o administradores pueden crear actividades de IA")
        activity = AIActivity(
            id=str(uuid.uuid4()),
            activity_id=activity_id,
            prompt_template=validate_template(prompt_template),
            provider=provider.strip().lower(),
            created_at=datetime.now(UTC),
        )
        self.activities.save(activity)
        return activity
