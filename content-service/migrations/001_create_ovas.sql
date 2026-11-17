-- content-service (spec 7.2). Idempotente: se puede aplicar varias veces.
CREATE TABLE IF NOT EXISTS ovas (
  id                UUID PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  description       TEXT NOT NULL,
  learning_outcome  TEXT NOT NULL,
  status            VARCHAR(20) NOT NULL CHECK (status IN ('borrador','publicado')),
  created_by        UUID,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ova_versions (
  id              UUID PRIMARY KEY,
  ova_id          UUID NOT NULL REFERENCES ovas(id),
  version_number  INTEGER NOT NULL,
  change_notes    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ova_id, version_number)
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id        UUID PRIMARY KEY,
  ova_id    UUID NOT NULL REFERENCES ovas(id),
  type      VARCHAR(20) NOT NULL CHECK (type IN ('texto','imagen','video')),
  position  INTEGER NOT NULL,
  content   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS content_blocks_ova_idx ON content_blocks (ova_id, position);

CREATE TABLE IF NOT EXISTS activities (
  id           UUID PRIMARY KEY,
  ova_id       UUID NOT NULL REFERENCES ovas(id),
  title        VARCHAR(255) NOT NULL,
  description  TEXT NOT NULL,
  is_ai        BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS activities_ova_idx ON activities (ova_id);
