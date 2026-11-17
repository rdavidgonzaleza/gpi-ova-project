import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 4

export const AI_RIESGOS = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  matrixReview: ids.ai(U, 3),
}

export const riesgos: CourseUnit = {
  ovaId: OVA_IDS.riesgos,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## Lo que todavía no ha pasado

RutaCaribe ya tiene alcance, cronograma y presupuesto. Aun así, el proveedor de pagos puede cambiar su API o un desarrollador clave puede irse.

![Riesgo frente a problema: el riesgo es futuro e incierto y puede ser amenaza u oportunidad; el problema ya ocurrió](/ovas/riesgos-riesgo-problema.svg)

> Gestionar riesgos es decidir hoy, con calma, lo que mañana habría que decidir con prisa.`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## Los procesos de la gestión de riesgos

![Los siete procesos de la gestión de riesgos](/ovas/riesgos-procesos.svg)

### Cómo escribir un riesgo

Un buen enunciado tiene **causa, riesgo y efecto**:

![Ejemplo de enunciado: causa, riesgo y efecto de la integración con PSE](/ovas/riesgos-enunciado.svg)`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## La matriz de probabilidad e impacto

Dos preguntas: **¿qué tan probable?** y **¿qué tanto afectaría?** La puntuación es \`probabilidad × impacto\`.

![Matriz 3 × 3 de probabilidad e impacto con las zonas de prioridad alta, media y baja](/ovas/riesgos-matriz.svg)

Probabilidad baja con impacto alto (servidores caídos el día del lanzamiento) **no se descarta**: es prioridad media y necesita plan.`,
    },
    {
      id: ids.block(U, 4),
      type: 'texto',
      position: 6,
      content: `## Estrategias de respuesta

![Estrategias para amenazas (evitar, transferir, mitigar, aceptar) y para oportunidades (explotar, compartir, mejorar, aceptar)](/ovas/riesgos-estrategias.svg)

Cada respuesta tiene un **responsable** y puede generar **riesgos secundarios**, que también se registran.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas sobre riesgos, problemas y cómo se escriben.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt: '¿Cuál de estas situaciones es un **riesgo** y no un problema?',
            options: [
              { id: 'a', text: 'El servidor de pruebas se cayó esta mañana' },
              { id: 'b', text: 'El desarrollador móvil renunció ayer' },
              { id: 'c', text: 'El proveedor de PSE podría cambiar su API antes del lanzamiento' },
              { id: 'd', text: 'La factura del hosting llegó más alta de lo presupuestado' },
            ],
            answer: 'c',
            explanation: 'Un riesgo es incierto y futuro. Las demás situaciones ya ocurrieron: son problemas.',
          },
          {
            id: 'q2',
            prompt: 'Una agencia de turismo quiere vender tiquetes de RutaCaribe en sus paquetes. Para el proyecto esto es…',
            options: [
              { id: 'a', text: 'Una amenaza, porque agrega trabajo' },
              { id: 'b', text: 'Una oportunidad' },
              { id: 'c', text: 'Un problema' },
              { id: 'd', text: 'Una restricción' },
            ],
            answer: 'b',
            explanation: 'Es un evento incierto con efecto positivo sobre los objetivos: una oportunidad.',
          },
          {
            id: 'q3',
            prompt: '¿Qué tiene un enunciado de riesgo bien escrito?',
            options: [
              { id: 'a', text: 'Solo el nombre del riesgo' },
              { id: 'b', text: 'Causa, riesgo y efecto' },
              { id: 'c', text: 'La fecha en que va a ocurrir' },
              { id: 'd', text: 'El costo exacto del riesgo' },
            ],
            answer: 'b',
            explanation: 'Causa, riesgo y efecto permiten entender por qué podría ocurrir y qué objetivo afecta.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: 'Prioriza los riesgos de RutaCaribe',
      description: 'Ubica cada riesgo en la matriz de probabilidad e impacto y elige su respuesta.',
      config: {
        position: 5,
        kind: 'riesgos',
        review_ai_activity_id: AI_RIESGOS.matrixReview,
        instructions:
          'Para cada riesgo del registro, elige su probabilidad, su impacto y la estrategia de respuesta. La matriz se actualiza a medida que avanzas.',
        params: {
          risks: [
            {
              id: 'r1',
              text: 'El proveedor de PSE cambia su API durante el desarrollo y la integración debe rehacerse.',
              type: 'amenaza',
              probability: 2,
              impact: 3,
              responses: ['mitigar'],
              reason: 'Es probable y afecta la ruta crítica. Se mitiga con una capa de integración aislada y pruebas en el ambiente de pruebas del proveedor.',
            },
            {
              id: 'r2',
              text: 'El único desarrollador que conoce la app móvil renuncia antes del lanzamiento.',
              type: 'amenaza',
              probability: 2,
              impact: 3,
              responses: ['mitigar'],
              reason: 'Se mitiga reduciendo la dependencia de una persona: documentación, revisiones de código y programación en pareja.',
            },
            {
              id: 'r3',
              text: 'Los servidores se caen el día del lanzamiento, en plena temporada alta.',
              type: 'amenaza',
              probability: 1,
              impact: 3,
              responses: ['transferir', 'mitigar'],
              reason: 'Probabilidad baja e impacto alto: prioridad media. Se transfiere con un hosting con acuerdo de nivel de servicio o se mitiga con pruebas de carga.',
            },
            {
              id: 'r4',
              text: 'Los taquilleros se resisten a usar el nuevo sistema y siguen vendiendo por WhatsApp.',
              type: 'amenaza',
              probability: 3,
              impact: 2,
              responses: ['mitigar'],
              reason: 'Es muy probable en un cambio de proceso. Se mitiga con capacitación temprana y taquilleros líderes que acompañen a sus compañeros.',
            },
            {
              id: 'r5',
              text: 'La librería del mapa de sillas lleva dos años sin mantenimiento y podría fallar en nuevos navegadores.',
              type: 'amenaza',
              probability: 2,
              impact: 2,
              responses: ['evitar'],
              reason: 'Se puede eliminar la amenaza cambiando de librería ahora, cuando todavía es barato.',
            },
            {
              id: 'r6',
              text: 'El nuevo logo de la cooperativa llega una semana tarde y hay que cambiar algunos íconos.',
              type: 'amenaza',
              probability: 2,
              impact: 1,
              responses: ['aceptar'],
              reason: 'Impacto bajo: no vale la pena invertir en una respuesta. Se acepta y se ajusta si ocurre.',
            },
            {
              id: 'r7',
              text: 'Una agencia de turismo ofrece vender tiquetes de RutaCaribe en sus paquetes de diciembre.',
              type: 'oportunidad',
              probability: 2,
              impact: 3,
              responses: ['compartir', 'explotar'],
              reason: 'Oportunidad de alto impacto. Se comparte con una alianza con la agencia o se explota asegurando la integración antes de diciembre.',
            },
          ],
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: 'El riesgo que se volvió problema',
      description: 'Un riesgo identificado ocurrió en la semana 11. Analiza qué falló y qué hacer ahora.',
      config: {
        position: 7,
        review_ai_activity_id: AI_RIESGOS.caseReview,
        variant_ai_activity_id: AI_RIESGOS.caseVariant,
        scenario: `En la semana 3, el equipo de RutaCaribe registró este riesgo con **probabilidad media e impacto alto**:

> *Debido a que solo Santiago conoce el código de la app móvil, puede que su ausencia detenga el desarrollo, lo que retrasaría el lanzamiento.*

La respuesta planeada fue **mitigar**: documentar el código y hacer revisiones semanales en pareja. El responsable era el líder técnico. Por la presión del cronograma, las revisiones se cancelaron desde la semana 6 y la documentación quedó a medias.

En la semana 11, Santiago recibe una oferta en Bogotá y anuncia que se va **en dos semanas**. Quedan 5 semanas para el lanzamiento y la app está en la ruta crítica.`,
        questions: [
          {
            id: 'p1',
            prompt: '¿Qué falló en la gestión de este riesgo? Distingue entre la identificación, la respuesta y el monitoreo.',
            placeholder: 'La identificación fue… La respuesta… El monitoreo…',
          },
          {
            id: 'p2',
            prompt: 'Ahora que es un problema, ¿qué harías en las dos semanas que Santiago sigue en el equipo?',
            placeholder: 'En estas dos semanas…',
          },
          {
            id: 'p3',
            prompt: '¿Qué riesgos nuevos o secundarios aparecen y cómo los registrarías?',
            placeholder: 'Debido a que… puede que… lo que…',
          },
        ],
        rubric: [
          {
            id: 'c1',
            name: 'Diagnóstico del proceso',
            description: 'Reconoce que el riesgo estaba bien identificado y que fallaron la implementación y el monitoreo de la respuesta.',
          },
          {
            id: 'c2',
            name: 'Gestión del problema',
            description: 'Propone acciones concretas para las dos semanas (transferencia de conocimiento, priorizar documentación, reemplazo).',
          },
          {
            id: 'c3',
            name: 'Riesgos secundarios',
            description: 'Identifica riesgos nuevos (curva de aprendizaje del reemplazo, retraso del lanzamiento) con formato causa, riesgo y efecto.',
          },
          {
            id: 'c4',
            name: 'Impacto en el proyecto',
            description: 'Relaciona el problema con la ruta crítica, el cronograma y el uso de reservas.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Taller de identificación de riesgos',
      description: 'El equipo identifica riesgos para el lanzamiento de diciembre. Aporta uno y obtén la síntesis.',
      config: {
        position: 8,
        role: 'Responsable de seguridad de la información',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt:
          'Faltan cuatro semanas para lanzar RutaCaribe en plena temporada alta. El equipo hace un taller para identificar los riesgos del lanzamiento y priorizar las respuestas.',
        contributions: [
          {
            author: 'Daniela Acosta',
            role: 'Administradora de infraestructura',
            text: 'En diciembre esperamos 5 veces el tráfico normal. No hemos hecho pruebas de carga. Propongo hacerlas ya y contratar capacidad elástica en la nube, aunque suba el costo mensual.',
          },
          {
            author: 'Andrés Castillo',
            role: 'Analista de calidad',
            text: 'Me preocupa más el pago duplicado: si PSE responde lento, el usuario vuelve a pagar. Ya pasó una vez en pruebas. Eso es dinero de clientes y la reputación de la cooperativa.',
          },
          {
            author: 'Valentina Orozco',
            role: 'Product owner',
            text: 'Hay una oportunidad: la Alcaldía quiere promover la compra en línea en temporada. Si lanzamos a tiempo, podríamos salir en su campaña sin costo.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: gestión de riesgos',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: 'En una escala de 1 a 3, un riesgo de probabilidad 2 e impacto 3 tiene prioridad…',
            options: [
              { id: 'a', text: 'Baja' },
              { id: 'b', text: 'Media' },
              { id: 'c', text: 'Alta' },
              { id: 'd', text: 'No se puede calcular' },
            ],
          },
          {
            id: 'e2',
            prompt: 'Contratar un seguro o un hosting con penalidades por caídas es una respuesta de…',
            options: [
              { id: 'a', text: 'Evitar' },
              { id: 'b', text: 'Transferir' },
              { id: 'c', text: 'Mitigar' },
              { id: 'd', text: 'Aceptar' },
            ],
          },
          {
            id: 'e3',
            prompt: 'Cambiar de librería para eliminar por completo la posibilidad de que la antigua falle es…',
            options: [
              { id: 'a', text: 'Evitar' },
              { id: 'b', text: 'Mejorar' },
              { id: 'c', text: 'Escalar' },
              { id: 'd', text: 'Aceptar pasivamente' },
            ],
          },
          {
            id: 'e4',
            prompt: '¿Qué estrategia corresponde a una **oportunidad**?',
            options: [
              { id: 'a', text: 'Mitigar' },
              { id: 'b', text: 'Transferir' },
              { id: 'c', text: 'Compartir' },
              { id: 'd', text: 'Evitar' },
            ],
          },
          {
            id: 'e5',
            prompt: 'Un riesgo identificado acaba de ocurrir. A partir de ahora se gestiona como…',
            options: [
              { id: 'a', text: 'Un riesgo residual' },
              { id: 'b', text: 'Un problema (issue)' },
              { id: 'c', text: 'Una oportunidad' },
              { id: 'd', text: 'Una restricción del proyecto' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.riesgos,
    type: 'autoevaluacion',
    config: {
      questions: [
        {
          id: 'e1',
          correct_answer: 'c',
          feedback_incorrect: 'Probabilidad × impacto = 2 × 3 = 6, que está en la zona de prioridad alta (6 a 9).',
        },
        {
          id: 'e2',
          correct_answer: 'b',
          feedback_incorrect: 'Trasladar el impacto a un tercero mediante un contrato o seguro es transferir.',
        },
        {
          id: 'e3',
          correct_answer: 'a',
          feedback_incorrect: 'Cambiar el plan para eliminar la amenaza es evitar.',
        },
        {
          id: 'e4',
          correct_answer: 'c',
          feedback_incorrect: 'Compartir, explotar y mejorar son estrategias para oportunidades.',
        },
        {
          id: 'e5',
          correct_answer: 'b',
          feedback_incorrect: 'Cuando un riesgo ocurre deja de ser incierto: se convierte en un problema.',
        },
      ],
    },
  },
}
