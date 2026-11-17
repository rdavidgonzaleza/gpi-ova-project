# Videos resumen con NotebookLM

Cada OVA puede abrir con un video corto narrado (el "Video Overview" de
NotebookLM). Los archivos de esta carpeta son las fuentes, generadas con
`pnpm notebooklm` desde `frontend/src/content` (vuelve a generarlas si cambias el
contenido).

## 1. Generar el video

1. Entra a <https://notebooklm.google.com> y crea un cuaderno por OVA.
2. Agrega como fuente el `.md` del OVA (por ejemplo `gestion-del-alcance.md`).
   Si quieres que el video use los diagramas, agrega también los PNG de
   `frontend/public/ovas` convertidos (ver abajo).
3. En **Studio → Video Overview → Personalizar**, idioma **Español** y la
   instrucción de `prompts-videos.md` para ese OVA (o una genérica como esta):

   > Resumen de 3 a 5 minutos para estudiantes de Ingeniería de Sistemas que van
   > a empezar este OVA. Usa el proyecto RutaCaribe como hilo conductor, explica
   > los conceptos con los diagramas y termina con una pregunta que los invite a
   > resolver las actividades. Tono cercano, sin tecnicismos innecesarios.

4. Descarga el MP4 (menú ⋮ del video → Descargar).

Para exportar los diagramas a PNG:

```sh
for f in frontend/public/ovas/*.svg; do rsvg-convert -w 1600 -b white "$f" -o "${f%.svg}.png"; done
```

## 2. Subirlo a Backblaze B2 y agregarlo al OVA

Con el entorno levantado (`scripts/dev.sh`) y las variables `S3_*` en
`deploy/local/.env` (ver `content-service/README.md`):

```sh
scripts/upload-media.sh <ova_id> ~/Descargas/alcance.mp4 "Video resumen: gestión del alcance" --position 0
```

`--position 0` agrega el bloque `video` al inicio del OVA (crea una versión
nueva con `PATCH /api/ovas/{id}`). Sin `--position` el script solo sube el
archivo e imprime `url|descripción` para pegarlo en el editor.

También se puede hacer desde la interfaz: **Docencia → Nuevo OVA → Agregar
video → Subir un video desde tu equipo**.

IDs de los OVA (`frontend/src/content/ids.ts`):

| OVA | ID |
|---|---|
| Inicio y planificación del proyecto | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05` |
| Gestión del alcance | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01` |
| Gestión del cronograma | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02` |
| Gestión de costos | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03` |
| Gestión de riesgos | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04` |
| Ejecución del proyecto | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06` |
| Monitoreo, control y gestión de cambios | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07` |
| Cierre del proyecto | `6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08` |
