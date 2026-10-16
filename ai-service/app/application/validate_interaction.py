from app.domain.entities import REVIEWER_ROLES, AIInteraction, Claims, ForbiddenError, NotFoundError
from app.ports.repositories import AIInteractionRepository


class ValidateInteraction:
    """UC-10: un validador humano aprueba o rechaza una salida de IA (RF-09, RF-10)."""

    def __init__(self, interactions: AIInteractionRepository):
        self.interactions = interactions

    def execute(self, claims: Claims, interaction_id: str, validated: bool, notes: str | None) -> AIInteraction:
        if claims.role not in REVIEWER_ROLES:
            raise ForbiddenError("tu rol no puede validar interacciones de IA")
        interaction = self.interactions.get(interaction_id)
        if interaction is None:
            raise NotFoundError("interacción no encontrada")
        updated = interaction.validate(validated, notes)
        self.interactions.update(updated)
        return updated
