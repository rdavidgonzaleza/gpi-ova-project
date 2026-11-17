# tracking-service

Progreso del estudiante por OVA y reporte agregado de uso para el docente
(spec 5.6). Node.js + TypeScript + Hono + `pg` + Zod, arquitectura hexagonal
(spec 4.3). Puerto por defecto: `8086`.

## Endpoints

| Método | Ruta | Auth | Respuesta |
|---|---|---|---|
| PUT | `/api/progress` | token; un estudiante solo escribe su propio `student_id` | `PROGRESS` 200 (crea o actualiza por `student_id` + `ova_id`) |
| GET | `/api/progress?student_id={id}` | token; estudiantes solo el propio, docentes/administradores cualquiera | `[PROGRESS]` 200 |
| GET | `/api/reports/usage?group_id={id}` | docente/administrador | `USAGE_REPORT` 200 |
| GET | `/healthz` | — | `ok` 200 |

`percent_complete` se redondea al entero más cercano (0–100). En la v1 no hay
entidad de grupos: `group_id` identifica el reporte y se agregan todos los
registros de progreso.

Errores (spec 3.3): `400 INVALID_BODY`/`INVALID_QUERY`, `401 UNAUTHORIZED`,
`403 FORBIDDEN`.

## Variables de entorno

- `DATABASE_URL` (obligatoria): `postgres://gpi:gpi@localhost:55432/tracking`
- `JWT_SECRET` (obligatoria): secreto HMAC compartido con identity-service.
- `PORT` (opcional): `8086`.

## Desarrollo y pruebas

```sh
npm install
npm run dev
npm run typecheck
TEST_DATABASE_URL=postgres://gpi:gpi@localhost:55432/tracking_test npm test
```

Aplica `migrations/001_create_progress.sql` antes de arrancar (`scripts/dev.sh`
lo hace solo).
