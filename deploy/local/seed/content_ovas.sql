-- Generado por frontend/seed-tools/export-seed.ts. No editar a mano.
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'Gestión del alcance', 'Define qué entra y qué no entra en un proyecto de software: requisitos, enunciado del alcance y la Estructura de Desglose del Trabajo (EDT).', 'Construye una EDT orientada a entregables a partir de un enunciado de alcance y controla los cambios mediante el proceso formal.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-01T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8110-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'texto', 1, '## Qué entra y qué no

Con el acta firmada, el equipo de **RutaCaribe** sabe *por qué* existe el proyecto. Ahora debe acordar **qué** se construye y **qué no**: compra de tiquetes, selección de silla y pago en línea… ¿y las encomiendas?

> Antes de programar, hay que acordar qué se entrega. Eso es gestionar el alcance.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8110-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'texto', 2, '## Alcance del producto y alcance del proyecto

El PMBOK separa **lo que se entrega** (producto) del **trabajo para entregarlo** (proyecto).

![Alcance del producto frente al alcance del proyecto en RutaCaribe](/ovas/alcance-producto-proyecto.svg)

### Los seis procesos

![Los seis procesos de la gestión del alcance, con la pregunta que responde y la salida de cada uno](/ovas/alcance-procesos.svg)

El **enunciado del alcance** fija entregables, criterios de aceptación, supuestos y **exclusiones**, que evitan discusiones meses después.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8110-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'texto', 4, '## La Estructura de Desglose del Trabajo (EDT)

La EDT descompone **todo** el trabajo en partes manejables. Es la base para estimar, asignar responsables y armar el cronograma.

![Las cuatro reglas de una buena EDT](/ovas/alcance-reglas-edt.svg)

EDT + **diccionario de la EDT** + enunciado del alcance aprobados = **línea base del alcance**.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8110-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'imagen', 5, '/ovas/alcance-edt.svg|EDT de RutaCaribe en tres niveles: gestión del proyecto, plataforma de venta, aplicación móvil, integración de pagos y puesta en producción.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8110-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'texto', 7, '## Controlar el alcance

Cambiar el alcance no es malo; hacerlo **sin control** sí lo es.

![Proceso de control de cambios en cuatro pasos, la triple restricción, la corrupción del alcance y el enchapado en oro](/ovas/alcance-control-cambios.svg)

Si el alcance crece, el tiempo o el costo deben ajustarse, o la calidad se resiente.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8210-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'Comprueba los conceptos', 'Tres preguntas rápidas sobre alcance del producto, del proyecto y el enunciado del alcance.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8210-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'Arma la EDT de RutaCaribe', 'Ubica cada elemento en la rama correcta de la EDT y aplica la regla del 100 %.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8210-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'La petición del gerente', 'Analiza una solicitud de cambio en plena construcción y recibe retroalimentación de la IA con una rúbrica.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8210-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'Sesión del Comité de Control de Cambios', 'Lee las posturas de tu equipo, aporta la tuya y obtén una síntesis de la decisión.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8210-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'Autoevaluación: gestión del alcance', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a01', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 1, 'Versión inicial', '2026-09-01T13:00:00Z');
END IF;
END $seed$;
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'Gestión del cronograma', 'Secuencia actividades, estima duraciones y encuentra la ruta crítica de un proyecto con el método CPM y diagramas de Gantt.', 'Calcula la ruta crítica y las holguras de una red de actividades y explica el impacto de un retraso en la fecha de entrega.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-02T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8120-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'texto', 1, '## De la EDT al calendario

Ya sabemos *qué* construir. La gerencia pregunta: **¿cuándo estará lista la app?** Quieren lanzar antes de diciembre, cuando la demanda se triplica.

Gestionar el cronograma es convertir los paquetes de la EDT en un **calendario realista**.

> Un cronograma no es una promesa: es un modelo que muestra qué pasa cuando algo cambia.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8120-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'texto', 2, '## Los procesos del cronograma

![Los seis procesos de la gestión del cronograma y la salida de cada uno](/ovas/cronograma-procesos.svg)

La dependencia más común es **fin a inicio (FI)**: las pruebas integrales no empiezan hasta terminar web, app y pagos.

### ¿Cuánto dura cada actividad?

Se estima con juicio de expertos, estimación **análoga**, **paramétrica** o **por tres valores (PERT)**:

![Estimación por tres valores: optimista, más probable y pesimista con la fórmula PERT](/ovas/cronograma-pert.svg)');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8120-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'texto', 4, '## El método de la ruta crítica (CPM)

La **ruta crítica** es la secuencia más larga de actividades dependientes: marca la duración mínima del proyecto.

1. **Pasada hacia adelante:** `FT = IT + duración`.
2. **Pasada hacia atrás:** `ITa = FTa − duración`.
3. **Holgura** = `ITa − IT`. Holgura cero → actividad crítica.

![Notación de un nodo CPM y cómo un retraso mayor que la holgura mueve el final del proyecto](/ovas/cronograma-holgura.svg)');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8120-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'imagen', 5, '/ovas/cronograma-red.svg|Red de actividades de RutaCaribe: requisitos, arquitectura, tres frentes en paralelo (web, móvil y pagos), pruebas integrales, capacitación y puesta en producción.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8120-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'texto', 7, '## Comprimir el cronograma

Si la fecha no alcanza, se comprime **solo la ruta crítica**: acortar una actividad con holgura no adelanta el final.

![Intensificación frente a ejecución rápida: qué cambia y cuánto cuesta cada una](/ovas/cronograma-compresion.svg)

El **diagrama de Gantt** comunica el resultado: barras en el tiempo, ruta crítica resaltada e hitos.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8220-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'Comprueba los conceptos', 'Tres preguntas sobre dependencias, estimación y procesos del cronograma.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8220-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'Encuentra la ruta crítica de RutaCaribe', 'Calcula la duración, la ruta crítica y las holguras, y prueba qué pasa cuando algo se retrasa.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8220-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', '"Lo necesito para el 1 de diciembre"', 'La gerencia pide adelantar el lanzamiento dos semanas. Decide cómo comprimir el cronograma.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8220-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'Reunión de seguimiento: la app va atrasada', 'La app móvil lleva una semana de retraso. Escucha al equipo y propone qué hacer.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8220-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 'Autoevaluación: gestión del cronograma', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a02', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02', 1, 'Versión inicial', '2026-09-02T13:00:00Z');
END IF;
END $seed$;
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'Gestión de costos', 'Estima, presupuesta y controla los costos de un proyecto con la técnica de Valor Ganado (EVM): PV, EV, AC, CPI, SPI y pronósticos.', 'Interpreta los indicadores de valor ganado de un proyecto en curso y pronostica su costo final (EAC) para tomar decisiones correctivas.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-03T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8130-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'texto', 1, '## ¿Cuánto cuesta RutaCaribe?

La junta aprobó **$480 millones**. La gerencia quiere saber cada mes si el dinero alcanza.

"Llevamos gastado el 47 %" no basta: es buena noticia si se hizo la mitad del trabajo y mala si se hizo un tercio.

> No se controla cuánto se gastó, sino **cuánto valor se ganó** con lo que se gastó.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8130-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'texto', 2, '## Estimar, presupuestar y controlar

![Los cuatro procesos de la gestión de los costos](/ovas/costos-procesos.svg)

### Del costo estimado al presupuesto

![Paquetes de trabajo más reserva para contingencias forman la línea base; con la reserva de gestión se llega al presupuesto total](/ovas/costos-presupuesto.svg)

La **reserva de gestión** cubre imprevistos no identificados y **no** forma parte de la línea base: usarla requiere aprobación. Repartida en el tiempo, la línea base forma la **curva S**: arranca lento, se acelera cuando todo el equipo trabaja en paralelo y se aplana al final.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8130-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'texto', 4, '## La gestión del valor ganado (EVM)

EVM mide tres datos en una **fecha de corte**. `EV = % completado × BAC`, donde **BAC** es el presupuesto de la línea base.

![Curva S con PV, EV y AC en la fecha de corte; CV es la distancia entre EV y AC y SV entre EV y PV](/ovas/costos-curva-s.svg)

![Fórmulas de CV, SV, CPI, SPI, EAC y VAC con su lectura](/ovas/costos-indicadores.svg)');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8130-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'texto', 7, '## De los números a las decisiones

Los indicadores abren la conversación; no la cierran.

![Los cuatro cuadrantes de CPI y SPI con su lectura, la regla del 20 % y por qué EV usa el presupuesto](/ovas/costos-cuadrantes.svg)

Si el EAC supera el presupuesto, el director propone acciones: reducir alcance, renegociar o usar reservas.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8230-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'Comprueba los conceptos', 'Tres preguntas sobre presupuesto, reservas y los datos del valor ganado.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8230-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'Informe de valor ganado de RutaCaribe', 'Calcula los indicadores en la semana 8, diagnostica el proyecto y explora qué pasaría con otros resultados.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8230-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'El comité financiero de la semana 8', 'Presenta el estado de costos a la junta y propone cómo cerrar la brecha.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8230-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'Qué recortar para cuidar el presupuesto', 'El equipo debe proponer recortes al alcance. Aporta tu criterio y obtén una síntesis.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8230-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 'Autoevaluación: gestión de costos', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a03', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03', 1, 'Versión inicial', '2026-09-03T13:00:00Z');
END IF;
END $seed$;
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'Gestión de riesgos', 'Identifica, analiza y planifica respuestas a los riesgos de un proyecto informático con la matriz de probabilidad e impacto.', 'Prioriza los riesgos de un proyecto con análisis cualitativo y propone respuestas adecuadas para amenazas y oportunidades.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-04T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8140-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'texto', 1, '## Lo que todavía no ha pasado

RutaCaribe ya tiene alcance, cronograma y presupuesto. Aun así, el proveedor de pagos puede cambiar su API o un desarrollador clave puede irse.

![Riesgo frente a problema: el riesgo es futuro e incierto y puede ser amenaza u oportunidad; el problema ya ocurrió](/ovas/riesgos-riesgo-problema.svg)

> Gestionar riesgos es decidir hoy, con calma, lo que mañana habría que decidir con prisa.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8140-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'texto', 2, '## Los procesos de la gestión de riesgos

![Los siete procesos de la gestión de riesgos](/ovas/riesgos-procesos.svg)

### Cómo escribir un riesgo

Un buen enunciado tiene **causa, riesgo y efecto**:

![Ejemplo de enunciado: causa, riesgo y efecto de la integración con PSE](/ovas/riesgos-enunciado.svg)');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8140-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'texto', 4, '## La matriz de probabilidad e impacto

Dos preguntas: **¿qué tan probable?** y **¿qué tanto afectaría?** La puntuación es `probabilidad × impacto`.

![Matriz 3 × 3 de probabilidad e impacto con las zonas de prioridad alta, media y baja](/ovas/riesgos-matriz.svg)

Probabilidad baja con impacto alto (servidores caídos el día del lanzamiento) **no se descarta**: es prioridad media y necesita plan.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8140-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'texto', 6, '## Estrategias de respuesta

![Estrategias para amenazas (evitar, transferir, mitigar, aceptar) y para oportunidades (explotar, compartir, mejorar, aceptar)](/ovas/riesgos-estrategias.svg)

Cada respuesta tiene un **responsable** y puede generar **riesgos secundarios**, que también se registran.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8240-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'Comprueba los conceptos', 'Tres preguntas sobre riesgos, problemas y cómo se escriben.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8240-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'Prioriza los riesgos de RutaCaribe', 'Ubica cada riesgo en la matriz de probabilidad e impacto y elige su respuesta.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8240-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'El riesgo que se volvió problema', 'Un riesgo identificado ocurrió en la semana 11. Analiza qué falló y qué hacer ahora.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8240-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'Taller de identificación de riesgos', 'El equipo identifica riesgos para el lanzamiento de diciembre. Aporta uno y obtén la síntesis.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8240-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 'Autoevaluación: gestión de riesgos', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a04', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04', 1, 'Versión inicial', '2026-09-04T13:00:00Z');
END IF;
END $seed$;
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'Inicio y planificación del proyecto', 'Recorre el ciclo de vida de un proyecto informático, redacta el acta de constitución, identifica a los interesados y arma el plan para la dirección.', 'Formula el acta de constitución con objetivos medibles y clasifica a los interesados según su poder e interés para planificar su gestión.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-08-31T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8150-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'texto', 1, '## El proyecto que nos acompaña

La **Cooperativa de Transportes Brisas del Caribe** vende tiquetes en taquilla y por WhatsApp. La gerencia quiere **RutaCaribe**: comprar tiquetes, elegir silla y pagar en línea.

Tú serás su director de proyecto. En ocho OVA recorrerás el **ciclo de vida completo**: lo inicias, lo planificas, lo ejecutas, controlas sus cambios y lo cierras.

![Ciclo de vida del proyecto: inicio, planificación, ejecución y cierre, con monitoreo y control durante todo el proyecto](/ovas/inicio-ciclo-vida.svg)

> Un proyecto es temporal y crea un resultado único. Por eso tiene un inicio formal y un cierre formal.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8150-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'texto', 2, '## El acta de constitución

El proyecto **existe** cuando el patrocinador firma el **acta de constitución**. Ese documento lo autoriza y le da al director la autoridad para usar recursos.

![Contenido del acta de constitución: propósito, objetivos medibles, requisitos de alto nivel, hitos y presupuesto resumido, riesgos iniciales y autoridad del director](/ovas/inicio-acta.svg)

Los objetivos deben ser **medibles**: "vender el 30 % de los tiquetes en línea a los seis meses", no "modernizar la venta".');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8150-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'texto', 4, '## Identificar a los interesados

Un **interesado** es cualquier persona u organización que afecta el proyecto o se ve afectada por él: la gerente, los taquilleros, los pasajeros, el proveedor de pagos, la Superintendencia de Transporte.

Se registran en el **registro de interesados** y se ubican según su **poder** sobre el proyecto y su **interés** en él:

![Matriz de poder e interés con las cuatro estrategias de gestión de interesados](/ovas/inicio-interesados.svg)

Un interesado olvidado al inicio suele aparecer al final… con un requisito nuevo.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8150-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'texto', 6, '## El plan para la dirección del proyecto

Planificar es decidir **cómo** se va a lograr lo que autorizó el acta. El resultado es el **plan para la dirección del proyecto**: integra las líneas base y los planes de cada área.

![El plan para la dirección integra las líneas base de alcance, cronograma y costos con los planes subsidiarios](/ovas/inicio-plan.svg)

La planificación es **gradual** (*elaboración progresiva*): se detalla lo cercano y se deja más general lo lejano. En los próximos OVA construirás cada línea base: alcance, cronograma, costos y riesgos.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8250-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'Comprueba los conceptos', 'Tres preguntas sobre el ciclo de vida y el acta de constitución.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8250-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'Mapa de interesados de RutaCaribe', 'Ubica a cada interesado en la matriz de poder e interés.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8250-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'El acta que nadie firmó', 'El equipo ya empezó a programar sin acta. Ayuda a ordenar el inicio del proyecto.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8250-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'Reunión de arranque (kickoff)', 'El equipo discute cómo planificar RutaCaribe. Aporta desde tu rol.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8250-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 'Autoevaluación: inicio y planificación', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a05', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a05', 1, 'Versión inicial', '2026-08-31T13:00:00Z');
END IF;
END $seed$;
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'Ejecución del proyecto', 'Dirige al equipo, asigna responsabilidades con la matriz RACI, planifica las comunicaciones y gestiona la calidad mientras se construye el producto.', 'Reconoce la etapa de desarrollo de un equipo y propone acciones de dirección, comunicación y calidad acordes con la situación del proyecto.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-05T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8160-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'texto', 1, '## Del plan al trabajo

RutaCaribe tiene plan aprobado. Empieza la fase que consume **la mayor parte del tiempo y del presupuesto**: la ejecución. Aquí el director deja de planificar y pasa a **dirigir personas, coordinar el trabajo y cuidar la calidad**.

![Los procesos de ejecución: dirigir el trabajo, gestionar el conocimiento, la calidad, el equipo, las comunicaciones y las respuestas a riesgos](/ovas/ejecucion-procesos.svg)

> Ejecutar no es "programar lo que dice el plan": es lograr que un equipo lo haga bien, a tiempo y sin quemarse.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8160-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'texto', 2, '## Dirigir el equipo

Todo equipo nuevo pasa por etapas. Reconocerlas ayuda al director a saber **qué necesita el equipo en cada momento**:

![Modelo de Tuckman: formación, conflicto, normalización, desempeño y disolución, con lo que necesita el equipo en cada etapa](/ovas/ejecucion-tuckman.svg)

Para que nadie dude de quién hace qué, se usa una **matriz RACI**: un solo responsable de aprobar (**A**) por entregable.

![Matriz RACI de RutaCaribe: responsable, aprueba, consultado e informado por entregable](/ovas/ejecucion-raci.svg)');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8160-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'texto', 4, '## Comunicar

Con 8 personas hay **28 canales** de comunicación posibles: `n(n − 1) / 2`. Por eso las comunicaciones se planifican: qué se informa, a quién, cada cuánto y por qué medio.

En RutaCaribe: reunión diaria de 15 minutos del equipo, informe semanal a la gerente y boletín mensual a los taquilleros.

> El problema de las comunicaciones es la ilusión de que ya ocurrieron.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8160-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'texto', 6, '## Gestionar la calidad

La calidad no se "agrega al final": se construye durante la ejecución.

![Gestionar la calidad frente a controlar la calidad: proceso y prevención frente a producto e inspección](/ovas/ejecucion-calidad.svg)

Prevenir es más barato que corregir: un defecto encontrado en producción cuesta muchas veces más que uno encontrado en una revisión de código.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8260-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'Comprueba los conceptos', 'Tres preguntas sobre el equipo y la matriz RACI.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8260-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', '¿En qué etapa está el equipo?', 'Clasifica situaciones reales del equipo de RutaCaribe en las etapas de Tuckman.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8260-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'El equipo que se quemó en la semana 9', 'El equipo trabaja horas extra y la calidad cae. Decide cómo dirigirlo.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8260-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'Plan de comunicaciones del lanzamiento', 'El equipo define cómo informar a cada interesado. Aporta desde tu rol.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8260-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 'Autoevaluación: ejecución', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a06', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a06', 1, 'Versión inicial', '2026-09-05T13:00:00Z');
END IF;
END $seed$;
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'Monitoreo, control y gestión de cambios', 'Mide el desempeño con informes semáforo, gestiona solicitudes de cambio con el comité y mantiene las líneas base bajo control de configuración.', 'Clasifica solicitudes de cambio y las gestiona con el control integrado de cambios, sustentando el análisis de impacto ante el comité.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-06T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8170-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'texto', 1, '## Medir para decidir

El **monitoreo y control** acompaña todo el proyecto: compara lo real con las líneas base y decide qué hacer con las diferencias.

Cada semana, RutaCaribe reporta su estado con indicadores y umbrales acordados en el plan:

![Informe de desempeño tipo semáforo: CPI y SPI con umbrales verde, amarillo y rojo, y la acción que corresponde a cada color](/ovas/cambios-semaforo.svg)

> Un informe "en verde" que oculta problemas es peor que no tener informe.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8170-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'texto', 2, '## El control integrado de cambios

En un proyecto de software los cambios **van a llegar**. El problema no es cambiar, sino cambiar sin analizar ni registrar.

![Flujo del control integrado de cambios: solicitud, registro, análisis de impacto, decisión del comité y, si se aprueba, actualización de líneas base, implementación y verificación](/ovas/cambios-flujo.svg)

Ningún cambio a una **línea base** se implementa sin aprobación del **Comité de Control de Cambios (CCB)**. Lo que no está aprobado, no existe.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8170-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'texto', 4, '## Tipos de solicitud

No toda solicitud es un cambio de alcance. Clasificarla bien define **quién decide** y **qué se actualiza**:

![Cuatro tipos de solicitud: cambio de alcance, acción correctiva, acción preventiva y reparación de defecto, con su definición y un ejemplo](/ovas/cambios-tipos.svg)');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8170-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'texto', 6, '## Gestión de la configuración

Cada cambio aprobado genera una **nueva versión** de la línea base. La gestión de la configuración responde siempre: *¿cuál es la versión vigente y qué cambió desde la anterior?*

![Versiones de la línea base de RutaCaribe: cada solicitud aprobada crea una versión nueva con su registro](/ovas/cambios-configuracion.svg)

En software esto se apoya en herramientas: control de versiones (Git), etiquetas por entrega y un registro de cambios trazable a cada solicitud.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8270-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'Comprueba los conceptos', 'Tres preguntas sobre monitoreo y control de cambios.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8270-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'La bandeja de solicitudes', 'Clasifica las solicitudes que llegaron a RutaCaribe esta semana.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8270-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'Las encomiendas vuelven', 'La junta quiere algo que el enunciado excluyó. Gestiona la solicitud de punta a punta.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8270-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'Sesión del Comité de Control de Cambios', 'El comité debate tres solicitudes con presupuesto limitado. Aporta desde tu rol.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8270-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 'Autoevaluación: control de cambios', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a07', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a07', 1, 'Versión inicial', '2026-09-06T13:00:00Z');
END IF;
END $seed$;
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'Cierre del proyecto', 'Obtén la aceptación formal, transfiere el producto, cierra contratos, registra lecciones aprendidas y evalúa el éxito del proyecto.', 'Ejecuta el cierre ordenado de un proyecto y redacta lecciones aprendidas accionables que otros proyectos puedan reutilizar.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-07T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8180-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'texto', 1, '## Terminar también se gestiona

RutaCaribe salió en vivo el 1 de diciembre. El equipo celebra… y empieza a dispersarse. Pero el proyecto **todavía no termina**: falta cerrarlo formalmente.

Un proyecto mal cerrado deja contratos abiertos, documentación perdida, un equipo de soporte que no sabe qué recibió y las mismas lecciones por aprender en el siguiente proyecto.

![Qué se cierra: el proyecto o la fase y los contratos con proveedores](/ovas/cierre-tipos.svg)');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8180-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'texto', 2, '## Aceptación y transferencia

El cierre empieza cuando el patrocinador **acepta formalmente** los entregables, contra los criterios de aceptación del enunciado del alcance.

Luego el producto se **transfiere** a quien lo va a operar: en RutaCaribe, el área de sistemas de la cooperativa recibe el código, los accesos, los manuales y un periodo de acompañamiento.

> Sin aceptación firmada, el proyecto puede seguir "abierto" para siempre con pedidos de último minuto.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8180-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'texto', 4, '## Lecciones aprendidas

Las lecciones aprendidas son el conocimiento que **otros proyectos** pueden reutilizar. Una buena lección no es una queja: tiene causa y una recomendación accionable.

![Formato de una lección aprendida: situación, impacto, causa y recomendación, con un ejemplo de RutaCaribe](/ovas/cierre-lecciones.svg)

Se registran durante todo el proyecto y se consolidan en el cierre, en el **repositorio de la organización**.');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8180-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'texto', 6, '## ¿Fue un éxito?

El informe final compara lo logrado con lo que prometió el acta:

![Criterios de éxito del proyecto: alcance aceptado, plazo, costo, calidad, satisfacción de interesados y beneficio esperado](/ovas/cierre-exito.svg)

Algunos beneficios, como el 30 % de ventas en línea, solo se miden **meses después**: el informe deja definido quién y cuándo lo hará. Con esto termina el ciclo de vida que empezó con el acta.');
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8280-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'Comprueba los conceptos', 'Tres preguntas sobre aceptación, transferencia y cierre de contratos.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8280-000000000002', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'Ordena el cierre de RutaCaribe', 'Pon en orden los pasos para cerrar el proyecto.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8280-000000000003', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'El proyecto que no quería terminar', 'Dos meses después del lanzamiento, el proyecto sigue abierto. Ciérralo.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8280-000000000004', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'Retrospectiva final del proyecto', 'El equipo hace su última retrospectiva. Aporta una lección desde tu rol.', true);
INSERT INTO activities (id, ova_id, title, description, is_ai) VALUES ('c0a7e17d-0000-4000-8280-000000000005', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 'Autoevaluación: cierre', 'Cinco preguntas calificadas. Tu resultado queda en tu historial.', true);
INSERT INTO ova_versions (id, ova_id, version_number, change_notes, created_at) VALUES ('7a2d3b4f-1b7d-4c55-9a0e-2d4b8e7f1a08', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a08', 1, 'Versión inicial', '2026-09-07T13:00:00Z');
END IF;
END $seed$;
