CREATE TABLE evaluations (
  id       UUID PRIMARY KEY,
  ova_id   UUID NOT NULL,
  type     VARCHAR(20) NOT NULL CHECK (type IN ('autoevaluacion','transferencia')),
  config   JSONB NOT NULL
);

CREATE TABLE evaluation_attempts (
  id             UUID PRIMARY KEY,
  evaluation_id  UUID NOT NULL REFERENCES evaluations(id),
  student_id     UUID NOT NULL,
  score          NUMERIC(5,2) NOT NULL,
  feedback       TEXT,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
