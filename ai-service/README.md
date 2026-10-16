# ai-service

Servicio de IA generativa (spec 5.4). Python + FastAPI, arquitectura hexagonal.
Proveedor v1: Google Gemini.

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto HTTP | `8084` |
| `DATABASE_URL` | Postgres (`postgresql+psycopg://...`) o SQLite (`sqlite:///./ai.db`) | `sqlite:///./ai.db` |
| `JWT_SECRET` | Mismo secreto de identity-service | obligatoria |
| `AI_PROVIDER_API_KEY` | Clave de Gemini (https://aistudio.google.com/apikey) | — |
| `AI_MODEL` | Modelo de Gemini | `gemini-3.8-flash` |
| `CORS_ORIGINS` | Orígenes permitidos, separados por coma | `*` |
| `LOG_LEVEL` | `debug`, `info`, `warn` o `error` | `info` |

## Ejecutar

```sh
uv sync
cp .env.example .env
uv run python -m app.main
uv run pytest
```

## Endpoints

| Método | Ruta | Rol |
|---|---|---|
| POST | `/api/ai-activities` | docente, administrador |
| POST | `/api/ai-activities/{id}/run` | cualquiera; `student_id` debe coincidir con el token |
| GET | `/api/ai-interactions?validated={bool}` | validador, docente, administrador |
| POST | `/api/ai-interactions/{id}/validate` | validador, docente, administrador |
| GET | `/healthz` | público |

Errores con el formato de la spec 3.3. Códigos propios:

| Código | Estado | Cuándo |
|---|---|---|
| `AI_NOT_CONFIGURED` | 503 | Falta la clave del proveedor o no es válida |
| `AI_RATE_LIMITED` | 429 | Se alcanzó el límite del plan gratuito |
| `AI_PROVIDER_ERROR` | 502 | El proveedor falló |

## Plantillas de prompt

- Cada actividad de IA guarda un `prompt_template`.
- `{{input}}` marca dónde va el aporte del estudiante. El servicio lo inserta entre
  `<<<` y `>>>`.
- Si la plantilla contiene `[[formato:json]]`, se le pide al modelo una respuesta
  JSON. El marcador no se envía al modelo.
- Las actividades definidas por el equipo docente están en
  `seed/ai_activities.json`. Se cargan o actualizan al iniciar el servicio.
- `prompt_template` puede escribirse como un arreglo de líneas para que sea más
  fácil de leer.
