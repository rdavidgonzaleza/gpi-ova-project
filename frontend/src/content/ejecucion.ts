import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 6

export const AI_EJECUCION = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  teamReview: ids.ai(U, 3),
}

export const ejecucion: CourseUnit = {
  ovaId: OVA_IDS.ejecucion,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## Del plan al trabajo

RutaCaribe tiene plan aprobado. Empieza la fase que consume **la mayor parte del tiempo y del presupuesto**: la ejecución. Aquí el director deja de planificar y pasa a **dirigir personas, coordinar el trabajo y cuidar la calidad**.

![Los procesos de ejecución: dirigir el trabajo, gestionar el conocimiento, la calidad, el equipo, las comunicaciones y las respuestas a riesgos](/ovas/ejecucion-procesos.svg)

> Ejecutar no es "programar lo que dice el plan": es lograr que un equipo lo haga bien, a tiempo y sin quemarse.`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## Dirigir el equipo

Todo equipo nuevo pasa por etapas. Reconocerlas ayuda al director a saber **qué necesita el equipo en cada momento**:

![Modelo de Tuckman: formación, conflicto, normalización, desempeño y disolución, con lo que necesita el equipo en cada etapa](/ovas/ejecucion-tuckman.svg)

Para que nadie dude de quién hace qué, se usa una **matriz RACI**: un solo responsable de aprobar (**A**) por entregable.

![Matriz RACI de RutaCaribe: responsable, aprueba, consultado e informado por entregable](/ovas/ejecucion-raci.svg)`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## Comunicar

Con 8 personas hay **28 canales** de comunicación posibles: \`n(n − 1) / 2\`. Por eso las comunicaciones se planifican: qué se informa, a quién, cada cuánto y por qué medio.

En RutaCaribe: reunión diaria de 15 minutos del equipo, informe semanal a la gerente y boletín mensual a los taquilleros.

> El problema de las comunicaciones es la ilusión de que ya ocurrieron.`,
    },
    {
      id: ids.block(U, 4),
      type: 'texto',
      position: 6,
      content: `## Gestionar la calidad

La calidad no se "agrega al final": se construye durante la ejecución.

![Gestionar la calidad frente a controlar la calidad: proceso y prevención frente a producto e inspección](/ovas/ejecucion-calidad.svg)

Prevenir es más barato que corregir: un defecto encontrado en producción cuesta muchas veces más que uno encontrado en una revisión de código.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas sobre el equipo y la matriz RACI.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt: 'En una matriz RACI, ¿cuántas personas deben tener la **A** (aprueba) en un mismo entregable?',
            options: [
              { id: 'a', text: 'Ninguna' },
              { id: 'b', text: 'Exactamente una' },
              { id: 'c', text: 'Todo el equipo' },
              { id: 'd', text: 'Al menos dos, para tener respaldo' },
            ],
            answer: 'b',
            explanation: 'Un solo dueño de la aprobación evita que la decisión quede en el aire.',
          },
          {
            id: 'q2',
            prompt: 'El equipo discute fuerte sobre qué framework usar para la app. Según Tuckman, está en la etapa de…',
            options: [
              { id: 'a', text: 'Formación' },
              { id: 'b', text: 'Conflicto' },
              { id: 'c', text: 'Desempeño' },
              { id: 'd', text: 'Disolución' },
            ],
            answer: 'b',
            explanation: 'En la etapa de conflicto chocan ideas y roles. El director facilita acuerdos.',
          },
          {
            id: 'q3',
            prompt: 'Las revisiones de código y las auditorías de proceso son actividades de…',
            options: [
              { id: 'a', text: 'Gestionar la calidad (prevención)' },
              { id: 'b', text: 'Controlar el alcance' },
              { id: 'c', text: 'Cierre del proyecto' },
              { id: 'd', text: 'Gestión de adquisiciones' },
            ],
            answer: 'a',
            explanation: 'Revisar el proceso para que los defectos no ocurran es gestionar la calidad.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: '¿En qué etapa está el equipo?',
      description: 'Clasifica situaciones reales del equipo de RutaCaribe en las etapas de Tuckman.',
      config: {
        position: 5,
        kind: 'clasificacion',
        review_ai_activity_id: AI_EJECUCION.teamReview,
        instructions: 'Lee lo que pasa en el equipo y decide en qué etapa de desarrollo está.',
        params: {
          categories: [
            { id: 'formacion', name: 'Formación', hint: 'Cortesía, dudas sobre roles' },
            { id: 'conflicto', name: 'Conflicto', hint: 'Choques de ideas y de poder' },
            { id: 'normalizacion', name: 'Normalización', hint: 'Acuerdos y reglas propias' },
            { id: 'desempeno', name: 'Desempeño', hint: 'Autonomía y resultados' },
          ],
          items: [
            { id: 'i1', text: 'En la primera reunión todos son muy amables y nadie cuestiona el plan.', category: 'formacion', reason: 'Cortesía inicial y poca confianza para discrepar.' },
            { id: 'i2', text: 'Los desarrolladores preguntan quién decide la arquitectura y a quién reportan.', category: 'formacion', reason: 'Los roles aún no están claros.' },
            { id: 'i3', text: 'Web y móvil discuten porque cada uno quiere diseñar la API a su manera.', category: 'conflicto', reason: 'Choque de ideas y de control sobre el trabajo.' },
            { id: 'i4', text: 'Un desarrollador ignora las decisiones del líder técnico en las revisiones de código.', category: 'conflicto', reason: 'Se disputa la autoridad dentro del equipo.' },
            { id: 'i5', text: 'El equipo acuerda una guía de estilo y que ningún cambio entra sin revisión de otro.', category: 'normalizacion', reason: 'El equipo crea sus propias reglas de trabajo.' },
            { id: 'i6', text: 'La reunión diaria empieza puntual y dura 15 minutos sin que nadie lo pida.', category: 'normalizacion', reason: 'Las normas acordadas ya se cumplen solas.' },
            { id: 'i7', text: 'Ante una caída de PSE, el equipo se organiza solo y la resuelve en una hora.', category: 'desempeno', reason: 'Autonomía y alto rendimiento sin intervención del director.' },
            { id: 'i8', text: 'Los integrantes se cubren entre sí y proponen mejoras al proceso.', category: 'desempeno', reason: 'Confianza y mejora continua: el equipo rinde por sí mismo.' },
          ],
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: 'El equipo que se quemó en la semana 9',
      description: 'El equipo trabaja horas extra y la calidad cae. Decide cómo dirigirlo.',
      config: {
        position: 7,
        review_ai_activity_id: AI_EJECUCION.caseReview,
        variant_ai_activity_id: AI_EJECUCION.caseVariant,
        scenario: `Semana 9 de 16. Para no atrasarse, el equipo de RutaCaribe lleva tres semanas trabajando hasta las 10 p. m. y algunos sábados.

- Las pruebas encontraron **42 defectos** esta semana; el promedio era 12.
- Dos desarrolladores dejaron de hablar en la reunión diaria y se comunican solo por chat.
- La analista de calidad dice que las revisiones de código "ya no dan tiempo" y se saltan.
- La gerente pregunta por qué el informe semanal dice "en verde" si hay tantos errores.

*"Si bajamos el ritmo, no llegamos a diciembre"*, dice el líder técnico.`,
        questions: [
          { id: 'p1', prompt: '¿Qué está pasando con el equipo y con la calidad? Relaciona las horas extra con los defectos.', placeholder: 'El equipo…' },
          { id: 'p2', prompt: '¿Qué harías esta semana como director con el equipo, el proceso de calidad y el informe a la gerente?', placeholder: 'Con el equipo… Con la calidad… Con el informe…' },
          { id: 'p3', prompt: 'Responde al líder técnico: ¿bajar el ritmo pone en riesgo diciembre? Argumenta.', placeholder: 'Le diría que…' },
        ],
        rubric: [
          { id: 'c1', name: 'Diagnóstico del equipo', description: 'Reconoce el desgaste, el conflicto y la relación entre horas extra, retrabajo y defectos.' },
          { id: 'c2', name: 'Calidad', description: 'Propone restablecer la prevención (revisiones, pruebas) y explica por qué prevenir es más barato que corregir.' },
          { id: 'c3', name: 'Comunicación honesta', description: 'Corrige el informe "en verde" y comunica a la gerente el estado real con datos.' },
          { id: 'c4', name: 'Decisión equilibrada', description: 'Plantea alternativas realistas (ritmo sostenible, priorizar alcance, compresión) con sus costos.' },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Plan de comunicaciones del lanzamiento',
      description: 'El equipo define cómo informar a cada interesado. Aporta desde tu rol.',
      config: {
        position: 8,
        role: 'Responsable de comunicaciones del proyecto',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt: 'Faltan seis semanas para el lanzamiento. El equipo decide qué informar, a quién, cada cuánto y por qué medio, para que nadie se entere tarde.',
        contributions: [
          { author: 'Valentina Orozco', role: 'Product owner', text: 'A los taquilleros hay que mostrarles el sistema ya, en persona, no por correo. Si se enteran el día del lanzamiento, lo van a rechazar.' },
          { author: 'Juan David Barrios', role: 'Líder técnico', text: 'Propongo un tablero público con el avance de cada historia. Así la gerente lo consulta cuando quiera y no nos interrumpe.' },
          { author: 'Mariana López', role: 'Asistente de gerencia', text: 'La gerente no va a entrar a un tablero. Necesita un resumen de una página los viernes: qué se hizo, qué sigue y qué decisiones le tocan.' },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: ejecución',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: '¿Cuántos canales de comunicación tiene un equipo de 6 personas?',
            options: [
              { id: 'a', text: '6' },
              { id: 'b', text: '12' },
              { id: 'c', text: '15' },
              { id: 'd', text: '36' },
            ],
          },
          {
            id: 'e2',
            prompt: 'El equipo ya acordó sus reglas de trabajo y las cumple. Está en la etapa de…',
            options: [
              { id: 'a', text: 'Formación' },
              { id: 'b', text: 'Conflicto' },
              { id: 'c', text: 'Normalización' },
              { id: 'd', text: 'Disolución' },
            ],
          },
          {
            id: 'e3',
            prompt: 'Inspeccionar la app terminada para encontrar defectos es…',
            options: [
              { id: 'a', text: 'Gestionar la calidad' },
              { id: 'b', text: 'Controlar la calidad' },
              { id: 'c', text: 'Planificar la calidad' },
              { id: 'd', text: 'Gestionar el conocimiento' },
            ],
          },
          {
            id: 'e4',
            prompt: 'En la matriz RACI, la "I" significa que la persona…',
            options: [
              { id: 'a', text: 'Hace el trabajo' },
              { id: 'b', text: 'Aprueba el entregable' },
              { id: 'c', text: 'Da su opinión antes de decidir' },
              { id: 'd', text: 'Recibe información del avance' },
            ],
          },
          {
            id: 'e5',
            prompt: '¿Qué fase del proyecto suele consumir la mayor parte del presupuesto?',
            options: [
              { id: 'a', text: 'Inicio' },
              { id: 'b', text: 'Planificación' },
              { id: 'c', text: 'Ejecución' },
              { id: 'd', text: 'Cierre' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.ejecucion,
    type: 'autoevaluacion',
    config: {
      questions: [
        { id: 'e1', correct_answer: 'c', feedback_incorrect: 'Canales = n(n − 1) / 2 = 6 × 5 / 2 = 15.' },
        { id: 'e2', correct_answer: 'c', feedback_incorrect: 'Cuando el equipo crea y cumple sus propias reglas está en normalización.' },
        { id: 'e3', correct_answer: 'b', feedback_incorrect: 'Inspeccionar el producto para detectar defectos es controlar la calidad; gestionarla es prevenir en el proceso.' },
        { id: 'e4', correct_answer: 'd', feedback_incorrect: 'I = informado: recibe información del avance, pero no participa en la decisión.' },
        { id: 'e5', correct_answer: 'c', feedback_incorrect: 'La ejecución concentra la mayor parte del trabajo, el tiempo y el presupuesto.' },
      ],
    },
  },
}
