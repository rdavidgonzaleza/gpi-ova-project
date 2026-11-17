# Monitoreo, control y gestión de cambios — OVA Hito

**Descripción:** Mide el desempeño con informes semáforo, gestiona solicitudes de cambio con el comité y mantiene las líneas base bajo control de configuración.

**Resultado de aprendizaje:** Clasifica solicitudes de cambio y las gestiona con el control integrado de cambios, sustentando el análisis de impacto ante el comité.

Curso de Gestión de Proyectos Informáticos, Universidad de Cartagena. Proyecto conductor: RutaCaribe, plataforma de venta de tiquetes de la Cooperativa de Transportes Brisas del Caribe.

## Contenido

## Medir para decidir

El **monitoreo y control** acompaña todo el proyecto: compara lo real con las líneas base y decide qué hacer con las diferencias.

Cada semana, RutaCaribe reporta su estado con indicadores y umbrales acordados en el plan:

> Diagrama: Informe de desempeño tipo semáforo: CPI y SPI con umbrales verde, amarillo y rojo, y la acción que corresponde a cada color

> Un informe "en verde" que oculta problemas es peor que no tener informe.

## El control integrado de cambios

En un proyecto de software los cambios **van a llegar**. El problema no es cambiar, sino cambiar sin analizar ni registrar.

> Diagrama: Flujo del control integrado de cambios: solicitud, registro, análisis de impacto, decisión del comité y, si se aprueba, actualización de líneas base, implementación y verificación

Ningún cambio a una **línea base** se implementa sin aprobación del **Comité de Control de Cambios (CCB)**. Lo que no está aprobado, no existe.

## Tipos de solicitud

No toda solicitud es un cambio de alcance. Clasificarla bien define **quién decide** y **qué se actualiza**:

> Diagrama: Cuatro tipos de solicitud: cambio de alcance, acción correctiva, acción preventiva y reparación de defecto, con su definición y un ejemplo

## Gestión de la configuración

Cada cambio aprobado genera una **nueva versión** de la línea base. La gestión de la configuración responde siempre: *¿cuál es la versión vigente y qué cambió desde la anterior?*

> Diagrama: Versiones de la línea base de RutaCaribe: cada solicitud aprobada crea una versión nueva con su registro

En software esto se apoya en herramientas: control de versiones (Git), etiquetas por entrega y un registro de cambios trazable a cada solicitud.

## Casos para aplicar

### Caso: Las encomiendas vuelven

Semana 12 de 16. El enunciado del alcance de RutaCaribe dice: *"No incluye venta de envío de encomiendas en esta versión"*.

En la junta, un socio propone: *"Ya que estamos, que la app venda también las encomiendas; la competencia lo tiene"*. La gerente le pide al equipo "verlo".

El equipo estima:
- **5 semanas** adicionales de desarrollo, 3 de ellas en la ruta crítica.
- **$65 millones** más; quedan $20 millones de reserva de contingencias.
- Un riesgo nuevo: el operador de mensajería no tiene API documentada.

El lanzamiento comprometido es el **1 de diciembre**, en temporada alta.

## Ideas clave

- Un desarrollador agrega un botón que pidió un taquillero, sin pasar por el comité. ¿Qué está mal? Todo cambio a una línea base pasa por el control integrado de cambios, aunque parezca pequeño.
- El SPI de la semana es 0,82 y el umbral rojo es menor que 0,85. ¿Qué corresponde? Un indicador en rojo exige analizar la causa y proponer acciones, no esconderlo.
- ¿Qué responde la gestión de la configuración? La configuración mantiene la trazabilidad de versiones de las líneas base y los productos.
