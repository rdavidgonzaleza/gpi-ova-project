-- Generado por frontend/seed-tools/export-seed.ts. No editar a mano.
DO $seed$ BEGIN
IF NOT EXISTS (SELECT 1 FROM ovas WHERE id = '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01') THEN
INSERT INTO ovas (id, title, description, learning_outcome, status, created_by, created_at) VALUES ('6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'Gestión del alcance', 'Define qué entra y qué no entra en un proyecto de software: requisitos, enunciado del alcance y la Estructura de Desglose del Trabajo (EDT).', 'Construye una EDT orientada a entregables a partir de un enunciado de alcance y controla los cambios mediante el proceso formal.', 'publicado', '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10', '2026-09-01T13:00:00Z');
INSERT INTO content_blocks (id, ova_id, type, position, content) VALUES ('c0a7e17d-0000-4000-8110-000000000001', '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01', 'texto', 1, '## El proyecto que nos acompaña

La **Cooperativa Brisas del Caribe** vende tiquetes en taquilla y por WhatsApp. Tu equipo construirá **RutaCaribe**: comprar tiquetes, elegir silla y pagar en línea.

En los cuatro OVA gestionarás este proyecto: **alcance → cronograma → costos → riesgos**.

> Antes de programar, hay que acordar **qué** se construye y **qué no**. Eso es gestionar el alcance.');
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
