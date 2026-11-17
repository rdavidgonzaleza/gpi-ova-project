# Gestión del cronograma — OVA Hito

**Descripción:** Secuencia actividades, estima duraciones y encuentra la ruta crítica de un proyecto con el método CPM y diagramas de Gantt.

**Resultado de aprendizaje:** Calcula la ruta crítica y las holguras de una red de actividades y explica el impacto de un retraso en la fecha de entrega.

Curso de Gestión de Proyectos Informáticos, Universidad de Cartagena. Proyecto conductor: RutaCaribe, plataforma de venta de tiquetes de la Cooperativa de Transportes Brisas del Caribe.

## Contenido

## De la EDT al calendario

Ya sabemos *qué* construir. La gerencia pregunta: **¿cuándo estará lista la app?** Quieren lanzar antes de diciembre, cuando la demanda se triplica.

Gestionar el cronograma es convertir los paquetes de la EDT en un **calendario realista**.

> Un cronograma no es una promesa: es un modelo que muestra qué pasa cuando algo cambia.

## Los procesos del cronograma

> Diagrama: Los seis procesos de la gestión del cronograma y la salida de cada uno

La dependencia más común es **fin a inicio (FI)**: las pruebas integrales no empiezan hasta terminar web, app y pagos.

### ¿Cuánto dura cada actividad?

Se estima con juicio de expertos, estimación **análoga**, **paramétrica** o **por tres valores (PERT)**:

> Diagrama: Estimación por tres valores: optimista, más probable y pesimista con la fórmula PERT

## El método de la ruta crítica (CPM)

La **ruta crítica** es la secuencia más larga de actividades dependientes: marca la duración mínima del proyecto.

1. **Pasada hacia adelante:** `FT = IT + duración`.
2. **Pasada hacia atrás:** `ITa = FTa − duración`.
3. **Holgura** = `ITa − IT`. Holgura cero → actividad crítica.

> Diagrama: Notación de un nodo CPM y cómo un retraso mayor que la holgura mueve el final del proyecto

> Diagrama: Red de actividades de RutaCaribe: requisitos, arquitectura, tres frentes en paralelo (web, móvil y pagos), pruebas integrales, capacitación y puesta en producción.

## Comprimir el cronograma

Si la fecha no alcanza, se comprime **solo la ruta crítica**: acortar una actividad con holgura no adelanta el final.

> Diagrama: Intensificación frente a ejecución rápida: qué cambia y cuánto cuesta cada una

El **diagrama de Gantt** comunica el resultado: barras en el tiempo, ruta crítica resaltada e hitos.

## Casos para aplicar

### Caso: "Lo necesito para el 1 de diciembre"

El cronograma aprobado de RutaCaribe dura **16 semanas** y su ruta crítica es *Requisitos → Arquitectura → Aplicación móvil → Pruebas integrales → Puesta en producción*. La plataforma web tiene 1 semana de holgura y la integración de pagos, 2.

La gerente de la cooperativa escribe:

> *"Nos confirmaron que la temporada alta empieza el 1 de diciembre. Necesito RutaCaribe en producción **dos semanas antes** de lo planeado. Díganme qué necesitan."*

El equipo tiene estas opciones:
- Contratar un segundo desarrollador móvil por **$18 millones**; el líder técnico calcula que acortaría la app de 6 a 4 semanas.
- Empezar las pruebas integrales mientras se termina la app (ejecución rápida), con riesgo de retrabajo.
- Contratar un desarrollador web extra por **$12 millones** para acortar la plataforma web de 5 a 3 semanas.

## Ideas clave

- Las pruebas integrales de RutaCaribe no pueden empezar hasta que termine el desarrollo de la app. ¿Qué tipo de dependencia es? La sucesora (pruebas) empieza cuando la predecesora (desarrollo) termina: fin a inicio.
- Para el módulo de pagos el equipo estima 2 semanas en el mejor caso, 4 lo más probable y 12 en el peor. ¿Cuál es la estimación PERT? (2 + 4 × 4 + 12) / 6 = 30 / 6 = 5 semanas.
- ¿En qué proceso se obtiene la línea base del cronograma? Desarrollar el cronograma integra secuencia, duraciones y recursos, y produce la línea base.
