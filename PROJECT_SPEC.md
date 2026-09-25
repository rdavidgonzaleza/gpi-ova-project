# Especificación del Proyecto
## OVA con IA para la enseñanza de Gestión de Proyectos Informáticos

---

## 0. Cómo usar este documento

Este documento es la fuente única de verdad del proyecto y está escrito para que una persona o un agente de IA pueda descomponerlo en tareas de desarrollo sin tener
que inferir ni inventar decisiones. Reglas de lectura:

- Cada endpoint, tabla y componente tiene un estado: **Implementado** (ya existe
  código funcional) o **Pendiente** (todavía no existe, hay que construirlo). Se generan tareas de desarrollo únicamente para lo
  marcado Pendiente; lo marcado Implementado solo debe generar tareas de *revisión, prueba o
  endurecimiento* (hardening), nunca de creación desde cero.
- Las tablas de "Esquema de datos" (sección 7) son la única fuente de verdad para
  nombres de columnas y tipos. No se deben crear columnas adicionales sin agregarlas
  primero a este documento.
- Las tablas de "Endpoints" (sección 5) son la única fuente de verdad para rutas,
  métodos, payloads y códigos de estado HTTP. No se debe cambiar un nombre de campo sin
  actualizar este documento primero.
- Todo lo que empiece con "Decisión:" es una decisión de arquitectura ya tomada y
  cerrada para la v1 del proyecto. No se han de implementar alternativas a menos que todo el equipo de desarrollo este de acuerdo
---

## 1. Resumen del proyecto

Colección de al menos 8 Objetos Virtuales de Aprendizaje (OVA), apoyados en IA
generativa, para la asignatura Gestión de Proyectos Informáticos. Arquitectura de
microservicios en Go, Python y Node.js/TypeScript, cada uno con arquitectura
hexagonal (puertos y adaptadores) y base de datos propia, desplegados
inicialmente en Cloud Run detrás de un único API Gateway, consumidos por un
frontend SPA.

Roles de usuario: `estudiante`, `docente`, `administrador`, `validador`.

---

## 2. Arquitectura general

```
Frontend SPA (React + TypeScript)
        |
        v
   API Gateway (KrakenD, único punto de entrada)
        |
   +----+----+----+----+----+----+
   |    |    |    |    |    |    |
Identidad Contenidos Actividades IA Evaluación Seguimiento
 (Go)     (Go)       (Node/Hono) (Python/FastAPI) (Node/Hono) (Node/Hono)
   |         |            |          |              |            |
 SQLite/   SQLite/      Postgres   Postgres       Postgres     Postgres
 Postgres  Postgres     (Neon)     (Neon)         (Neon)       (Neon)
```

Decisión: cada microservicio tiene su propia base de datos (*database per
service*). No hay foreign keys físicas entre bases de datos de servicios
distintos: una referencia cruzada (p. ej. `student_id` en el servicio de
Evaluación) es solo un identificador lógico, resuelto vía llamada HTTP al
servicio dueño, nunca vía JOIN directo a otra base de datos.

Decisión: el API Gateway solo enruta por *path*; **no** valida JWT. Cada
microservicio valida el token por su cuenta usando el mismo `JWT_SECRET`
compartido (ver sección 3.4). Esto evita un punto único de fallo de auth y
mantiene cada servicio autónomo.

Decisión: comunicación entre microservicios es síncrona vía REST/JSON para la
v1. Un bus de eventos (p. ej. Pub/Sub) queda fuera de alcance de la v1 y se
documentará como evolución futura cuando el servicio de Seguimiento lo requiera.

---

## 3. Convenciones transversales (obligatorias en todos los servicios)

### 3.1 Identificadores
Decisión: todos los IDs de entidades son **UUID v4**, representados como string
en JSON (ej. `"3fa85f64-5717-4562-b3fc-2c963f66afa6"`).

### 3.2 Formato JSON
- Claves en `snake_case`.
- Fechas en ISO 8601 UTC (`"2026-09-20T14:30:00Z"`).
- Booleanos como `true`/`false` (nunca `0`/`1` en el JSON expuesto, aunque
  internamente SQLite los guarde como entero).

### 3.3 Formato de error estándar (para servicios pendientes)
```json
{
  "error": {
    "code": "EMAIL_TAKEN",
    "message": "El correo ya está registrado"
  }
}
```

### 3.4 Autenticación
- Header `Authorization: Bearer <token>`.
- Token HMAC-SHA256.
- Claims: `sub` (user id), `role`, `exp` (unix timestamp).
- Variable de entorno compartida: `JWT_SECRET` — **debe ser idéntica** en
  todos los microservicios que necesiten validar tokens.
- Decisión: para la v1, solo los endpoints de escritura (POST/PATCH/DELETE)
  requieren token válido. Los GET de contenido son públicos para simplificar
  la demo y el consumo desde el frontend.
- Pendiente en todos los servicios excepto identity: implementar el
  middleware de verificación de token (reutilizar la lógica de
  `internal/adapters/token/hmac_token.go` de `identity-service` como
  referencia — la misma firma HMAC, mismo secreto).

### 3.5 Variables de entorno estándar por servicio
| Variable | Descripción | Obligatoria |
|---|---|---|
| `PORT` | Puerto HTTP del servicio | No (tiene default por servicio, ver sección 5) |
| `DATABASE_URL` | Cadena de conexión Postgres | Sí |
| `JWT_SECRET` | Secreto compartido para validar tokens | Sí (excepto en servicios que no reciben escritura protegida aún) |
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` | No (default `info`) |
| `AI_PROVIDER_API_KEY` | Credencial del proveedor de IA generativa | Sí, solo en el servicio de IA |

### 3.6 Salud del servicio
Todo microservicio expone `GET /healthz` → `200 OK`, cuerpo `"ok"`.

### 3.7 CORS
En local: `Access-Control-Allow-Origin: *`. En despliegue: restringir al
dominio del frontend y al del API Gateway únicamente (tarea Pendiente de
endurecimiento antes de producción).

---

## 4. Arquitectura hexagonal — estructura por stack

Principio común a todos los servicios, sin excepción:

```
domain/       entidades y reglas de negocio puras. CERO dependencias externas
              (nada de librerías HTTP, SQL, etc. importadas aquí).
ports/        interfaces que el dominio necesita del exterior
              (repositorios, hasher, emisor de tokens, cliente de IA...).
application/  casos de uso: orquestan domain + ports. Un archivo por caso de uso.
adapters/     implementaciones concretas de los ports:
                http/        entrada HTTP (controladores/handlers + rutas)
                repository/  salida a base de datos
                <otros>/     cualquier otro adapter de salida (ej. cliente IA)
composition   punto único donde se conectan adapters con application
root          (main.go / main.py / index.ts) — inyección de dependencias manual.
```

`domain/` y `application/` nunca importan nada de `adapters/`.
La dependencia siempre apunta hacia adentro (adapters → application → domain).

### 4.1 Go
```
service-name/
  go.mod
  cmd/api/main.go
  internal/
    domain/
    ports/
    application/
    adapters/
      httpapi/
      repository/
```

### 4.2 Python / FastAPI (usar en el servicio de IA generativa)
```
service-name/
  pyproject.toml
  app/
    domain/
      __init__.py
      entities.py
    ports/
      __init__.py
      repositories.py      # Protocol classes (interfaces estructurales)
      ai_provider.py
    application/
      __init__.py
      run_ai_activity.py   # una clase/función por caso de uso
    adapters/
      http/
        __init__.py
        router.py           # APIRouter de FastAPI
        schemas.py           # modelos Pydantic de request/response
      repository/
        __init__.py
        postgres_repository.py
      ai_provider/
        __init__.py
        openai_provider.py   # o el proveedor de IA que se elija
    main.py                  # crea la app FastAPI, inyecta dependencias
```
Convenciones: Pydantic para validación de entrada/salida (schemas.py nunca se
importa desde domain/); SQLAlchemy Core o asyncpg para el adapter de Postgres
(no ORM completo, para mantener el repositorio simple y explícito).

### 4.3 Node.js / TypeScript
```
service-name/
  package.json
  tsconfig.json
  src/
    domain/
      entities.ts
    ports/
      repositories.ts        # interfaces TypeScript
    application/
      createActivity.ts       # una función/clase por caso de uso
      registerAttempt.ts
    adapters/
      http/
        router.ts              # rutas de Hono
        schemas.ts              # validación con Zod
      repository/
        postgresRepository.ts
    index.ts                    # composition root, arranca el servidor Hono
```
Convenciones: Zod para validar payloads de entrada; el cliente de Postgres
recomendado es `pg` (node-postgres) directo, sin ORM, por las mismas razones
que en Python.

---

## 5. Microservicios

Para cada servicio: responsabilidad, estado, stack, casos de uso, endpoints,
variables de entorno específicas y dependencias salientes hacia otros
servicios.

### 5.1 Identidad — `identity-service`
**Estado:** Pendiente. **Stack** Go **Puerto:** `8081`.
**Responsabilidad:** registro, autenticación y emisión de tokens.
**Entidad principal:** `USERS` (ver sección 7.1).

| Caso de uso | RF/RNF relacionado |
|---|---|
| UC-01 Registrar usuario y asignar rol | Transversal |
| UC-02 Iniciar sesión y emitir token | RNF Seguridad |

| Método | Ruta | Request | Response (200/201) | Estado |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{email, full_name, password, role}` | `{id, email, full_name, role}` — 201 | Implementado |
| POST | `/api/auth/login` | `{email, password}` | `{token, user:{id,email,full_name,role}}` — 200 | Implementado |
| GET | `/api/auth/me` | header `Authorization` | `{id, email, full_name, role}` — 200 | Pendiente |
| GET | `/healthz` | — | `"ok"` — 200 | Implementado |

Errores: `409` correo ya registrado; `401` credenciales inválidas; `400`
cuerpo inválido.

**Variables de entorno propias:** ninguna adicional a la sección 3.5.
**Dependencias salientes:** ninguna (es el servicio más independiente).

---

### 5.2 Contenidos OVA — `content-service`
**Estado:** Pendiente **Stack** Go. **Puerto:** `8082`.
**Responsabilidad:** CRUD y versionado de los OVA, sus bloques de contenido y
sus actividades asociadas.
**Entidades:** `OVAS`, `OVA_VERSIONS`, `CONTENT_BLOCKS` (ver sección 7.2).

| Caso de uso | RF relacionado |
|---|---|
| UC-03 Crear/editar un OVA | RF-01, RF-02, RF-03 |
| UC-04 Versionar contenido de un OVA | RF-17 |
| UC-05 Publicar/despublicar un OVA | RF-16 |
| UC-06 Consultar catálogo de OVA | RF-01, RF-04 |

| Método | Ruta | Request | Response | Estado |
|---|---|---|---|---|
| GET | `/api/ovas` | — | `[OVA...]` — 200 | Implementado |
| GET | `/api/ovas/{id}` | — | `OVA` (con `blocks`, `activities`) — 200 / `404` | Implementado |
| POST | `/api/ovas` | `{title, description, learning_outcome, blocks[], activities[]}` | `OVA` — 201 | Implementado (sin validar token todavía) |
| PATCH | `/api/ovas/{id}` | campos a actualizar | `OVA` — 200 | Pendiente |
| POST | `/api/ovas/{id}/publish` | — | `OVA` con `status: "publicado"` — 200 | Pendiente |
| GET | `/api/ovas/{id}/versions` | — | `[OVA_VERSION...]` — 200 | Pendiente |
| GET | `/healthz` | — | `"ok"` — 200 | Implementado |

`blocks[]` item: `{type: "texto"|"imagen"|"video", position, content}`.
`activities[]` item: `{title, description, is_ai}`.

**Dependencias salientes:** llama a `identity-service` (`GET /api/auth/me`)
para validar el token en escrituras.

---

### 5.3 Actividades — `activity-service`
**Estado:** Pendiente. **Stack:** Node.js + TypeScript + Hono. **Puerto
propuesto:** `8083`.
**Responsabilidad:** definir actividades interactivas (quizzes, casos,
simulaciones) y registrar los intentos de los estudiantes.
**Entidades:** `ACTIVITIES`, `ACTIVITY_ATTEMPTS` (ver sección 7.3).

| Caso de uso | RF relacionado |
|---|---|
| UC-07 Definir actividad interactiva | RF-05, RF-06, RF-07 |
| UC-08 Registrar intento de actividad | RF-05 |

| Método | Ruta | Request | Response | Estado |
|---|---|---|---|---|
| GET | `/api/activities?ova_id={id}` | — | `[ACTIVITY...]` — 200 | Pendiente |
| POST | `/api/activities` | `{ova_id, type, title, config}` (requiere token docente/administrador) | `ACTIVITY` — 201 | Pendiente |
| GET | `/api/activities/{id}` | — | `ACTIVITY` — 200 / `404` | Pendiente |
| POST | `/api/activities/{id}/attempts` | `{student_id, answers}` (requiere token) | `ACTIVITY_ATTEMPT` — 201 | Pendiente |
| GET | `/healthz` | — | `"ok"` — 200 | Pendiente |

`type` ∈ `{"quiz", "caso_estudio", "simulacion", "colaborativa"}`.
`config`: objeto JSON libre según `type` (ej. para `quiz`: lista de preguntas
y opciones) — definir el schema exacto de `config` como tarea de diseño
técnico antes de implementar, y agregarlo a este documento.

**Dependencias salientes:** valida `ova_id` contra `content-service`
(`GET /api/ovas/{id}`) al crear una actividad, para evitar huérfanas.

---

### 5.4 IA generativa — `ai-service`
**Estado:** Pendiente. **Stack:** Python + FastAPI. **Puerto propuesto:**
`8084`.
**Responsabilidad:** ejecutar actividades apoyadas en IA generativa y
registrar cada interacción junto con su validación humana.
**Entidades:** `AI_ACTIVITIES`, `AI_INTERACTIONS` (ver sección 7.4).

| Caso de uso | RF relacionado |
|---|---|
| UC-09 Ejecutar actividad apoyada en IA | RF-08, RF-11 |
| UC-10 Registrar y validar interacción de IA | RF-09, RF-10 |

| Método | Ruta | Request | Response | Estado |
|---|---|---|---|---|
| POST | `/api/ai-activities` | `{activity_id, prompt_template, provider}` | `AI_ACTIVITY` — 201 | Pendiente |
| POST | `/api/ai-activities/{id}/run` | `{student_id, input}` (requiere token) | `{interaction_id, ai_output}` — 200 | Pendiente |
| POST | `/api/ai-interactions/{id}/validate` | `{validated: bool, notes}` (requiere token) | `AI_INTERACTION` — 200 | Pendiente |
| GET | `/healthz` | — | `"ok"` — 200 | Pendiente |

Decisión: el `provider` es un valor libre (ej. `"anthropic"`, `"openai"`) y
el adapter concreto (`adapters/ai_provider/`) se decide en la tarea de
implementación; el puerto `ai_provider.py` debe quedar desacoplado para poder
cambiar de proveedor sin tocar `application/` (cumple RF-11 del SRS).
La respuesta de `run` **siempre** debe ir acompañada, en el frontend, de la
instrucción de validación crítica (RF-09) — esto es responsabilidad del
frontend al renderizar, no de este servicio.

**Dependencias salientes:** llama al proveedor de IA externo vía su SDK/API;
no depende de otro microservicio propio.

---

### 5.5 Evaluación — `evaluation-service`
**Estado:** Pendiente. **Stack:** Node.js + TypeScript + Hono. **Puerto
propuesto:** `8085`.
**Responsabilidad:** autoevaluaciones, retroalimentación y su historial.
**Entidades:** `EVALUATIONS`, `EVALUATION_ATTEMPTS` (ver sección 7.5).

| Caso de uso | RF relacionado |
|---|---|
| UC-11 Responder autoevaluación | RF-12, RF-13 |
| UC-12 Consultar historial de resultados | RF-14 |

| Método | Ruta | Request | Response | Estado |
|---|---|---|---|---|
| GET | `/api/evaluations?ova_id={id}` | — | `[EVALUATION...]` — 200 | Pendiente |
| POST | `/api/evaluations/{id}/attempts` | `{student_id, answers}` (requiere token de estudiante; `student_id` debe coincidir con `sub`) | `{score, feedback}` — 201 | Implementado |
| GET | `/api/evaluations/attempts?student_id={id}` | — (requiere token; estudiantes solo consultan su propio historial, docentes/administradores pueden consultar cualquier estudiante) | `[EVALUATION_ATTEMPT...]` — 200 | Implementado |
| GET | `/healthz` | — | `"ok"` — 200 | Implementado |

**Dependencias salientes:** valida `ova_id` contra `content-service`.

---

### 5.6 Seguimiento y reportes — `tracking-service`
**Estado:** Pendiente. **Stack:** Node.js + TypeScript + Hono. **Puerto
propuesto:** `8086`.
**Responsabilidad:** progreso del estudiante por OVA y reportes agregados
para el docente.
**Entidad:** `PROGRESS` (ver sección 7.6).

| Caso de uso | RF relacionado |
|---|---|
| UC-13 Consultar progreso (docente) | RF-15 |
| UC-14 Exportar reporte de uso | RF-18 |

| Método | Ruta | Request | Response | Estado |
|---|---|---|---|---|
| GET | `/api/progress?student_id={id}` | — (requiere token) | `[PROGRESS...]` — 200 | Pendiente |
| PUT | `/api/progress` | `{student_id, ova_id, status, percent_complete}` | `PROGRESS` — 200 | Pendiente |
| GET | `/api/reports/usage?group_id={id}` | — (requiere token docente) | agregados de uso — 200 | Pendiente |
| GET | `/healthz` | — | `"ok"` — 200 | Pendiente |

Decisión: `PUT /api/progress` es llamado por el frontend cada vez que un
estudiante avanza o completa un OVA (no hay eventos asíncronos en la v1, ver
sección 2).

**Dependencias salientes:** ninguna directa; agrega datos que ya le llegan
por parámetro (no hace JOIN a otras bases de datos).

---

## 6. API Gateway

**Estado:** Pendiente. **Herramienta:** KrakenD (config declarativa, sin
código). **Puerto local propuesto:** `8080`.

Mapeo de rutas (el Gateway reescribe el prefijo hacia el servicio interno):

| Prefijo público | Servicio destino | Puerto interno |
|---|---|---|
| `/api/auth/*` | `identity-service` | `8081` |
| `/api/ovas/*` | `content-service` | `8082` |
| `/api/activities/*` | `activity-service` | `8083` |
| `/api/ai-activities/*`, `/api/ai-interactions/*` | `ai-service` | `8084` |
| `/api/evaluations/*` | `evaluation-service` | `8085` |
| `/api/progress/*`, `/api/reports/*` | `tracking-service` | `8086` |

El frontend en producción solo conoce la URL del Gateway (una sola variable
de entorno `VITE_API_BASE_URL`); nunca habla directo con un microservicio.
En local, mientras el Gateway no esté montado, el frontend puede seguir
apuntando directo a cada puerto (como hace hoy `demo-ova.zip`).

---

## 7. Esquema de datos

Tipos en formato Postgres (destino final); en local cada servicio Go usa
SQLite con tipos equivalentes (`TEXT` para `UUID`/`VARCHAR`, `TEXT` para
`TIMESTAMPTZ` en formato ISO 8601, `INTEGER` para `BOOLEAN`).

### 7.1 `identity-service` — Pendiente
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('estudiante','docente','administrador','validador')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.2 `content-service` — Pendiente
```sql
CREATE TABLE ovas (
  id                UUID PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  description       TEXT NOT NULL,
  learning_outcome  TEXT NOT NULL,
  status            VARCHAR(20) NOT NULL CHECK (status IN ('borrador','publicado')),
  created_by        UUID,                 -- referencia lógica a users.id (identity-service)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ova_versions (                -- pendiente
  id              UUID PRIMARY KEY,
  ova_id          UUID NOT NULL REFERENCES ovas(id),
  version_number  INTEGER NOT NULL,
  change_notes    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE content_blocks (
  id        UUID PRIMARY KEY,
  ova_id    UUID NOT NULL REFERENCES ovas(id),
  type      VARCHAR(20) NOT NULL CHECK (type IN ('texto','imagen','video')),
  position  INTEGER NOT NULL,
  content   TEXT NOT NULL
);

CREATE TABLE activities (                  -- nota: esta tabla vive físicamente en
  id           UUID PRIMARY KEY,           -- content-service hoy (Implementado), pero conceptualmente
  ova_id       UUID NOT NULL REFERENCES ovas(id), -- pertenece al dominio de activity-service (5.3).
  title        VARCHAR(255) NOT NULL,      -- Tarea Pendiente de arquitectura: decidir si se migra la
  description  TEXT NOT NULL,              -- tabla a activity-service o si content-service
  is_ai        BOOLEAN NOT NULL DEFAULT false -- sigue siendo su dueña. Ver nota al final de 7.2.
);
```


### 7.3 `activity-service` — pendiente
```sql
CREATE TABLE activities (
  id           UUID PRIMARY KEY,
  ova_id       UUID NOT NULL,              -- referencia lógica a content-service.ovas.id
  type         VARCHAR(20) NOT NULL CHECK (type IN ('quiz','caso_estudio','simulacion','colaborativa')),
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  config       JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE activity_attempts (
  id           UUID PRIMARY KEY,
  activity_id  UUID NOT NULL REFERENCES activities(id),
  student_id   UUID NOT NULL,              -- referencia lógica a identity-service.users.id
  answers      JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.4 `ai-service` — pendiente
```sql
CREATE TABLE ai_activities (
  id                UUID PRIMARY KEY,
  activity_id       UUID NOT NULL,          -- referencia lógica a activity-service.activities.id
  prompt_template   TEXT NOT NULL,
  provider          VARCHAR(50) NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_interactions (
  id               UUID PRIMARY KEY,
  ai_activity_id   UUID NOT NULL REFERENCES ai_activities(id),
  student_id       UUID NOT NULL,           -- referencia lógica a identity-service.users.id
  input            TEXT NOT NULL,
  ai_output        TEXT NOT NULL,
  validated        BOOLEAN NOT NULL DEFAULT false,
  validation_notes TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.5 `evaluation-service` — pendiente
```sql
CREATE TABLE evaluations (
  id       UUID PRIMARY KEY,
  ova_id   UUID NOT NULL,                  -- referencia lógica a content-service.ovas.id
  type     VARCHAR(20) NOT NULL CHECK (type IN ('autoevaluacion','transferencia')),
  config   JSONB NOT NULL                  -- preguntas y respuestas correctas para calificación automática
);

CREATE TABLE evaluation_attempts (
  id             UUID PRIMARY KEY,
  evaluation_id  UUID NOT NULL REFERENCES evaluations(id),
  student_id     UUID NOT NULL,             -- referencia lógica a identity-service.users.id
  score          NUMERIC(5,2) NOT NULL,
  feedback       TEXT,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

`evaluations.config` contiene `{ "questions": [{ "id": string,
"correct_answer": string|number|boolean|null, "feedback_correct?": string,
"feedback_incorrect?": string }] }`. Los IDs de pregunta son únicos. Cada
respuesta enviada en `answers` usa el ID de la pregunta como clave y una
respuesta primitiva como valor. El servicio calcula `score` como porcentaje de
respuestas correctas (0–100, con dos decimales); las respuestas omitidas
cuentan como incorrectas. El campo `feedback` resume el resultado y el
feedback configurado por pregunta. La configuración se carga en la base de
datos; la v1 no define un endpoint para crear evaluaciones.

### 7.6 `tracking-service` — pendiente
```sql
CREATE TABLE progress (
  id                UUID PRIMARY KEY,
  student_id        UUID NOT NULL,          -- referencia lógica a identity-service.users.id
  ova_id            UUID NOT NULL,          -- referencia lógica a content-service.ovas.id
  status            VARCHAR(20) NOT NULL CHECK (status IN ('no_iniciado','en_progreso','completado')),
  percent_complete  INTEGER NOT NULL DEFAULT 0,
  last_accessed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, ova_id)
);
```

---

## 8. Frontend

**Estado:** Pendiente 

Decisión de stack: **React 18 + TypeScript + Vite**. Estilos con **Tailwind
CSS**. Estado de servidor con **TanStack Query** (React Query); estado de
cliente mínimo con **Context API** (no se justifica Redux/Zustand para el
alcance de este proyecto). Enrutamiento con **React Router**.

### 8.1 Estructura de carpetas
```
frontend/
  index.html
  vite.config.ts
  tailwind.config.ts
  .env.example                # VITE_API_BASE_URL=http://localhost:8080
  src/
    main.tsx                   # entrypoint, monta <App/>, providers globales
    App.tsx                     # define <RouterProvider/>
    router.tsx                   # mapa de rutas (ver 8.3)

    api/                          # una carpeta por dominio, espejo de los microservicios
      client.ts                    # instancia fetch/axios base, lee VITE_API_BASE_URL, inyecta Authorization
      auth.ts                       # llamadas a /api/auth/*
      content.ts                     # llamadas a /api/ovas/*
      activities.ts                   # llamadas a /api/activities/*
      ai.ts                             # llamadas a /api/ai-activities/*
      evaluations.ts                    # llamadas a /api/evaluations/*
      tracking.ts                        # llamadas a /api/progress/*, /api/reports/*

    features/                     # un módulo por dominio, refleja los microservicios
      auth/
        LoginForm.tsx
        useAuth.ts                  # hook: login, logout, usuario actual (contexto)
      ova-catalog/
        OVAList.tsx
        OVACard.tsx
      ova-viewer/
        OVAViewer.tsx                # muestra bloques + actividades de un OVA
        ContentBlock.tsx
        ActivityCard.tsx
      ai-activity/
        AIActivityRunner.tsx         # ejecuta la actividad de IA y muestra el aviso de validación (RF-09)
      evaluation/
        EvaluationForm.tsx
      teacher-dashboard/
        ProgressTable.tsx            # UC-13, para el rol docente

    components/                   # UI compartida, sin lógica de negocio ni fetch
      Button.tsx
      Modal.tsx
      Layout.tsx

    context/
      AuthContext.tsx               # usuario actual + token, expuesto vía useAuth

    types/
      domain.ts                     # tipos TypeScript que reflejan las entidades de la sección 7

  package.json
  tsconfig.json
```

Regla: nada dentro de `components/` hace `fetch`; toda llamada a la red pasa
por `api/`. Nada dentro de `api/` importa JSX; solo hace `fetch`/parseo y
devuelve datos tipados.

### 8.2 Manejo de autenticación
- El token se guarda en `localStorage` bajo la clave `token` (igual que el
  demo actual).
- `api/client.ts` lee el token y agrega `Authorization: Bearer <token>` a
  toda petición saliente automáticamente.
- Rutas protegidas (`teacher-dashboard`, creación/edición de OVA) usan un
  componente `<ProtectedRoute role="docente">` que redirige a `/login` si no
  hay sesión o el rol no coincide.

### 8.3 Mapa de rutas
| Ruta | Página | Rol requerido |
|---|---|---|
| `/` | Catálogo de OVA (`OVAList`) | público |
| `/ovas/:id` | Visor de un OVA (`OVAViewer`) | público |
| `/login` | `LoginForm` | público |
| `/docente/progreso` | `ProgressTable` | `docente` |
| `/docente/ovas/nuevo` | formulario de creación de OVA | `docente`, `administrador` |

### 8.4 Convenciones
- Componentes en PascalCase, un componente por archivo, mismo nombre de
  archivo que el componente exportado.
- Hooks personalizados con prefijo `use` (`useAuth`, `useOVA`).
- Un archivo de tipos por dominio en `types/domain.ts`, generado a mano a
  partir de la sección 7 de este documento (evaluar en el futuro generarlos
  automáticamente desde un contrato OpenAPI).
- Line length de componentes: si un archivo supera ~200 líneas, dividirlo.

---

## 9. Convenciones de entrega (para decomposición en tareas)

- **Issues y Ramas:** A cada Issue en GitHub se le debe crear una rama dedicada (ej. `feat/<servicio>-<descripcion-corta>`). Esta rama generará luego un Pull Request hacia la rama `main` que deberá ser aprobado para cerrar el Issue.
- **Flujo de trabajo por Criterios de Aceptación (CA):** Las tareas se ejecutan Criterio de Aceptación por Criterio de Aceptación. Al solicitar "procedamos al Issue X", se debe implementar el primer CA y esperar aprobación manual antes de pasar al siguiente. Cada tarea o CA puede requerir uno o varios commits.
- **Pull Requests:** Una vez que todos los Criterios de Aceptación de un Issue estén terminados y aprobados, se debe generar automáticamente el Pull Request (usando `gh`) con un mensaje de commit claro que resuma los cambios.
- **Definition of Done por endpoint:** implementado + valida entrada + maneja
  errores según sección 3.3 + tiene al menos una prueba de integración +
  expone `/healthz` + variables de entorno documentadas en su propio
  `README.md` de servicio.
- Cada microservicio nuevo debe replicar exactamente la estructura de
  carpetas de su stack (sección 4) — no improvisar una organización distinta.

---

## 10. Glosario

| Término | Definición |
|---|---|
| OVA | Objeto Virtual de Aprendizaje |
| RF / RNF | Requisito Funcional / No Funcional (ver SRS, ISO/IEC/IEEE 29148) |
| CCB | Comité de Gestión de Cambios del proyecto (ver Plan de Gestión) |
| Gateway | Punto único de entrada HTTP hacia todos los microservicios |
| Puerto (arquitectura) | Interfaz que el dominio expone/requiere hacia el exterior |
| Adapter | Implementación concreta de un puerto |

---

## 11. Estado global de avance (resumen ejecutivo para priorizar tareas)

| Componente | Estado |
|---|---|
| identity-service | Implementado Funcional en local — falta: UUID real, `/me`, migrar a Postgres |
| content-service | Implementado Funcional en local — falta: auth en POST, PATCH, publish, versions, migrar `activities` a su propio servicio |
| activity-service | Pendiente No iniciado |
| ai-service | Pendiente No iniciado |
| evaluation-service | Pendiente No iniciado |
| tracking-service | Pendiente No iniciado |
| API Gateway | Pendiente No iniciado |
| Frontend (estructura objetivo) | Pendiente No iniciado (existe solo el HTML plano de la demo) |
