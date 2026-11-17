# activity-service

Actividades interactivas de cada OVA (quiz, caso de estudio, simulación,
colaborativa) y registro de intentos (spec 5.3). Node.js + TypeScript + Hono +
`pg` + Zod, arquitectura hexagonal (spec 4.3). Puerto por defecto: `8083`.

## Endpoints

| Método | Ruta | Auth | Respuesta |
|---|---|---|---|
| GET | `/api/activities?ova_id={id}` | — | `[ACTIVITY]` 200, ordenadas por `config.position` |
| GET | `/api/activities/{id}` | — | `ACTIVITY` 200 / 404 |
| POST | `/api/activities` | docente/administrador | `ACTIVITY` 201; valida `ova_id` con content-service |
| POST | `/api/activities/{id}/attempts` | cualquier rol; `student_id` = `sub` | `ACTIVITY_ATTEMPT` 201 |
| GET | `/healthz` | — | `ok` 200 |

`config` se valida según `type` con el schema de la spec 5.3.1. Errores:
`400 INVALID_BODY`/`INVALID_QUERY`, `401 UNAUTHORIZED`, `403 FORBIDDEN`/
`STUDENT_MISMATCH`, `404 OVA_NOT_FOUND`/`ACTIVITY_NOT_FOUND`,
`502 CONTENT_SERVICE_UNAVAILABLE`.

## Variables de entorno

- `DATABASE_URL`: conexión PostgreSQL propia del servicio (obligatoria).
- `JWT_SECRET`: secreto HMAC-SHA256 compartido con `identity-service` (obligatoria).
- `CONTENT_SERVICE_URL`: URL base de `content-service` (default `http://localhost:8082`).
- `PORT`: puerto HTTP (default `8083`).

## Desarrollo

```sh
npm install
npm run dev
npm run typecheck
```

Aplica las migraciones de `migrations/` en orden (son idempotentes;
`scripts/dev.sh` lo hace solo).

## Pruebas

Pruebas de integración contra Postgres (se omiten sin `TEST_DATABASE_URL`):

```sh
TEST_DATABASE_URL=postgres://gpi:gpi@localhost:55432/activity_test npm test
```
