import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 7

export const AI_CAMBIOS = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  requestsReview: ids.ai(U, 3),
}

export const cambios: CourseUnit = {
  ovaId: OVA_IDS.cambios,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## Medir para decidir

El **monitoreo y control** acompaña todo el proyecto: compara lo real con las líneas base y decide qué hacer con las diferencias.

Cada semana, RutaCaribe reporta su estado con indicadores y umbrales acordados en el plan:

![Informe de desempeño tipo semáforo: CPI y SPI con umbrales verde, amarillo y rojo, y la acción que corresponde a cada color](/ovas/cambios-semaforo.svg)

> Un informe "en verde" que oculta problemas es peor que no tener informe.`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## El control integrado de cambios

En un proyecto de software los cambios **van a llegar**. El problema no es cambiar, sino cambiar sin analizar ni registrar.

![Flujo del control integrado de cambios: solicitud, registro, análisis de impacto, decisión del comité y, si se aprueba, actualización de líneas base, implementación y verificación](/ovas/cambios-flujo.svg)

Ningún cambio a una **línea base** se implementa sin aprobación del **Comité de Control de Cambios (CCB)**. Lo que no está aprobado, no existe.`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## Tipos de solicitud

No toda solicitud es un cambio de alcance. Clasificarla bien define **quién decide** y **qué se actualiza**:

![Cuatro tipos de solicitud: cambio de alcance, acción correctiva, acción preventiva y reparación de defecto, con su definición y un ejemplo](/ovas/cambios-tipos.svg)`,
    },
    {
      id: ids.block(U, 4),
      type: 'texto',
      position: 6,
      content: `## Gestión de la configuración

Cada cambio aprobado genera una **nueva versión** de la línea base. La gestión de la configuración responde siempre: *¿cuál es la versión vigente y qué cambió desde la anterior?*

![Versiones de la línea base de RutaCaribe: cada solicitud aprobada crea una versión nueva con su registro](/ovas/cambios-configuracion.svg)

En software esto se apoya en herramientas: control de versiones (Git), etiquetas por entrega y un registro de cambios trazable a cada solicitud.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas sobre monitoreo y control de cambios.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt: 'Un desarrollador agrega un botón que pidió un taquillero, sin pasar por el comité. ¿Qué está mal?',
            options: [
              { id: 'a', text: 'Nada, era un cambio pequeño' },
              { id: 'b', text: 'Se cambió la línea base sin análisis ni aprobación' },
              { id: 'c', text: 'Debió pedirlo el patrocinador' },
              { id: 'd', text: 'Los botones no son parte del alcance' },
            ],
            answer: 'b',
            explanation: 'Todo cambio a una línea base pasa por el control integrado de cambios, aunque parezca pequeño.',
          },
          {
            id: 'q2',
            prompt: 'El SPI de la semana es 0,82 y el umbral rojo es menor que 0,85. ¿Qué corresponde?',
            options: [
              { id: 'a', text: 'Esperar a la próxima semana' },
              { id: 'b', text: 'Cambiar el umbral' },
              { id: 'c', text: 'Analizar la causa y proponer una acción correctiva' },
              { id: 'd', text: 'Reportarlo en verde para no alarmar' },
            ],
            answer: 'c',
            explanation: 'Un indicador en rojo exige analizar la causa y proponer acciones, no esconderlo.',
          },
          {
            id: 'q3',
            prompt: '¿Qué responde la gestión de la configuración?',
            options: [
              { id: 'a', text: 'Quién trabaja horas extra' },
              { id: 'b', text: 'Cuál es la versión vigente y qué cambió' },
              { id: 'c', text: 'Cuánto cuesta cada paquete' },
              { id: 'd', text: 'Qué riesgos son prioritarios' },
            ],
            answer: 'b',
            explanation: 'La configuración mantiene la trazabilidad de versiones de las líneas base y los productos.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: 'La bandeja de solicitudes',
      description: 'Clasifica las solicitudes que llegaron a RutaCaribe esta semana.',
      config: {
        position: 5,
        kind: 'clasificacion',
        review_ai_activity_id: AI_CAMBIOS.requestsReview,
        instructions: 'Lee cada solicitud y decide qué tipo de solicitud de cambio es.',
        params: {
          categories: [
            { id: 'alcance', name: 'Cambio de alcance', hint: 'Agrega, quita o modifica lo que se entrega' },
            { id: 'correctiva', name: 'Acción correctiva', hint: 'Realinea el desempeño con el plan' },
            { id: 'preventiva', name: 'Acción preventiva', hint: 'Evita un desvío futuro' },
            { id: 'defecto', name: 'Reparación de defecto', hint: 'Corrige un producto que no cumple' },
          ],
          items: [
            { id: 'i1', text: 'La junta pide que la app también venda envío de encomiendas.', category: 'alcance', reason: 'Agrega una función que el enunciado excluyó: cambia el alcance.' },
            { id: 'i2', text: 'Agregar inglés a la app para turistas extranjeros.', category: 'alcance', reason: 'Es una característica nueva del producto.' },
            { id: 'i3', text: 'El SPI cayó a 0,80: se propone sumar un desarrollador a la app móvil.', category: 'correctiva', reason: 'Busca devolver el desempeño del cronograma al plan.' },
            { id: 'i4', text: 'El CPI es 0,86: se propone reemplazar horas extra por priorizar historias.', category: 'correctiva', reason: 'Corrige un desvío de costo ya medido.' },
            { id: 'i5', text: 'Antes de diciembre, hacer pruebas de carga para el pico de temporada.', category: 'preventiva', reason: 'Evita un problema que aún no ocurre.' },
            { id: 'i6', text: 'Capacitar a un segundo desarrollador en la app para no depender de uno solo.', category: 'preventiva', reason: 'Reduce la probabilidad de un desvío futuro.' },
            { id: 'i7', text: 'El tiquete QR sale con la fecha del viaje equivocada.', category: 'defecto', reason: 'El producto no cumple un requisito ya aprobado.' },
            { id: 'i8', text: 'El pago con tarjeta falla cuando el nombre tiene tilde.', category: 'defecto', reason: 'Es un error del producto frente a su especificación.' },
          ],
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: 'Las encomiendas vuelven',
      description: 'La junta quiere algo que el enunciado excluyó. Gestiona la solicitud de punta a punta.',
      config: {
        position: 7,
        review_ai_activity_id: AI_CAMBIOS.caseReview,
        variant_ai_activity_id: AI_CAMBIOS.caseVariant,
        scenario: `Semana 12 de 16. El enunciado del alcance de RutaCaribe dice: *"No incluye venta de envío de encomiendas en esta versión"*.

En la junta, un socio propone: *"Ya que estamos, que la app venda también las encomiendas; la competencia lo tiene"*. La gerente le pide al equipo "verlo".

El equipo estima:
- **5 semanas** adicionales de desarrollo, 3 de ellas en la ruta crítica.
- **$65 millones** más; quedan $20 millones de reserva de contingencias.
- Un riesgo nuevo: el operador de mensajería no tiene API documentada.

El lanzamiento comprometido es el **1 de diciembre**, en temporada alta.`,
        questions: [
          { id: 'p1', prompt: 'Describe cómo gestionarías esta solicitud paso a paso, desde que se registra hasta que se comunica la decisión.', placeholder: 'Primero…' },
          { id: 'p2', prompt: 'Presenta el análisis de impacto al Comité: alcance, cronograma, costo y riesgos.', placeholder: 'Alcance… Cronograma… Costo… Riesgos…' },
          { id: 'p3', prompt: '¿Qué recomendarías al Comité y qué alternativas le darías a la junta?', placeholder: 'Recomiendo…' },
        ],
        rubric: [
          { id: 'c1', name: 'Proceso formal', description: 'Sigue el control integrado de cambios: registro, análisis, decisión del CCB, actualización y comunicación.' },
          { id: 'c2', name: 'Análisis de impacto', description: 'Usa las cifras del caso para mostrar el efecto en la fecha, el presupuesto y los riesgos.' },
          { id: 'c3', name: 'Alternativas', description: 'Propone opciones viables (segunda versión, piloto, cambio de fecha) con sus consecuencias.' },
          { id: 'c4', name: 'Línea base y configuración', description: 'Explica qué documentos y versiones se actualizan si el cambio se aprueba.' },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Sesión del Comité de Control de Cambios',
      description: 'El comité debate tres solicitudes con presupuesto limitado. Aporta desde tu rol.',
      config: {
        position: 8,
        role: 'Representante de los usuarios en el comité',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt: 'Quedan $20 millones de reserva y cuatro semanas. El comité debe priorizar entre tres solicitudes: pago con Nequi, inglés en la app y pruebas de carga.',
        contributions: [
          { author: 'Carlos Herrera', role: 'Director financiero', text: 'Solo apruebo lo que cabe en la reserva. Las pruebas de carga cuestan $8 millones y evitan perder la temporada; eso va primero.' },
          { author: 'Valentina Orozco', role: 'Product owner', text: 'Nequi es lo que más piden los usuarios jóvenes. Si no está, muchos seguirán comprando en taquilla y el objetivo del 30 % no se cumple.' },
          { author: 'Sebastián Marrugo', role: 'Líder de la app móvil', text: 'Inglés parece fácil, pero toca todas las pantallas y las pruebas. Propongo dejarlo para la versión 2.' },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: control de cambios',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: '¿Quién aprueba o rechaza un cambio a la línea base?',
            options: [
              { id: 'a', text: 'El desarrollador que lo implementa' },
              { id: 'b', text: 'El Comité de Control de Cambios' },
              { id: 'c', text: 'El usuario que lo pidió' },
              { id: 'd', text: 'Nadie: se implementa si hay tiempo' },
            ],
          },
          {
            id: 'e2',
            prompt: 'Capacitar a otra persona para no depender de un solo experto es una…',
            options: [
              { id: 'a', text: 'Acción correctiva' },
              { id: 'b', text: 'Acción preventiva' },
              { id: 'c', text: 'Reparación de defecto' },
              { id: 'd', text: 'Cambio de alcance' },
            ],
          },
          {
            id: 'e3',
            prompt: '¿Qué paso va justo antes de la decisión del comité?',
            options: [
              { id: 'a', text: 'Implementar el cambio' },
              { id: 'b', text: 'Actualizar la línea base' },
              { id: 'c', text: 'Analizar el impacto' },
              { id: 'd', text: 'Verificar el cambio' },
            ],
          },
          {
            id: 'e4',
            prompt: 'Un cambio aprobado a la línea base de alcance produce…',
            options: [
              { id: 'a', text: 'Una nueva versión registrada de la línea base' },
              { id: 'b', text: 'Un nuevo proyecto' },
              { id: 'c', text: 'La cancelación del acta' },
              { id: 'd', text: 'Ningún registro, solo el cambio en el código' },
            ],
          },
          {
            id: 'e5',
            prompt: 'El tiquete QR no muestra la silla aunque es un requisito aprobado. Es…',
            options: [
              { id: 'a', text: 'Un cambio de alcance' },
              { id: 'b', text: 'Una acción preventiva' },
              { id: 'c', text: 'Una reparación de defecto' },
              { id: 'd', text: 'Un riesgo' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.cambios,
    type: 'autoevaluacion',
    config: {
      questions: [
        { id: 'e1', correct_answer: 'b', feedback_incorrect: 'El Comité de Control de Cambios (CCB) aprueba, rechaza o difiere los cambios a las líneas base.' },
        { id: 'e2', correct_answer: 'b', feedback_incorrect: 'Actuar antes de que ocurra el desvío es una acción preventiva.' },
        { id: 'e3', correct_answer: 'c', feedback_incorrect: 'El comité decide con base en el análisis de impacto en alcance, tiempo, costo, calidad y riesgos.' },
        { id: 'e4', correct_answer: 'a', feedback_incorrect: 'La gestión de la configuración registra una nueva versión de la línea base por cada cambio aprobado.' },
        { id: 'e5', correct_answer: 'c', feedback_incorrect: 'Si el producto no cumple un requisito ya aprobado, es una reparación de defecto.' },
      ],
    },
  },
}
