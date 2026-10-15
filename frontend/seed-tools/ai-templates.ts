// Prompt templates of the ai-service activities. They live outside src/ so they
// are never shipped to the browser; scripts/export-seed.ts writes them to
// ai-service/seed/ai_activities.json.
//
// Conventions (ai-service README): {{input}} marks where the learner's input
// goes; [[formato:json]] asks the model for a JSON answer.

import { COURSE_UNITS } from '../src/content'
import { SHARED_AI } from '../src/content/ids'
import type { CaseStudyConfig } from '../src/types/activities'

export interface AITemplate {
  id: string
  activity_id: string
  provider: 'gemini'
  prompt_template: string
}

const lines = (...parts: string[]) => parts.join('\n')

const shared: AITemplate[] = [
  {
    id: SHARED_AI.hints,
    activity_id: SHARED_AI.hints,
    provider: 'gemini',
    prompt_template: lines(
      'Tarea: dar una pista para una pregunta de selección múltiple sin revelar la respuesta.',
      'Recibirás un JSON con la pregunta, las opciones, la opción que el estudiante marcó (si marcó alguna) y el nivel de pista pedido.',
      '- Nivel 1: recuerda el concepto que la pregunta evalúa, sin mencionar opciones.',
      '- Nivel 2: da una pregunta guía o un ejemplo de RutaCaribe que acerque a la idea correcta.',
      '- Nivel 3: explica por qué una o dos opciones incorrectas no encajan. Nunca digas cuál es la correcta.',
      'Si el estudiante ya marcó una opción, no confirmes ni niegues si es correcta.',
      'Responde en 2 a 4 oraciones, sin títulos ni viñetas.',
      '',
      '{{input}}',
    ),
  },
  {
    id: SHARED_AI.explainMistakes,
    activity_id: SHARED_AI.explainMistakes,
    provider: 'gemini',
    prompt_template: lines(
      '[[formato:json]]',
      'Tarea: explicar los errores de una autoevaluación ya calificada.',
      'Recibirás un JSON con el OVA, las preguntas con sus opciones, la respuesta que eligió el estudiante y la retroalimentación oficial del sistema de evaluación, que menciona los conceptos de las preguntas falladas.',
      'Usa la retroalimentación oficial para identificar qué preguntas falló. No contradigas esa retroalimentación.',
      'Para cada pregunta fallada explica por qué la opción elegida no es correcta y qué idea debe repasar, en 2 o 3 oraciones.',
      'Si no falló ninguna, devuelve "explicaciones" vacío y felicítalo en "siguiente_paso".',
      'Devuelve exactamente: {"explicaciones":[{"pregunta":"texto corto de la pregunta","explicacion":"...","concepto":"concepto a repasar"}],"siguiente_paso":"una recomendación concreta"}',
      '',
      '{{input}}',
    ),
  },
  {
    id: SHARED_AI.recap,
    activity_id: SHARED_AI.recap,
    provider: 'gemini',
    prompt_template: lines(
      '[[formato:json]]',
      'Tarea: escribir un repaso personalizado al terminar un OVA.',
      'Recibirás un JSON con el título del OVA, su resultado de aprendizaje y el desempeño del estudiante en cada actividad (aciertos de quizzes, nivel en la rúbrica del caso, resultado de la simulación y puntaje de la autoevaluación).',
      'Destaca fortalezas reales a partir de los datos. Prioriza a lo sumo tres temas a reforzar, con una acción concreta para cada uno (releer una sección, rehacer una actividad, practicar con un ejemplo de RutaCaribe).',
      'No inventes resultados que no estén en los datos.',
      'Devuelve exactamente: {"resumen":"2 o 3 oraciones","fortalezas":["..."],"a_reforzar":[{"tema":"...","accion":"..."}],"siguiente_paso":"..."}',
      '',
      '{{input}}',
    ),
  },
  {
    id: SHARED_AI.teamSynthesis,
    activity_id: SHARED_AI.teamSynthesis,
    provider: 'gemini',
    prompt_template: lines(
      '[[formato:json]]',
      'Tarea: actuar como relator neutral de una reunión de equipo de proyecto.',
      'Recibirás un JSON con la situación que se discute, las posturas de los integrantes y el aporte del estudiante con su rol.',
      'Sintetiza la discusión: puntos de acuerdo, tensiones entre posturas y una decisión que el equipo podría tomar, coherente con buenas prácticas de gestión de proyectos.',
      'Valora el aporte del estudiante: qué suma a la discusión y qué podría fortalecer. Sé específico y constructivo.',
      'Devuelve exactamente: {"sintesis":"...","acuerdos":["..."],"tensiones":["..."],"decision_sugerida":"...","sobre_tu_aporte":"..."}',
      '',
      '{{input}}',
    ),
  },
  {
    id: SHARED_AI.questionDrafts,
    activity_id: SHARED_AI.questionDrafts,
    provider: 'gemini',
    prompt_template: lines(
      '[[formato:json]]',
      'Tarea: ayudar a un docente a redactar borradores de preguntas de selección múltiple.',
      'Recibirás un JSON con el OVA, el tema, la cantidad de preguntas y la dificultad. Las preguntas deben evaluar comprensión y aplicación, no memoria, y pueden usar el caso RutaCaribe (plataforma de tiquetes de una cooperativa de buses en Cartagena).',
      'Cada pregunta tiene 4 opciones plausibles y una sola correcta. Evita "todas las anteriores" y opciones absurdas.',
      'Devuelve exactamente: {"preguntas":[{"enunciado":"...","opciones":["...","...","...","..."],"correcta":0,"explicacion":"..."}]}',
      '',
      '{{input}}',
    ),
  },
]

function caseReviewTemplate(id: string, title: string, config: CaseStudyConfig): AITemplate {
  const rubric = config.rubric.map((c) => `- ${c.id} · ${c.name}: ${c.description}`).join('\n')
  return {
    id,
    activity_id: id,
    provider: 'gemini',
    prompt_template: lines(
      '[[formato:json]]',
      `Tarea: retroalimentar las respuestas de un estudiante al caso de estudio "${title}" usando esta rúbrica:`,
      rubric,
      '',
      'Recibirás un JSON con el escenario del caso y las respuestas del estudiante a cada pregunta.',
      'Para cada criterio asigna un nivel: "logrado", "parcial" o "por_mejorar", con un comentario de 1 o 2 oraciones que cite lo que el estudiante escribió.',
      'Agrega fortalezas, mejoras concretas y una pregunta de reflexión que lo haga pensar más allá de lo que respondió. No reescribas sus respuestas por él.',
      'Devuelve exactamente: {"criterios":[{"id":"c1","nivel":"logrado","comentario":"..."}],"fortalezas":["..."],"mejoras":["..."],"pregunta_reflexion":"..."}',
      '',
      '{{input}}',
    ),
  }
}

function caseVariantTemplate(id: string, title: string, config: CaseStudyConfig): AITemplate {
  return {
    id,
    activity_id: id,
    provider: 'gemini',
    prompt_template: lines(
      '[[formato:json]]',
      `Tarea: escribir una variante del caso de estudio "${title}" para que el estudiante practique con una situación nueva.`,
      'Caso original:',
      config.scenario,
      '',
      'Preguntas que el estudiante responderá (no las cambies):',
      ...config.questions.map((q) => `- ${q.prompt}`),
      '',
      'Mantén el proyecto RutaCaribe y el mismo concepto evaluado, pero cambia el interesado, la petición, las cifras y el momento del proyecto. Los datos deben ser coherentes entre sí y permitir responder todas las preguntas.',
      'El escenario se escribe en Markdown, en 120 a 180 palabras, con una cita del interesado en cursiva.',
      'Recibirás un JSON con preferencias opcionales del estudiante; respétalas si son razonables.',
      'Devuelve exactamente: {"titulo":"...","escenario":"..."}',
      '',
      '{{input}}',
    ),
  }
}

function simulationReviewTemplate(id: string, title: string, focus: string): AITemplate {
  return {
    id,
    activity_id: id,
    provider: 'gemini',
    prompt_template: lines(
      '[[formato:json]]',
      `Tarea: revisar el resultado de un estudiante en la simulación "${title}".`,
      focus,
      'Recibirás un JSON con lo que hizo el estudiante y los errores que detectó el sistema.',
      'Explica el principio detrás de cada error y reconoce lo que hizo bien. No repitas la lista de errores tal cual: interprétala.',
      'Devuelve exactamente: {"valoracion":"2 oraciones","observaciones":["..."],"principio_clave":"una idea para recordar"}',
      '',
      '{{input}}',
    ),
  }
}

const SIMULATION_FOCUS: Record<string, string> = {
  edt: 'Se evalúa la EDT: regla del 100 %, orientación a entregables y exclusiones del alcance.',
  cpm: 'Se evalúa el cálculo de la ruta crítica, las holguras y el efecto de un retraso.',
  evm: 'Se evalúa la interpretación de PV, EV, AC, CPI, SPI y el pronóstico EAC.',
  riesgos: 'Se evalúa la priorización de riesgos por probabilidad e impacto y la elección de respuestas.',
  triple_restriccion: 'Se evalúa la comprensión de la triple restricción.',
}

const perActivity: AITemplate[] = COURSE_UNITS.flatMap((unit) =>
  unit.activities.flatMap((activity): AITemplate[] => {
    if (activity.type === 'caso_estudio') {
      const { config } = activity
      return [
        caseReviewTemplate(config.review_ai_activity_id, activity.title, config),
        ...(config.variant_ai_activity_id
          ? [caseVariantTemplate(config.variant_ai_activity_id, activity.title, config)]
          : []),
      ]
    }
    if (activity.type === 'simulacion' && activity.config.review_ai_activity_id) {
      return [
        simulationReviewTemplate(
          activity.config.review_ai_activity_id,
          activity.title,
          SIMULATION_FOCUS[activity.config.kind],
        ),
      ]
    }
    return []
  }),
)

export const AI_TEMPLATES: AITemplate[] = [...shared, ...perActivity]
