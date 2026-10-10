CREATE TABLE activity_attempts (
  id           UUID PRIMARY KEY,
  activity_id  UUID NOT NULL REFERENCES activities(id),
  student_id   UUID NOT NULL,
  answers      JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
