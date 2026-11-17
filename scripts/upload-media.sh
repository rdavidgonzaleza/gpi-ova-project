#!/usr/bin/env bash
# Sube una imagen o un video de un OVA al bucket (Backblaze B2) usando la URL
# firmada de content-service, e imprime el valor listo para el bloque:
#   public_url|descripción
#
# Uso:
#   scripts/upload-media.sh <ova_id> <archivo> "<descripción>" [--position N]
#
# Con --position N además agrega el bloque al OVA en esa posición (PATCH con
# una versión nueva). Usa 0 para que el video abra el OVA.
#
# Variables (opcionales):
#   API_URL         Gateway o servicio. Default: http://localhost:8080 si el
#                   gateway responde, si no los puertos directos.
#   HITO_EMAIL      Cuenta docente. Default: docente.gpi@unicartagena.edu.co
#   HITO_PASSWORD   Default: Gpi2026*
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "uso: $0 <ova_id> <archivo> [descripción]" >&2
  exit 1
fi
OVA_ID="$1"; FILE="$2"; DESCRIPTION="${3:-}"; POSITION=""
if [[ "${4:-}" == "--position" ]]; then POSITION="${5:?falta el número de posición}"; fi
[[ -f "$FILE" ]] || { echo "no existe el archivo $FILE" >&2; exit 1; }

if [[ -n "${API_URL:-}" ]]; then
  AUTH_URL="$API_URL"; CONTENT_URL="$API_URL"
elif curl -fs http://localhost:8080/__health >/dev/null 2>&1; then
  AUTH_URL=http://localhost:8080; CONTENT_URL=http://localhost:8080
else
  AUTH_URL=http://localhost:8081; CONTENT_URL=http://localhost:8082
fi

case "${FILE,,}" in
  *.mp4) TYPE=video/mp4 ;; *.webm) TYPE=video/webm ;;
  *.png) TYPE=image/png ;; *.jpg|*.jpeg) TYPE=image/jpeg ;;
  *.webp) TYPE=image/webp ;; *.gif) TYPE=image/gif ;; *.svg) TYPE=image/svg+xml ;;
  *) echo "extensión no soportada: $FILE" >&2; exit 1 ;;
esac

json() { python3 -c 'import json,sys; print(json.dumps(dict(zip(sys.argv[1::2], sys.argv[2::2]))))' "$@"; }
field() { python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get(sys.argv[1]) or d.get("error",{}).get("message",""))' "$1"; }

TOKEN=$(curl -fsS -H 'Content-Type: application/json' \
  -d "$(json email "${HITO_EMAIL:-docente.gpi@unicartagena.edu.co}" password "${HITO_PASSWORD:-Gpi2026*}")" \
  "$AUTH_URL/api/auth/login" | field token)

RESPONSE=$(curl -sS -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" \
  -d "$(json file_name "$(basename "$FILE")" content_type "$TYPE")" \
  "$CONTENT_URL/api/ovas/$OVA_ID/media")
UPLOAD_URL=$(field upload_url <<<"$RESPONSE")
PUBLIC_URL=$(field public_url <<<"$RESPONSE")
if [[ "$UPLOAD_URL" != http* ]]; then
  echo "content-service rechazó la subida: $UPLOAD_URL" >&2
  exit 1
fi

echo "Subiendo $(du -h "$FILE" | cut -f1) a B2…" >&2
curl -fsS --progress-bar -X PUT -H "Content-Type: $TYPE" --upload-file "$FILE" "$UPLOAD_URL" -o /dev/null
BLOCK="$PUBLIC_URL|$DESCRIPTION"
if [[ -z "$POSITION" ]]; then
  echo "$BLOCK"
  exit 0
fi

BLOCK_TYPE=video; [[ "$TYPE" == image/* ]] && BLOCK_TYPE=imagen
PATCH=$(curl -fsS "$CONTENT_URL/api/ovas/$OVA_ID" | python3 -c '
import json, sys
ova = json.load(sys.stdin)
blocks = [{k: b[k] for k in ("type", "position", "content")} for b in ova.get("blocks", [])]
blocks.append({"type": sys.argv[1], "position": int(sys.argv[2]), "content": sys.argv[3]})
print(json.dumps({"blocks": blocks, "change_notes": "Se agrega " + sys.argv[1] + ": " + (sys.argv[4] or "archivo multimedia")}))
' "$BLOCK_TYPE" "$POSITION" "$BLOCK" "$DESCRIPTION")
curl -fsS -X PATCH -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" \
  -d "$PATCH" "$CONTENT_URL/api/ovas/$OVA_ID" -o /dev/null
echo "Bloque $BLOCK_TYPE agregado en la posición $POSITION: $BLOCK"
