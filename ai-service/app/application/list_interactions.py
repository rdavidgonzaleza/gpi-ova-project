from app.domain.entities import REVIEWER_ROLES, AIInteraction, Claims, ForbiddenError
from app.ports.repositories import AIInteractionRepository


class ListInteractions:
    def __init__(self, interactions: AIInteractionRepository):
        self.interactions = interactions

    def execute(self, claims: Claims, validated: bool | None) -> list[AIInteraction]:
        if claims.role not in REVIEWER_ROLES:
            raise ForbiddenError("tu rol no puede consultar interacciones de IA")
        return self.interactions.list(validated)
