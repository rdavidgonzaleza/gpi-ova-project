# Evaluation service

Servicio de autoevaluaciones con Node.js, TypeScript, Hono y PostgreSQL.

## Configuración

- `DATABASE_URL`: conexión PostgreSQL del servicio (obligatoria).
- `JWT_SECRET`: el mismo secreto HMAC-SHA256 de `identity-service` (obligatoria).
- `PORT`: puerto HTTP (default `8085`).

Aplica `migrations/001_create_evaluations.sql` antes de iniciar el servicio.
Cada evaluación debe guardar en `evaluations.config` su clave de respuestas:

```json
{
  "questions": [
    {
      "id": "pregunta-1",
      "correct_answer": "opcion-b",
      "feedback_correct": "Correcto.",
      "feedback_incorrect": "Repasa el tema de alcance."
    }
  ]
}
```

El proyecto aún no define un endpoint para crear evaluaciones; por ahora, la
configuración se carga al insertar la evaluación en PostgreSQL.

Las respuestas del intento usan IDs de pregunta como claves, por ejemplo
`{"pregunta-1":"opcion-b"}`. El puntaje es el porcentaje de aciertos.

## Desarrollo

```sh
npm install
npm run dev
```

## Endpoints

- `POST /api/evaluations/:id/attempts` — requiere token de estudiante y registra
  `student_id` y `answers`.
- `GET /api/evaluations/attempts?student_id=:id` — requiere token; estudiantes
  solo consultan su historial y docentes/administradores pueden consultar por
  estudiante.
- `GET /healthz` — respuesta `ok`.

## Pruebas

Pruebas de integración contra Postgres (se omiten sin `TEST_DATABASE_URL`):

```sh
TEST_DATABASE_URL=postgres://gpi:gpi@localhost:55432/evaluation_test npm test
```

`GET /api/evaluations` nunca devuelve `correct_answer` ni `feedback_*`: solo
el `id` de cada pregunta. La clave se lee únicamente al calificar un intento.
