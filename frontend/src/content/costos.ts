import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 3

export const AI_COSTOS = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  evmReview: ids.ai(U, 3),
}

export const costos: CourseUnit = {
  ovaId: OVA_IDS.costos,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## ¿Cuánto cuesta RutaCaribe?

La junta de Brisas del Caribe aprobó un presupuesto de **$480 millones** para RutaCaribe. Es la primera vez que la cooperativa invierte tanto en tecnología, y la gerencia financiera quiere saber cada mes si el dinero alcanza.

"Llevamos gastado el 47 %" no responde esa pregunta. Haber gastado la mitad del dinero es buena noticia si se hizo la mitad del trabajo, y mala si solo se hizo un tercio. Por eso la gestión de costos compara siempre **lo gastado** con **lo logrado**.

> Un proyecto no se controla mirando cuánto se ha gastado, sino cuánto valor se ha ganado con lo que se gastó.`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## Estimar, presupuestar y controlar

| Proceso | Qué produce |
|---|---|
| Planificar la gestión de los costos | Reglas de estimación, unidades, umbrales de control |
| Estimar los costos | Costo de cada paquete de trabajo |
| Determinar el presupuesto | Línea base de costos (curva S) |
| Controlar los costos | Indicadores de desempeño y pronósticos |

### Del costo estimado al presupuesto

Los costos de los paquetes de trabajo se suman hacia arriba en la EDT. A esa suma se agrega la **reserva para contingencias**, para riesgos identificados, y se obtiene la **línea base de costos**. Si además se suma la **reserva de gestión**, para imprevistos no identificados, se obtiene el **presupuesto total**. La reserva de gestión no forma parte de la línea base: usarla requiere una aprobación.

Al repartir la línea base en el tiempo resulta la **curva S**: el gasto acumulado empieza lento, se acelera cuando todo el equipo trabaja en paralelo y se aplana al final.`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## La gestión del valor ganado (EVM)

EVM combina alcance, tiempo y costo con tres datos medidos en una fecha de corte:

- **PV, valor planificado**: cuánto trabajo, en dinero, *debía* estar hecho según la línea base.
- **EV, valor ganado**: cuánto trabajo, en dinero del presupuesto, *está* realmente hecho. \`EV = % completado × BAC\`
- **AC, costo real**: cuánto se *gastó* realmente para hacer ese trabajo.

**BAC** (*presupuesto hasta la conclusión*) es el presupuesto total de la línea base.

### Indicadores

| Indicador | Fórmula | Cómo leerlo |
|---|---|---|
| Variación del costo | \`CV = EV − AC\` | Negativa: sobrecosto |
| Variación del cronograma | \`SV = EV − PV\` | Negativa: atraso |
| Índice de desempeño del costo | \`CPI = EV / AC\` | Menor que 1: cada peso rinde menos de lo planeado |
| Índice de desempeño del cronograma | \`SPI = EV / PV\` | Menor que 1: se avanza más lento de lo planeado |

### Pronósticos

Si el desempeño del costo se mantiene, el costo final estimado es \`EAC = BAC / CPI\`. La **variación a la conclusión** \`VAC = BAC − EAC\` dice cuánto faltará (o sobrará) al terminar.`,
    },
    {
      id: ids.block(U, 4),
      type: 'texto',
      position: 7,
      content: `## De los números a las decisiones

Los indicadores no son el final del análisis, sino el principio de una conversación:

- **CPI < 1 y SPI < 1**: el proyecto gasta más y avanza menos. Es la situación más delicada: hay que encontrar la causa (estimaciones optimistas, productividad, retrabajo) antes de pedir más dinero.
- **CPI < 1 y SPI > 1**: se está adelantando trabajo a costa de gastar más, por ejemplo con horas extra.
- **CPI > 1 y SPI < 1**: se gasta menos porque se trabaja menos de lo planeado; a veces faltan personas en el equipo.

Un CPI se estabiliza pronto: después del 20 % de avance, rara vez mejora mucho por sí solo. Por eso, si el EAC supera el presupuesto, el director debe proponer acciones (reducir alcance, renegociar, usar reservas) y no solo esperar que mejore.

Recuerda que **EV se calcula con el presupuesto, no con lo gastado**: si un paquete de $40 millones está al 50 %, su EV es $20 millones, aunque se hayan gastado $30 millones.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas sobre presupuesto, reservas y los datos del valor ganado.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt: '¿Qué reserva **no** forma parte de la línea base de costos?',
            options: [
              { id: 'a', text: 'La reserva para contingencias' },
              { id: 'b', text: 'La reserva de gestión' },
              { id: 'c', text: 'El costo de los paquetes de trabajo' },
              { id: 'd', text: 'El costo de las licencias de software' },
            ],
            answer: 'b',
            explanation:
              'La reserva de gestión cubre imprevistos no identificados y queda fuera de la línea base; usarla requiere aprobación.',
          },
          {
            id: 'q2',
            prompt:
              'El módulo de pagos tiene un presupuesto de $40 millones, está al 50 % y se han gastado $30 millones. ¿Cuál es su **EV**?',
            options: [
              { id: 'a', text: '$15 millones' },
              { id: 'b', text: '$20 millones' },
              { id: 'c', text: '$30 millones' },
              { id: 'd', text: '$40 millones' },
            ],
            answer: 'b',
            explanation: 'EV = % completado × presupuesto = 50 % × $40 millones = $20 millones. Lo gastado es el AC.',
          },
          {
            id: 'q3',
            prompt: '¿Por qué la línea base de costos tiene forma de **curva S**?',
            options: [
              { id: 'a', text: 'Porque los costos siempre se duplican a mitad del proyecto' },
              { id: 'b', text: 'Porque el gasto acumulado empieza lento, se acelera y luego se aplana' },
              { id: 'c', text: 'Porque así lo exige el formato del PMBOK' },
              { id: 'd', text: 'Porque las reservas se gastan al final' },
            ],
            answer: 'b',
            explanation: 'Pocas personas al inicio, todo el equipo en el centro y cierre al final: el acumulado dibuja una S.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: 'Informe de valor ganado de RutaCaribe',
      description: 'Calcula los indicadores en la semana 8, diagnostica el proyecto y explora qué pasaría con otros resultados.',
      config: {
        position: 5,
        kind: 'evm',
        review_ai_activity_id: AI_COSTOS.evmReview,
        instructions:
          'Usa el informe de corte para calcular los indicadores. Escribe los valores en millones de pesos y los índices con dos decimales.',
        params: {
          currency: 'millones',
          bac: 480,
          week: 8,
          total_weeks: 16,
          pv: [0, 10, 24, 42, 64, 90, 128, 180, 240, 300, 350, 392, 424, 448, 464, 474, 480],
          ev: [0, 9, 21, 36, 54, 75, 104, 146, 192],
          ac: [0, 11, 25, 43, 64, 88, 124, 172, 228],
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: 'El comité financiero de la semana 8',
      description: 'Presenta el estado de costos a la junta y propone cómo cerrar la brecha.',
      config: {
        position: 6,
        review_ai_activity_id: AI_COSTOS.caseReview,
        variant_ai_activity_id: AI_COSTOS.caseVariant,
        scenario: `Semana 8 de 16. El informe de valor ganado de RutaCaribe muestra **CPI = 0,84** y **SPI = 0,80**. Con ese desempeño, el costo final estimado es de **$570 millones**, $90 millones por encima del presupuesto de $480 millones.

Al revisar las causas, el equipo encontró que:
- La integración con PSE tomó el doble de horas porque la documentación del proveedor estaba desactualizada.
- Se contrató un diseñador externo por horas para el mapa de sillas, que no estaba presupuestado.
- La reserva para contingencias, de $30 millones, ya se usó en un 60 %.

La gerente financiera dice en el comité:

> *"No hay más dinero este año. Quiero saber cómo vamos a terminar el proyecto con lo aprobado o qué tenemos que sacrificar."*`,
        questions: [
          {
            id: 'p1',
            prompt: 'Explica a la junta, sin tecnicismos, qué significan un CPI de 0,84 y un SPI de 0,80 para RutaCaribe.',
            placeholder: 'Por cada peso que gastamos…',
          },
          {
            id: 'p2',
            prompt: '¿Qué opciones tiene el proyecto para terminar sin superar los $480 millones? Evalúa al menos dos.',
            placeholder: 'Opción 1… Opción 2…',
          },
          {
            id: 'p3',
            prompt: '¿Qué harías para que el CPI de la segunda mitad del proyecto no siga en 0,84?',
            placeholder: 'Para las próximas semanas…',
          },
        ],
        rubric: [
          {
            id: 'c1',
            name: 'Interpretación de los índices',
            description: 'Traduce CPI y SPI a lenguaje del negocio (rinde 84 centavos por peso, avanza al 80 % del ritmo).',
          },
          {
            id: 'c2',
            name: 'Opciones de recuperación',
            description: 'Propone alternativas viables (reducir alcance, diferir funciones, renegociar) y sus consecuencias.',
          },
          {
            id: 'c3',
            name: 'Acciones sobre las causas',
            description: 'Ataca las causas encontradas (estimación de integraciones, costos no presupuestados, uso de reservas).',
          },
          {
            id: 'c4',
            name: 'Uso de los datos del caso',
            description: 'Usa las cifras del caso (EAC, VAC, reserva) con coherencia en sus argumentos.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Qué recortar para cuidar el presupuesto',
      description: 'El equipo debe proponer recortes al alcance. Aporta tu criterio y obtén una síntesis.',
      config: {
        position: 8,
        role: 'Analista financiero del proyecto',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt:
          'La junta pidió terminar RutaCaribe con los $480 millones aprobados. El equipo debe proponer qué funciones pasan a una segunda versión para cerrar una brecha estimada de $90 millones.',
        contributions: [
          {
            author: 'Valentina Orozco',
            role: 'Product owner',
            text: 'La compra de tiquetes y el pago con PSE no se tocan: son el producto. Podemos pasar a la segunda versión las notificaciones de viaje y el programa de puntos. Eso ahorra unos $45 millones.',
          },
          {
            author: 'Juan David Barrios',
            role: 'Líder técnico',
            text: 'El pago con tarjeta de crédito duplica el trabajo de integración y de seguridad. Si salimos solo con PSE ahorramos $35 millones, aunque algunos clientes no podrán pagar.',
          },
          {
            author: 'Mónica Ríos',
            role: 'Patrocinadora (gerencia financiera)',
            text: 'Lo que recortemos tiene que estar escrito como exclusión y aprobado por el comité de cambios. No quiero que en enero me digan que eso "sí estaba incluido".',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: gestión de costos',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: 'Un proyecto tiene EV = $100 millones y AC = $125 millones. ¿Cuál es su CPI?',
            options: [
              { id: 'a', text: '1,25' },
              { id: 'b', text: '0,80' },
              { id: 'c', text: '−25' },
              { id: 'd', text: '0,25' },
            ],
          },
          {
            id: 'e2',
            prompt: 'Un SPI de 1,10 significa que el proyecto…',
            options: [
              { id: 'a', text: 'Gasta 10 % más de lo planeado' },
              { id: 'b', text: 'Avanza 10 % más rápido de lo planeado' },
              { id: 'c', text: 'Está 10 % atrasado' },
              { id: 'd', text: 'Terminará con un 10 % de ahorro' },
            ],
          },
          {
            id: 'e3',
            prompt: 'Con BAC = $480 millones y CPI = 0,80, ¿cuál es el EAC si el desempeño se mantiene?',
            options: [
              { id: 'a', text: '$384 millones' },
              { id: 'b', text: '$480 millones' },
              { id: 'c', text: '$560 millones' },
              { id: 'd', text: '$600 millones' },
            ],
          },
          {
            id: 'e4',
            prompt: '¿Qué dato representa el trabajo realmente terminado, valorado con el presupuesto?',
            options: [
              { id: 'a', text: 'PV, valor planificado' },
              { id: 'b', text: 'EV, valor ganado' },
              { id: 'c', text: 'AC, costo real' },
              { id: 'd', text: 'BAC, presupuesto hasta la conclusión' },
            ],
          },
          {
            id: 'e5',
            prompt: 'El proyecto tiene CV negativa y SV positiva. ¿Cuál es la explicación más probable?',
            options: [
              { id: 'a', text: 'Va atrasado y por debajo del presupuesto' },
              { id: 'b', text: 'Va adelantado gracias a gastar más de lo planeado, por ejemplo con horas extra' },
              { id: 'c', text: 'Va exactamente según lo planeado' },
              { id: 'd', text: 'El presupuesto estaba sobreestimado' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.costos,
    type: 'autoevaluacion',
    config: {
      questions: [
        {
          id: 'e1',
          correct_answer: 'b',
          feedback_incorrect: 'CPI = EV / AC = 100 / 125 = 0,80: cada peso gastado rinde 80 centavos de trabajo.',
        },
        {
          id: 'e2',
          correct_answer: 'b',
          feedback_incorrect: 'El SPI compara EV con PV: un valor de 1,10 indica que se avanza 10 % más rápido de lo planeado.',
        },
        {
          id: 'e3',
          correct_answer: 'd',
          feedback_incorrect: 'EAC = BAC / CPI = 480 / 0,80 = $600 millones.',
        },
        {
          id: 'e4',
          correct_answer: 'b',
          feedback_incorrect: 'El valor ganado (EV) es el trabajo terminado expresado en dinero del presupuesto.',
        },
        {
          id: 'e5',
          correct_answer: 'b',
          feedback_incorrect: 'CV negativa es sobrecosto y SV positiva es adelanto: se está comprando velocidad con más gasto.',
        },
      ],
    },
  },
}
