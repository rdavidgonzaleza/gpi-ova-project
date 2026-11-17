#!/usr/bin/env bash
# Levanta el entorno local completo: Postgres (Docker), los seis
# microservicios, el API Gateway KrakenD (Docker, :8080) y el frontend.
# Ctrl+C detiene todo. RESEED=1 reinicia el contenido de los OVA desde
# frontend/src/content (borra las ediciones hechas en el editor).
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
compose() { docker compose -f "$LOCAL/compose.yaml" "$@"; }
psql_in() { compose exec -T -e PGOPTIONS=--client-min-messages=warning db psql -v ON_ERROR_STOP=1 -q -U gpi -d "$@"; }

echo "▸ Base de datos"
compose up -d --wait >/dev/null 2>&1
# Bases creadas después del primer arranque del volumen (init/ solo corre una vez).
for db in identity content activity ai evaluation tracking; do
  if [[ "$(echo "SELECT 1 FROM pg_database WHERE datname = '$db'" | psql_in postgres -tA)" != "1" ]]; then
    echo "CREATE DATABASE $db" | psql_in postgres
  fi
done

# Migraciones (idempotentes) y datos iniciales.
psql_in identity < "$ROOT/identity-service/migrations/001_create_users.sql"
psql_in identity < "$LOCAL/seed/identity_users.sql"
psql_in content < "$ROOT/content-service/migrations/001_create_ovas.sql"
if [[ "${RESEED:-}" == "1" ]]; then
  echo "TRUNCATE content_blocks, activities, ova_versions, ovas" | psql_in content
fi
psql_in content < "$LOCAL/seed/content_ovas.sql"
for m in "$ROOT"/activity-service/migrations/*.sql; do psql_in activity < "$m"; done
psql_in activity < "$LOCAL/seed/activity_activities.sql"
psql_in evaluation < "$ROOT/evaluation-service/migrations/001_create_evaluations.sql"
psql_in evaluation < "$LOCAL/seed/evaluation_ovas.sql"
psql_in tracking < "$ROOT/tracking-service/migrations/001_create_progress.sql"
psql_in tracking < "$LOCAL/seed/tracking_progress.sql"

pids=()
cleanup() {
  echo; echo "▸ Deteniendo servicios"
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
  docker compose -f "$ROOT/deploy/gateway/compose.yaml" down >/dev/null 2>&1 || true
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
for svc in activity-service evaluation-service tracking-service; do
  (cd "$ROOT/$svc" && [[ -d node_modules ]] || npm install --silent)
done
(cd "$ROOT/ai-service" && uv sync --quiet)
(cd "$ROOT/frontend" && [[ -d node_modules ]] || pnpm install --silent)

start identity env -C "$ROOT/identity-service" PORT=8081 DATABASE_URL="$DB/identity?sslmode=disable" \
  JWT_SECRET="$JWT_SECRET" go run ./cmd/api
start content env -C "$ROOT/content-service" PORT=8082 DATABASE_URL="$DB/content?sslmode=disable" \
  JWT_SECRET="$JWT_SECRET" go run ./cmd/api
start activity env -C "$ROOT/activity-service" PORT=8083 DATABASE_URL="$DB/activity" \
  JWT_SECRET="$JWT_SECRET" CONTENT_SERVICE_URL=http://localhost:8082 npm run dev
start ai env -C "$ROOT/ai-service" PORT=8084 DATABASE_URL="postgresql+psycopg://gpi:gpi@localhost:55432/ai" \
  JWT_SECRET="$JWT_SECRET" AI_PROVIDER_API_KEY="${AI_PROVIDER_API_KEY:-}" AI_MODEL="${AI_MODEL:-gemini-3.8-flash}" \
  uv run python -m app.main
start evaluation env -C "$ROOT/evaluation-service" PORT=8085 DATABASE_URL="$DB/evaluation" \
  JWT_SECRET="$JWT_SECRET" npm run dev
start tracking env -C "$ROOT/tracking-service" PORT=8086 DATABASE_URL="$DB/tracking" \
  JWT_SECRET="$JWT_SECRET" npm run dev
start frontend env -C "$ROOT/frontend" pnpm dev --strictPort

echo "▸ API Gateway (KrakenD :8080)"
docker compose -f "$ROOT/deploy/gateway/compose.yaml" up -d >/dev/null 2>&1 \
  || echo "  ⚠ no se pudo iniciar KrakenD; pon VITE_API_BASE_URL= vacío en frontend/.env.local para usar el proxy de Vite"

echo "▸ Esperando servicios"
for target in 8081 8082 8083 8084 8085 8086; do
  for _ in $(seq 1 60); do
    curl -fs "http://localhost:$target/healthz" >/dev/null 2>&1 && break
    sleep 1
  done
  curl -fs "http://localhost:$target/healthz" >/dev/null 2>&1 || echo "  ⚠ el servicio en :$target no respondió; revisa su log"
done
curl -fs http://localhost:8080/__health >/dev/null 2>&1 || echo "  ⚠ el gateway en :8080 no respondió"
[[ -z "${AI_PROVIDER_API_KEY:-}" ]] && echo "  ⚠ AI_PROVIDER_API_KEY está vacía en deploy/local/.env: la IA no responderá"
[[ -z "${S3_BUCKET:-}" ]] && echo "  · Sin S3_* en deploy/local/.env: la subida de imágenes y videos está desactivada"

echo
echo "Listo → http://localhost:5173   (Ctrl+C para detener)"
wait
