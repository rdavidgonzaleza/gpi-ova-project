"""Adapter de persistencia con SQLAlchemy Core (sin ORM, spec 4.2).

Funciona con Postgres (despliegue) y con SQLite (desarrollo local): el
dialecto lo decide DATABASE_URL.
"""

from datetime import UTC, datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    MetaData,
    String,
    Table,
    Text,
    create_engine,
    insert,
    select,
    update,
)
from sqlalchemy.engine import Engine, RowMapping

from app.domain.entities import AIActivity, AIInteraction

metadata = MetaData()

ai_activities = Table(
    "ai_activities",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("activity_id", String(36), nullable=False),
    Column("prompt_template", Text, nullable=False),
    Column("provider", String(50), nullable=False),
    Column("created_at", DateTime(timezone=True), nullable=False),
)

ai_interactions = Table(
    "ai_interactions",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("ai_activity_id", String(36), ForeignKey("ai_activities.id"), nullable=False),
    Column("student_id", String(36), nullable=False),
    Column("input", Text, nullable=False),
    Column("ai_output", Text, nullable=False),
    Column("validated", Boolean, nullable=False, default=False),
    Column("validation_notes", Text),
    Column("created_at", DateTime(timezone=True), nullable=False),
)


def create_db_engine(url: str) -> Engine:
    if url.startswith("postgres://") or url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url.split("://", 1)[1]
    engine = create_engine(url, pool_pre_ping=True)
    metadata.create_all(engine)
    return engine


def _utc(value: datetime) -> datetime:
    # SQLite devuelve fechas sin zona horaria; se guardan siempre en UTC.
    return value if value.tzinfo else value.replace(tzinfo=UTC)


def _activity(row: RowMapping) -> AIActivity:
    return AIActivity(**{**row, "created_at": _utc(row["created_at"])})


def _interaction(row: RowMapping) -> AIInteraction:
    return AIInteraction(**{**row, "created_at": _utc(row["created_at"])})


class SqlAIActivityRepository:
    def __init__(self, engine: Engine):
        self.engine = engine

    def save(self, activity: AIActivity) -> None:
        with self.engine.begin() as conn:
            conn.execute(insert(ai_activities).values(**activity.__dict__))

    def upsert(self, activity: AIActivity) -> None:
        with self.engine.begin() as conn:
            exists = conn.execute(select(ai_activities.c.id).where(ai_activities.c.id == activity.id)).first()
            if exists:
                values = {k: v for k, v in activity.__dict__.items() if k not in ("id", "created_at")}
                conn.execute(update(ai_activities).where(ai_activities.c.id == activity.id).values(**values))
            else:
                conn.execute(insert(ai_activities).values(**activity.__dict__))

    def get(self, activity_id: str) -> AIActivity | None:
        with self.engine.connect() as conn:
            row = conn.execute(select(ai_activities).where(ai_activities.c.id == activity_id)).mappings().first()
        return _activity(row) if row else None


class SqlAIInteractionRepository:
    def __init__(self, engine: Engine):
        self.engine = engine

    def save(self, interaction: AIInteraction) -> None:
        with self.engine.begin() as conn:
            conn.execute(insert(ai_interactions).values(**interaction.__dict__))

    def get(self, interaction_id: str) -> AIInteraction | None:
        with self.engine.connect() as conn:
            row = conn.execute(select(ai_interactions).where(ai_interactions.c.id == interaction_id)).mappings().first()
        return _interaction(row) if row else None

    def update(self, interaction: AIInteraction) -> None:
        with self.engine.begin() as conn:
            conn.execute(
                update(ai_interactions)
                .where(ai_interactions.c.id == interaction.id)
                .values(validated=interaction.validated, validation_notes=interaction.validation_notes)
            )

    def list(self, validated: bool | None) -> list[AIInteraction]:
        query = select(ai_interactions).order_by(ai_interactions.c.created_at.desc())
        if validated is not None:
            query = query.where(ai_interactions.c.validated == validated)
        with self.engine.connect() as conn:
            return [_interaction(row) for row in conn.execute(query).mappings()]
