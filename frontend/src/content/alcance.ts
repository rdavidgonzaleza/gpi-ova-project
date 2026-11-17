import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 1

export const AI_ALCANCE = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  edtReview: ids.ai(U, 3),
}

export const alcance: CourseUnit = {
  ovaId: OVA_IDS.alcance,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## El proyecto que nos acompaña

La **Cooperativa Brisas del Caribe** vende tiquetes en taquilla y por WhatsApp. Tu equipo construirá **RutaCaribe**: comprar tiquetes, elegir silla y pagar en línea.

En los cuatro OVA gestionarás este proyecto: **alcance → cronograma → costos → riesgos**.

> Antes de programar, hay que acordar **qué** se construye y **qué no**. Eso es gestionar el alcance.`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## Alcance del producto y alcance del proyecto

El PMBOK separa **lo que se entrega** (producto) del **trabajo para entregarlo** (proyecto).

![Alcance del producto frente al alcance del proyecto en RutaCaribe](/ovas/alcance-producto-proyecto.svg)

### Los seis procesos

![Los seis procesos de la gestión del alcance, con la pregunta que responde y la salida de cada uno](/ovas/alcance-procesos.svg)

El **enunciado del alcance** fija entregables, criterios de aceptación, supuestos y **exclusiones**, que evitan discusiones meses después.`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## La Estructura de Desglose del Trabajo (EDT)

La EDT descompone **todo** el trabajo en partes manejables. Es la base para estimar, asignar responsables y armar el cronograma.

![Las cuatro reglas de una buena EDT](/ovas/alcance-reglas-edt.svg)

EDT + **diccionario de la EDT** + enunciado del alcance aprobados = **línea base del alcance**.`,
    },
    {
      id: ids.block(U, 4),
      type: 'imagen',
      position: 5,
      content: '/ovas/alcance-edt.svg|EDT de RutaCaribe en tres niveles: gestión del proyecto, plataforma de venta, aplicación móvil, integración de pagos y puesta en producción.',
    },
    {
      id: ids.block(U, 5),
      type: 'texto',
      position: 7,
      content: `## Controlar el alcance

Cambiar el alcance no es malo; hacerlo **sin control** sí lo es.

![Proceso de control de cambios en cuatro pasos, la triple restricción, la corrupción del alcance y el enchapado en oro](/ovas/alcance-control-cambios.svg)

Si el alcance crece, el tiempo o el costo deben ajustarse, o la calidad se resiente.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas rápidas sobre alcance del producto, del proyecto y el enunciado del alcance.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt: '¿Cuál de estos elementos pertenece al alcance del **producto** RutaCaribe?',
            options: [
              { id: 'a', text: 'Capacitar a los taquilleros en el nuevo sistema' },
              { id: 'b', text: 'Seleccionar la silla en un mapa del bus' },
              { id: 'c', text: 'Realizar reuniones semanales de seguimiento' },
              { id: 'd', text: 'Elaborar el plan de pruebas' },
            ],
            answer: 'b',
            explanation:
              'Seleccionar la silla es una función del producto. Capacitar, hacer reuniones y planear pruebas es trabajo del proyecto.',
          },
          {
            id: 'q2',
            prompt: '¿Por qué conviene escribir las **exclusiones** en el enunciado del alcance?',
            options: [
              { id: 'a', text: 'Porque el PMBOK exige que el documento tenga al menos tres secciones' },
              { id: 'b', text: 'Para reducir el presupuesto del proyecto' },
              { id: 'c', text: 'Para evitar malentendidos sobre lo que no se entregará' },
              { id: 'd', text: 'Para que el equipo pueda agregar funciones extra sin aprobación' },
            ],
            answer: 'c',
            explanation:
              'Las exclusiones fijan expectativas: lo que no está escrito como incluido suele darse por incluido.',
          },
          {
            id: 'q3',
            prompt: '¿Qué proceso responde a la pregunta *"¿el cliente acepta lo entregado?"*',
            options: [
              { id: 'a', text: 'Controlar el alcance' },
              { id: 'b', text: 'Validar el alcance' },
              { id: 'c', text: 'Definir el alcance' },
              { id: 'd', text: 'Recopilar requisitos' },
            ],
            answer: 'b',
            explanation: 'Validar el alcance formaliza la aceptación de los entregables por parte del cliente.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: 'Arma la EDT de RutaCaribe',
      description: 'Ubica cada elemento en la rama correcta de la EDT y aplica la regla del 100 %.',
      config: {
        position: 6,
        kind: 'edt',
        review_ai_activity_id: AI_ALCANCE.edtReview,
        instructions:
          'Arrastra cada elemento a la rama de la EDT a la que pertenece. Algunos elementos no deberían estar en la EDT: déjalos en la bandeja de descartes.',
        params: {
          branches: [
            { id: 'gestion', name: '1. Gestión del proyecto' },
            { id: 'web', name: '2. Plataforma web de venta' },
            { id: 'movil', name: '3. Aplicación móvil' },
            { id: 'pagos', name: '4. Integración de pagos' },
            { id: 'despliegue', name: '5. Puesta en producción' },
          ],
          items: [
            { id: 'i1', text: 'Acta de constitución', branch: 'gestion' },
            { id: 'i2', text: 'Informes de avance', branch: 'gestion' },
            { id: 'i3', text: 'Mapa de sillas del bus', branch: 'web' },
            { id: 'i4', text: 'Buscador de rutas y horarios', branch: 'web' },
            { id: 'i5', text: 'Tiquete digital con código QR', branch: 'movil' },
            { id: 'i6', text: 'Notificaciones de viaje', branch: 'movil' },
            { id: 'i7', text: 'Pasarela PSE', branch: 'pagos' },
            { id: 'i8', text: 'Conciliación de pagos con tesorería', branch: 'pagos' },
            { id: 'i9', text: 'Capacitación a taquilleros', branch: 'despliegue' },
            { id: 'i10', text: 'Migración de la base de clientes', branch: 'despliegue' },
            { id: 'i11', text: 'Venta de encomiendas', branch: null, reason: 'Está en las exclusiones del alcance.' },
            { id: 'i12', text: 'Programar el login', branch: null, reason: 'Es una actividad (verbo), no un entregable.' },
          ],
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: 'La petición del gerente',
      description: 'Analiza una solicitud de cambio en plena construcción y recibe retroalimentación de la IA con una rúbrica.',
      config: {
        position: 8,
        review_ai_activity_id: AI_ALCANCE.caseReview,
        variant_ai_activity_id: AI_ALCANCE.caseVariant,
        scenario: `RutaCaribe va en la **semana 7 de 16**. La línea base del alcance está aprobada y el equipo avanza según lo planeado.

En el comité semanal, el gerente de la cooperativa dice:

> *"Vi que la competencia ya vende encomiendas por su app. Necesito que RutaCaribe también lo haga. No debe ser difícil: es casi lo mismo que un tiquete, ¿no? Lo quiero en la misma fecha de lanzamiento."*

El líder técnico estima que el módulo de encomiendas requiere unas **5 semanas** de trabajo de dos desarrolladores. El enunciado del alcance lista la venta de encomiendas como **exclusión** explícita.`,
        questions: [
          {
            id: 'p1',
            prompt: '¿Esta petición es un cambio de alcance? Justifica tu respuesta con lo que dice la línea base.',
            placeholder: 'Sí / No, porque…',
          },
          {
            id: 'p2',
            prompt: 'Describe, paso a paso, cómo gestionarías la petición como director del proyecto.',
            placeholder: 'Primero… luego…',
          },
          {
            id: 'p3',
            prompt: '¿Qué impacto tendría aceptarla sin ajustar nada más? Usa la triple restricción.',
            placeholder: 'Si se mantiene la fecha y el presupuesto…',
          },
        ],
        rubric: [
          {
            id: 'c1',
            name: 'Identificación del cambio',
            description: 'Reconoce que es un cambio porque contradice una exclusión de la línea base.',
          },
          {
            id: 'c2',
            name: 'Proceso de control de cambios',
            description: 'Propone solicitud formal, análisis de impacto, decisión del CCB y actualización de líneas base.',
          },
          {
            id: 'c3',
            name: 'Análisis de impacto',
            description: 'Relaciona alcance, tiempo, costo y calidad con datos del caso (5 semanas, 2 desarrolladores).',
          },
          {
            id: 'c4',
            name: 'Comunicación con el interesado',
            description: 'Responde al gerente con alternativas (fase 2, más recursos, mover la fecha) sin rechazar de plano.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Sesión del Comité de Control de Cambios',
      description: 'Lee las posturas de tu equipo, aporta la tuya y obtén una síntesis de la decisión.',
      config: {
        position: 9,
        role: 'Líder técnico',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt:
          'El CCB debe decidir sobre la solicitud de agregar venta de encomiendas a RutaCaribe antes del lanzamiento. Cada integrante del comité presenta su postura.',
        contributions: [
          {
            author: 'Valentina Orozco',
            role: 'Product owner',
            text: 'Las encomiendas son el 18 % de los ingresos de la cooperativa. Si la competencia ya las vende, no tenerlas puede costarnos clientes. Propongo incluirlas, aunque sea con funciones mínimas.',
          },
          {
            author: 'Andrés Castillo',
            role: 'Analista de calidad',
            text: 'Si metemos el módulo sin mover la fecha, las pruebas de pagos se recortan. Ese es justo el módulo con más riesgo. No firmo un lanzamiento sin pruebas completas de PSE.',
          },
          {
            author: 'Mónica Ríos',
            role: 'Patrocinadora (gerencia financiera)',
            text: 'El presupuesto aprobado no tiene margen para contratar más desarrolladores este semestre. Cualquier opción que implique más personal necesita otra aprobación de la junta.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: gestión del alcance',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: '¿Qué conforma la **línea base del alcance**?',
            options: [
              { id: 'a', text: 'El acta de constitución y el registro de interesados' },
              { id: 'b', text: 'El enunciado del alcance, la EDT y su diccionario aprobados' },
              { id: 'c', text: 'El cronograma y el presupuesto aprobados' },
              { id: 'd', text: 'La matriz de trazabilidad de requisitos' },
            ],
          },
          {
            id: 'e2',
            prompt: 'Según la **regla del 100 %**, la EDT…',
            options: [
              { id: 'a', text: 'Debe completarse al 100 % antes de iniciar el proyecto' },
              { id: 'b', text: 'Incluye todo el trabajo del proyecto y nada más' },
              { id: 'c', text: 'Asigna el 100 % del presupuesto al primer nivel' },
              { id: 'd', text: 'Exige que cada paquete dure al menos 100 horas' },
            ],
          },
          {
            id: 'e3',
            prompt: '¿Cuál es el mejor nombre para un elemento de la EDT?',
            options: [
              { id: 'a', text: 'Programar el módulo de pagos' },
              { id: 'b', text: 'Revisar con el cliente' },
              { id: 'c', text: 'Módulo de pagos' },
              { id: 'd', text: 'Semana 3' },
            ],
          },
          {
            id: 'e4',
            prompt: 'El equipo agrega por iniciativa propia un modo oscuro que nadie solicitó. Esto es un ejemplo de…',
            options: [
              { id: 'a', text: 'Enchapado en oro (gold plating)' },
              { id: 'b', text: 'Validación del alcance' },
              { id: 'c', text: 'Corrupción del alcance por presión del cliente' },
              { id: 'd', text: 'Gestión adecuada de requisitos' },
            ],
          },
          {
            id: 'e5',
            prompt: '¿Quién aprueba o rechaza formalmente una solicitud de cambio?',
            options: [
              { id: 'a', text: 'El desarrollador que la implementará' },
              { id: 'b', text: 'El cliente que la solicita' },
              { id: 'c', text: 'El Comité de Control de Cambios' },
              { id: 'd', text: 'El analista de calidad' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.alcance,
    type: 'autoevaluacion',
    config: {
      questions: [
        {
          id: 'e1',
          correct_answer: 'b',
          feedback_incorrect: 'La línea base del alcance son el enunciado, la EDT y su diccionario aprobados.',
        },
        {
          id: 'e2',
          correct_answer: 'b',
          feedback_incorrect: 'La regla del 100 % pide que la EDT cubra todo el trabajo y nada más.',
        },
        {
          id: 'e3',
          correct_answer: 'c',
          feedback_incorrect: 'La EDT se orienta a entregables: usa sustantivos, no verbos ni fechas.',
        },
        {
          id: 'e4',
          correct_answer: 'a',
          feedback_incorrect: 'Agregar funciones que nadie pidió es enchapado en oro.',
        },
        {
          id: 'e5',
          correct_answer: 'c',
          feedback_incorrect: 'La decisión formal sobre un cambio corresponde al Comité de Control de Cambios.',
        },
      ],
    },
  },
}
