# Frontend — Hito

SPA de los OVA de Gestión de Proyectos Informáticos (spec, sección 8).
React 19 + TypeScript + Vite, Tailwind CSS 4, TanStack Query y React Router.

## Arranque

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:5173
pnpm build          # typecheck + build de producción
```

## Origen de datos por microservicio

Cada módulo de `src/api/` expone el contrato de su microservicio (spec, sección 5)
y tiene dos adaptadores:

| Valor | Comportamiento |
|---|---|
| `remote` | Llama al servicio real por `/api/...`. |
| `local` | Adaptador en el navegador (`src/api/local/`) con el mismo contrato, las mismas reglas de autorización y los mismos códigos de error. Persiste en `localStorage`. |

Se elige con `VITE_SOURCE_<SERVICIO>` en `.env.local` (`IDENTITY`, `CONTENT`,
`ACTIVITY`, `EVALUATION`, `TRACKING`). El servicio de IA siempre es `remote`.

Por defecto todos los servicios son `remote` y pasan por el API Gateway
KrakenD (`VITE_API_BASE_URL=http://localhost:8080`); el entorno completo se
levanta con `scripts/dev.sh` desde la raíz. Sin `VITE_API_BASE_URL`, el servidor de Vite hace de gateway: enruta cada prefijo
`/api/*` al puerto de su servicio (`SERVICE_*_URL`, ver `vite.config.ts`).

## Cuentas iniciales (adaptador local de identidad)

Contraseña de todas: `Gpi2026*`

| Rol | Correo |
|---|---|
| Estudiante | laura.martinez@unicartagena.edu.co |
| Docente | docente.gpi@unicartagena.edu.co |
| Administrador | admin.ova@unicartagena.edu.co |
| Validador | validacion.ova@unicartagena.edu.co |

Los IDs de usuarios y OVA son fijos (`src/api/local/seed.ts`) para poder cargar
los mismos registros en las bases de datos de los servicios.

## Diseño

Basado en las Human Interface Guidelines de Apple:

- Colores por rol, con variantes claro, oscuro y alto contraste (`src/index.css`).
- Material translúcido solo en la capa funcional (barra superior, menús).
- Controles táctiles de 44 px.
- Respeta `prefers-reduced-motion` y `prefers-reduced-transparency`.
- Un color, un significado: azul para interacción y progreso, violeta solo para
  contenido generado por IA.

## Diagramas, videos y fuentes para NotebookLM

- `pnpm diagrams` regenera los SVG de `public/ovas` desde `seed-tools/diagrams/`.
  Usan clases `.dg-*` (ver `src/index.css`) para seguir el tema claro/oscuro.
- Un bloque de texto puede incluir un diagrama con una línea
  `![descripción](/ovas/archivo.svg)`.
- Los bloques de video aceptan YouTube o MP4/WebM (por ejemplo, subidos a
  Backblaze B2 desde el editor de OVA o con `scripts/upload-media.sh`).
- `pnpm notebooklm` escribe en `docs/notebooklm/` una fuente por OVA para generar
  el video resumen (ver `docs/notebooklm/README.md`).
- `pnpm seed:export` escribe las semillas de todos los servicios en
  `deploy/local/seed/` y `ai-service/seed/`.
