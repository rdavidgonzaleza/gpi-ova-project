# content-service

Catálogo, edición, versionado y publicación de OVA (spec 5.2). Go con
`net/http` de la librería estándar, Postgres con `lib/pq` y arquitectura
hexagonal (spec 4.1). Puerto por defecto: `8082`.

## Endpoints

| Método | Ruta | Auth | Respuesta |
|---|---|---|---|
| GET | `/api/ovas` | — | `[OVA]` 200 |
| GET | `/api/ovas/{id}` | — | `OVA` con `blocks` y `activities` 200 / 404 |
| POST | `/api/ovas` | docente/administrador | `OVA` 201 (estado `borrador`, versión 1) |
| PATCH | `/api/ovas/{id}` | docente/administrador | `OVA` 200; registra una versión nueva |
| POST | `/api/ovas/{id}/publish` | docente/administrador | `OVA` con `status: "publicado"` 200 |
| GET | `/api/ovas/{id}/versions` | — | `[OVA_VERSION]` 200, la más reciente primero |
| POST | `/api/ovas/{id}/media` | docente/administrador | `{upload_url, public_url, key, block_type, content_type, expires_at}` 201 |
| GET | `/healthz` | — | `ok` 200 |

Errores con el formato de la spec 3.3: `400 INVALID_BODY`,
`400 UNSUPPORTED_MEDIA_TYPE`, `401 UNAUTHORIZED`, `403 FORBIDDEN`,
`404 NOT_FOUND`, `503 STORAGE_NOT_CONFIGURED`.

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | sí (default de desarrollo) | `postgres://gpi:gpi@localhost:55432/content?sslmode=disable` |
| `PORT` | no | `8082` |
| `JWT_SECRET` | sí | Secreto HMAC compartido con identity-service |
| `S3_ENDPOINT` | para subir archivos | Endpoint S3 del bucket, ej. `https://s3.us-east-005.backblazeb2.com` |
| `S3_REGION` | para subir archivos | Región, ej. `us-east-005` (es el segmento del endpoint) |
| `S3_BUCKET` | para subir archivos | Nombre del bucket |
| `S3_ACCESS_KEY_ID` | para subir archivos | `keyID` de la Application Key de B2 |
| `S3_SECRET_ACCESS_KEY` | para subir archivos | `applicationKey` de B2 |
| `MEDIA_PUBLIC_BASE_URL` | no | URL pública de lectura. Por defecto `<S3_ENDPOINT>/<S3_BUCKET>` |

Sin las variables `S3_*` el servicio funciona igual; solo
`POST /api/ovas/{id}/media` responde `503`.

## Imágenes y videos en Backblaze B2

El servicio nunca recibe el archivo: entrega una URL firmada (SigV4, válida
15 minutos) y el navegador sube directo al bucket con
`PUT <upload_url>` y el encabezado `Content-Type` exacto que se pidió. Luego el
bloque `imagen` o `video` guarda `public_url|descripción`.

Configuración de B2 (plan gratuito: 10 GB):

1. Crear un bucket **público** (Buckets → Create a Bucket → Files in Bucket: Public).
2. Crear una Application Key con acceso de lectura y escritura a ese bucket.
   `keyID` → `S3_ACCESS_KEY_ID`, `applicationKey` → `S3_SECRET_ACCESS_KEY`.
3. El endpoint aparece en la ficha del bucket (`Endpoint: s3.us-east-005...`).
4. Permitir subidas desde el navegador con reglas CORS (requiere la CLI `b2`,
   la interfaz web no permite `PUT`):

```sh
b2 bucket update --cors-rules '[{
  "corsRuleName": "hito-uploads",
  "allowedOrigins": ["http://localhost:5173", "http://localhost:4173"],
  "allowedOperations": ["s3_put", "s3_get", "s3_head"],
  "allowedHeaders": ["content-type"],
  "exposeHeaders": ["etag"],
  "maxAgeSeconds": 3600
}]' <bucket> allPublic
```

Para subir archivos sin pasar por el editor (por ejemplo los videos generados
con NotebookLM) usa `scripts/upload-media.sh`.

## Desarrollo

```sh
go build ./... && go vet ./...
go run ./cmd/api
```

Aplica `migrations/001_create_ovas.sql` antes de arrancar (`scripts/dev.sh` lo
hace solo).

## Pruebas

Las pruebas de integración usan un Postgres real y se omiten si no existe
`TEST_DATABASE_URL`:

```sh
TEST_DATABASE_URL="postgres://gpi:gpi@localhost:55432/content_test?sslmode=disable" go test -p 1 ./...
```

La prueba de `adapters/storage` compara la firma con el ejemplo oficial de AWS
SigV4 y no necesita red.
