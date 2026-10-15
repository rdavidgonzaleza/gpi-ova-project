CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('estudiante','docente','administrador','validador')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
