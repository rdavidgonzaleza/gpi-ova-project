# Activity service

Servicio de creación y consulta de actividades con Node.js, TypeScript, Hono y
PostgreSQL.

## Variables de entorno

- `DATABASE_URL`: conexión PostgreSQL propia del servicio (obligatoria).
- `JWT_SECRET`: secreto HMAC-SHA256 compartido con `identity-service` (obligatoria).
- `CONTENT_SERVICE_URL`: URL base de `content-service` (default `http://localhost:8082`).
- `PORT`: puerto HTTP (default `8083`).

Aplica las migraciones de `migrations/` antes de iniciar, en orden numérico.

## Desarrollo

```sh
npm install
npm run dev
```

`POST /api/activities` requiere token de `docente` o `administrador`, valida el
OVA con `GET /api/ovas/{id}` y devuelve `201` con la actividad creada. `GET
/api/activities?ova_id={id}` devuelve las actividades del OVA sin requerir
token. `POST /api/activities/{id}/attempts` requiere token de estudiante y
recibe `{ "student_id": "<uuid>", "answers": { "<id-pregunta>": "<respuesta>" } }`.
El `student_id` debe coincidir con el `sub` del token; el servicio guarda las
respuestas en JSONB y devuelve el intento creado con `201`.

Ejemplo de `config` para una actividad `quiz`:

```json
{
  "questions": [
    {
      "id": "q1",
      "prompt": "¿Qué documento define el alcance?",
      "options": [
        { "id": "a", "text": "Acta de constitución" },
        { "id": "b", "text": "EDT" }
      ],
      "correct_option_id": "b"
    }
  ]
}
```
