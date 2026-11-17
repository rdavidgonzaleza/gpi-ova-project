import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 2

export const AI_CRONOGRAMA = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  cpmReview: ids.ai(U, 3),
}

export const cronograma: CourseUnit = {
  ovaId: OVA_IDS.cronograma,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## De la EDT al calendario

Ya sabemos *qué* construir. La gerencia pregunta: **¿cuándo estará lista la app?** Quieren lanzar antes de diciembre, cuando la demanda se triplica.

Gestionar el cronograma es convertir los paquetes de la EDT en un **calendario realista**.

> Un cronograma no es una promesa: es un modelo que muestra qué pasa cuando algo cambia.`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## Los procesos del cronograma

![Los seis procesos de la gestión del cronograma y la salida de cada uno](/ovas/cronograma-procesos.svg)

La dependencia más común es **fin a inicio (FI)**: las pruebas integrales no empiezan hasta terminar web, app y pagos.

### ¿Cuánto dura cada actividad?

Se estima con juicio de expertos, estimación **análoga**, **paramétrica** o **por tres valores (PERT)**:

![Estimación por tres valores: optimista, más probable y pesimista con la fórmula PERT](/ovas/cronograma-pert.svg)`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## El método de la ruta crítica (CPM)

La **ruta crítica** es la secuencia más larga de actividades dependientes: marca la duración mínima del proyecto.

1. **Pasada hacia adelante:** \`FT = IT + duración\`.
2. **Pasada hacia atrás:** \`ITa = FTa − duración\`.
3. **Holgura** = \`ITa − IT\`. Holgura cero → actividad crítica.

![Notación de un nodo CPM y cómo un retraso mayor que la holgura mueve el final del proyecto](/ovas/cronograma-holgura.svg)`,
    },
    {
      id: ids.block(U, 4),
      type: 'imagen',
      position: 5,
      content:
        '/ovas/cronograma-red.svg|Red de actividades de RutaCaribe: requisitos, arquitectura, tres frentes en paralelo (web, móvil y pagos), pruebas integrales, capacitación y puesta en producción.',
    },
    {
      id: ids.block(U, 5),
      type: 'texto',
      position: 7,
      content: `## Comprimir el cronograma

Si la fecha no alcanza, se comprime **solo la ruta crítica**: acortar una actividad con holgura no adelanta el final.

![Intensificación frente a ejecución rápida: qué cambia y cuánto cuesta cada una](/ovas/cronograma-compresion.svg)

El **diagrama de Gantt** comunica el resultado: barras en el tiempo, ruta crítica resaltada e hitos.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas sobre dependencias, estimación y procesos del cronograma.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt:
              'Las pruebas integrales de RutaCaribe no pueden empezar hasta que termine el desarrollo de la app. ¿Qué tipo de dependencia es?',
            options: [
              { id: 'a', text: 'Inicio a inicio' },
              { id: 'b', text: 'Fin a inicio' },
              { id: 'c', text: 'Fin a fin' },
              { id: 'd', text: 'Inicio a fin' },
            ],
            answer: 'b',
            explanation: 'La sucesora (pruebas) empieza cuando la predecesora (desarrollo) termina: fin a inicio.',
          },
          {
            id: 'q2',
            prompt:
              'Para el módulo de pagos el equipo estima 2 semanas en el mejor caso, 4 lo más probable y 12 en el peor. ¿Cuál es la estimación PERT?',
            options: [
              { id: 'a', text: '4 semanas' },
              { id: 'b', text: '5 semanas' },
              { id: 'c', text: '6 semanas' },
              { id: 'd', text: '7 semanas' },
            ],
            answer: 'b',
            explanation: '(2 + 4 × 4 + 12) / 6 = 30 / 6 = 5 semanas.',
          },
          {
            id: 'q3',
            prompt: '¿En qué proceso se obtiene la **línea base del cronograma**?',
            options: [
              { id: 'a', text: 'Definir las actividades' },
              { id: 'b', text: 'Secuenciar las actividades' },
              { id: 'c', text: 'Desarrollar el cronograma' },
              { id: 'd', text: 'Controlar el cronograma' },
            ],
            answer: 'c',
            explanation: 'Desarrollar el cronograma integra secuencia, duraciones y recursos, y produce la línea base.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: 'Encuentra la ruta crítica de RutaCaribe',
      description: 'Calcula la duración, la ruta crítica y las holguras, y prueba qué pasa cuando algo se retrasa.',
      config: {
        position: 6,
        kind: 'cpm',
        review_ai_activity_id: AI_CRONOGRAMA.cpmReview,
        instructions:
          'Con la tabla de actividades, calcula la duración del proyecto, marca las actividades de la ruta crítica y responde las preguntas. Al comprobar verás el Gantt y podrás simular retrasos.',
        params: {
          unit: 'semanas',
          activities: [
            { id: 'A', name: 'Requisitos y diseño UX', duration: 4, predecessors: [] },
            { id: 'B', name: 'Arquitectura y base de datos', duration: 2, predecessors: ['A'] },
            { id: 'C', name: 'Plataforma web de venta', duration: 5, predecessors: ['B'] },
            { id: 'D', name: 'Aplicación móvil', duration: 6, predecessors: ['B'] },
            { id: 'E', name: 'Integración de pagos PSE', duration: 4, predecessors: ['B'] },
            { id: 'F', name: 'Pruebas integrales', duration: 2, predecessors: ['C', 'D', 'E'] },
            { id: 'G', name: 'Capacitación a taquilleros', duration: 2, predecessors: ['C'] },
            { id: 'H', name: 'Puesta en producción', duration: 2, predecessors: ['F', 'G'] },
          ],
          slack_question: 'E',
          delay: { activity: 'E', amount: 3 },
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: '"Lo necesito para el 1 de diciembre"',
      description: 'La gerencia pide adelantar el lanzamiento dos semanas. Decide cómo comprimir el cronograma.',
      config: {
        position: 8,
        review_ai_activity_id: AI_CRONOGRAMA.caseReview,
        variant_ai_activity_id: AI_CRONOGRAMA.caseVariant,
        scenario: `El cronograma aprobado de RutaCaribe dura **16 semanas** y su ruta crítica es *Requisitos → Arquitectura → Aplicación móvil → Pruebas integrales → Puesta en producción*. La plataforma web tiene 1 semana de holgura y la integración de pagos, 2.

La gerente de la cooperativa escribe:

> *"Nos confirmaron que la temporada alta empieza el 1 de diciembre. Necesito RutaCaribe en producción **dos semanas antes** de lo planeado. Díganme qué necesitan."*

El equipo tiene estas opciones:
- Contratar un segundo desarrollador móvil por **$18 millones**; el líder técnico calcula que acortaría la app de 6 a 4 semanas.
- Empezar las pruebas integrales mientras se termina la app (ejecución rápida), con riesgo de retrabajo.
- Contratar un desarrollador web extra por **$12 millones** para acortar la plataforma web de 5 a 3 semanas.`,
        questions: [
          {
            id: 'p1',
            prompt: '¿Qué opciones adelantan de verdad la fecha de lanzamiento y cuáles no? Explica por qué usando la ruta crítica.',
            placeholder: 'La opción que realmente adelanta la fecha es… porque…',
          },
          {
            id: 'p2',
            prompt: 'Si se acorta la app en 2 semanas, ¿la ruta crítica sigue siendo la misma? ¿Qué debe vigilar el equipo?',
            placeholder: 'Después de acortar la app…',
          },
          {
            id: 'p3',
            prompt: 'Redacta tu recomendación a la gerente, con costos y riesgos de la opción que elijas.',
            placeholder: 'Recomendamos…',
          },
        ],
        rubric: [
          {
            id: 'c1',
            name: 'Uso de la ruta crítica',
            description: 'Reconoce que solo acortar actividades críticas adelanta el final y que acortar la web (con holgura) no sirve.',
          },
          {
            id: 'c2',
            name: 'Cambio de la ruta crítica',
            description: 'Detecta que al acortar la app aparecen nuevas rutas críticas o casi críticas (web y pagos) y que las holguras se reducen.',
          },
          {
            id: 'c3',
            name: 'Costo y riesgo de la compresión',
            description: 'Compara intensificación (costo de $18 millones, ley de Brooks) con ejecución rápida (riesgo de retrabajo).',
          },
          {
            id: 'c4',
            name: 'Recomendación al interesado',
            description: 'Presenta una recomendación clara, con cifras del caso y lo que la gerencia debe aprobar.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Reunión de seguimiento: la app va atrasada',
      description: 'La app móvil lleva una semana de retraso. Escucha al equipo y propone qué hacer.',
      config: {
        position: 9,
        role: 'Directora o director del proyecto',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt:
          'Semana 9 de 16. La aplicación móvil, que está en la ruta crítica, acumula una semana de retraso por problemas con el mapa de sillas. El equipo se reúne para decidir cómo recuperar el tiempo.',
        contributions: [
          {
            author: 'Santiago Pineda',
            role: 'Desarrollador móvil',
            text: 'El mapa de sillas tiene que funcionar con buses de 2 pisos y no estaba en el diseño original. Puedo recuperar la semana si me quitan las notificaciones de viaje de esta entrega y las hacemos en la siguiente versión.',
          },
          {
            author: 'Camila Herrera',
            role: 'Desarrolladora web',
            text: 'Yo tengo una semana de holgura. Puedo ayudar con el mapa de sillas porque ya lo hice en la web con la misma librería. Eso sí, alguien tiene que cubrir mis pruebas.',
          },
          {
            author: 'Andrés Castillo',
            role: 'Analista de calidad',
            text: 'Podríamos empezar las pruebas de la app por módulos desde ya, en lugar de esperar a que esté completa. Encontraríamos errores antes, aunque algunas pruebas habría que repetirlas.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: gestión del cronograma',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: '¿Qué es la **ruta crítica**?',
            options: [
              { id: 'a', text: 'La secuencia de actividades más costosas del proyecto' },
              { id: 'b', text: 'La secuencia más larga de actividades dependientes, que define la duración mínima' },
              { id: 'c', text: 'Las actividades con más riesgo técnico' },
              { id: 'd', text: 'Las actividades que dirige el patrocinador' },
            ],
          },
          {
            id: 'e2',
            prompt: 'Una actividad tiene inicio temprano en la semana 6 e inicio tardío en la semana 9. ¿Cuál es su holgura total?',
            options: [
              { id: 'a', text: '0 semanas' },
              { id: 'b', text: '3 semanas' },
              { id: 'c', text: '6 semanas' },
              { id: 'd', text: '15 semanas' },
            ],
          },
          {
            id: 'e3',
            prompt: 'Una actividad con 2 semanas de holgura se retrasa 3 semanas. ¿Qué pasa con la fecha final del proyecto?',
            options: [
              { id: 'a', text: 'No cambia, porque tenía holgura' },
              { id: 'b', text: 'Se retrasa 3 semanas' },
              { id: 'c', text: 'Se retrasa 1 semana' },
              { id: 'd', text: 'Se adelanta 2 semanas' },
            ],
          },
          {
            id: 'e4',
            prompt: 'Agregar un desarrollador a una actividad crítica para terminarla antes es…',
            options: [
              { id: 'a', text: 'Ejecución rápida (fast tracking)' },
              { id: 'b', text: 'Nivelación de recursos' },
              { id: 'c', text: 'Intensificación (crashing)' },
              { id: 'd', text: 'Estimación análoga' },
            ],
          },
          {
            id: 'e5',
            prompt: '¿Qué riesgo introduce principalmente la **ejecución rápida**?',
            options: [
              { id: 'a', text: 'Retrabajo, por hacer en paralelo lo que dependía de otra actividad' },
              { id: 'b', text: 'Un aumento directo del costo de mano de obra' },
              { id: 'c', text: 'La pérdida de la línea base del alcance' },
              { id: 'd', text: 'Ninguno: es una técnica sin efectos secundarios' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.cronograma,
    type: 'autoevaluacion',
    config: {
      questions: [
        {
          id: 'e1',
          correct_answer: 'b',
          feedback_incorrect: 'La ruta crítica es la secuencia más larga de actividades dependientes y fija la duración mínima.',
        },
        {
          id: 'e2',
          correct_answer: 'b',
          feedback_incorrect: 'La holgura total es el inicio tardío menos el inicio temprano: 9 − 6 = 3 semanas.',
        },
        {
          id: 'e3',
          correct_answer: 'c',
          feedback_incorrect: 'El retraso consume la holgura y solo el exceso (3 − 2 = 1 semana) llega al final del proyecto.',
        },
        {
          id: 'e4',
          correct_answer: 'c',
          feedback_incorrect: 'Agregar recursos a una actividad crítica para acortarla es intensificación.',
        },
        {
          id: 'e5',
          correct_answer: 'a',
          feedback_incorrect: 'La ejecución rápida solapa actividades en secuencia y su principal riesgo es el retrabajo.',
        },
      ],
    },
  },
}
