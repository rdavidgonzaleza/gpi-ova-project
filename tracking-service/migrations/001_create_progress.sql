-- tracking-service (spec 7.6). Idempotente.
CREATE TABLE IF NOT EXISTS progress (
  id                UUID PRIMARY KEY,
  student_id        UUID NOT NULL,
  ova_id            UUID NOT NULL,
  status            VARCHAR(20) NOT NULL CHECK (status IN ('no_iniciado','en_progreso','completado')),
  percent_complete  INTEGER NOT NULL DEFAULT 0,
  last_accessed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, ova_id)
);
