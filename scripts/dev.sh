#!/usr/bin/env bash
# Levanta el entorno local completo: Postgres (Docker), identity-service,
# evaluation-service, ai-service y el frontend. Ctrl+C detiene todo.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCAL="$ROOT/deploy/local"
LOGS="$LOCAL/logs"
mkdir -p "$LOGS"

if [[ ! -f "$LOCAL/.env" ]]; then
  cp "$LOCAL/.env.example" "$LOCAL/.env"
  echo "Se creó deploy/local/.env; agrega tu AI_PROVIDER_API_KEY ahí."
fi
set -a; source "$LOCAL/.env"; set +a

DB="postgres://gpi:gpi@localhost:55432"
psql_in() { docker compose -f "$LOCAL/compose.yaml" exec -T -e PGOPTIONS=--client-min-messages=warning db psql -v ON_ERROR_STOP=1 -q -U gpi -d "$@"; }

echo "▸ Base de datos"
docker compose -f "$LOCAL/compose.yaml" up -d --wait >/dev/null 2>&1

# Migraciones (solo si faltan las tablas) y datos iniciales (idempotentes).
psql_in identity < "$ROOT/identity-service/migrations/001_create_users.sql"
psql_in identity < "$LOCAL/seed/identity_users.sql"
if [[ "$(echo "SELECT to_regclass('public.evaluations') IS NULL" | psql_in evaluation -tA)" == "t" ]]; then
  psql_in evaluation < "$ROOT/evaluation-service/migrations/001_create_evaluations.sql"
fi
for seed in "$LOCAL"/seed/evaluation_*.sql; do
  [[ -f "$seed" ]] && psql_in evaluation < "$seed"
done

pids=()
cleanup() {
  echo; echo "▸ Deteniendo servicios"
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

start() {
  local name="$1"; shift
  ( "$@" ) >"$LOGS/$name.log" 2>&1 &
  pids+=("$!")
  echo "  $name → deploy/local/logs/$name.log"
}

echo "▸ Servicios"
(cd "$ROOT/evaluation-service" && [[ -d node_modules ]] || npm install --silent)
(cd "$ROOT/ai-service" && uv sync --quiet)
(cd "$ROOT/frontend" && [[ -d node_modules ]] || pnpm install --silent)

start identity env -C "$ROOT/identity-service" PORT=8081 DATABASE_URL="$DB/identity?sslmode=disable" \
  JWT_SECRET="$JWT_SECRET" go run ./cmd/api
start evaluation env -C "$ROOT/evaluation-service" PORT=8085 DATABASE_URL="$DB/evaluation" \
  JWT_SECRET="$JWT_SECRET" npm run dev
start ai env -C "$ROOT/ai-service" PORT=8084 DATABASE_URL="postgresql+psycopg://gpi:gpi@localhost:55432/ai" \
  JWT_SECRET="$JWT_SECRET" AI_PROVIDER_API_KEY="${AI_PROVIDER_API_KEY:-}" AI_MODEL="${AI_MODEL:-gemini-3.8-flash}" \
  uv run python -m app.main
start frontend env -C "$ROOT/frontend" pnpm dev --strictPort

echo "▸ Esperando servicios"
for target in 8081 8085 8084; do
  for _ in $(seq 1 60); do
    curl -fs "http://localhost:$target/healthz" >/dev/null 2>&1 && break
    sleep 1
  done
  curl -fs "http://localhost:$target/healthz" >/dev/null 2>&1 || echo "  ⚠ el servicio en :$target no respondió; revisa su log"
done
[[ -z "${AI_PROVIDER_API_KEY:-}" ]] && echo "  ⚠ AI_PROVIDER_API_KEY está vacía en deploy/local/.env: la IA no responderá"

echo
echo "Listo → http://localhost:5173   (Ctrl+C para detener)"
wait
