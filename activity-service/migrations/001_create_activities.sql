CREATE TABLE activities (
  id           UUID PRIMARY KEY,
  ova_id       UUID NOT NULL,
  type         VARCHAR(20) NOT NULL CHECK (type IN ('quiz','caso_estudio','simulacion','colaborativa')),
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  config       JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
