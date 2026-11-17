import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 8

export const AI_CIERRE = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  sequenceReview: ids.ai(U, 3),
}

export const cierre: CourseUnit = {
  ovaId: OVA_IDS.cierre,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## Terminar también se gestiona

RutaCaribe salió en vivo el 1 de diciembre. El equipo celebra… y empieza a dispersarse. Pero el proyecto **todavía no termina**: falta cerrarlo formalmente.

Un proyecto mal cerrado deja contratos abiertos, documentación perdida, un equipo de soporte que no sabe qué recibió y las mismas lecciones por aprender en el siguiente proyecto.

![Qué se cierra: el proyecto o la fase y los contratos con proveedores](/ovas/cierre-tipos.svg)`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## Aceptación y transferencia

El cierre empieza cuando el patrocinador **acepta formalmente** los entregables, contra los criterios de aceptación del enunciado del alcance.

Luego el producto se **transfiere** a quien lo va a operar: en RutaCaribe, el área de sistemas de la cooperativa recibe el código, los accesos, los manuales y un periodo de acompañamiento.

> Sin aceptación firmada, el proyecto puede seguir "abierto" para siempre con pedidos de último minuto.`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## Lecciones aprendidas

Las lecciones aprendidas son el conocimiento que **otros proyectos** pueden reutilizar. Una buena lección no es una queja: tiene causa y una recomendación accionable.

![Formato de una lección aprendida: situación, impacto, causa y recomendación, con un ejemplo de RutaCaribe](/ovas/cierre-lecciones.svg)

Se registran durante todo el proyecto y se consolidan en el cierre, en el **repositorio de la organización**.`,
    },
    {
      id: ids.block(U, 4),
      type: 'texto',
      position: 6,
      content: `## ¿Fue un éxito?

El informe final compara lo logrado con lo que prometió el acta:

![Criterios de éxito del proyecto: alcance aceptado, plazo, costo, calidad, satisfacción de interesados y beneficio esperado](/ovas/cierre-exito.svg)

Algunos beneficios, como el 30 % de ventas en línea, solo se miden **meses después**: el informe deja definido quién y cuándo lo hará. Con esto termina el ciclo de vida que empezó con el acta.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas sobre aceptación, transferencia y cierre de contratos.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt: '¿Contra qué se aceptan formalmente los entregables?',
            options: [
              { id: 'a', text: 'Contra la opinión del equipo' },
              { id: 'b', text: 'Contra los criterios de aceptación del enunciado del alcance' },
              { id: 'c', text: 'Contra el presupuesto gastado' },
              { id: 'd', text: 'Contra lo que tenga la competencia' },
            ],
            answer: 'b',
            explanation: 'Los criterios de aceptación acordados en la planificación son la vara para aceptar.',
          },
          {
            id: 'q2',
            prompt: 'La agencia de diseño UX entregó todo y se le hizo el último pago. Esto es…',
            options: [
              { id: 'a', text: 'Cierre del contrato' },
              { id: 'b', text: 'Control de calidad' },
              { id: 'c', text: 'Gestión de la configuración' },
              { id: 'd', text: 'Acción correctiva' },
            ],
            answer: 'a',
            explanation: 'Verificar la entrega, pagar y liberar al proveedor es cerrar el contrato.',
          },
          {
            id: 'q3',
            prompt: '¿Por qué se transfiere el producto al área de sistemas de la cooperativa?',
            options: [
              { id: 'a', text: 'Para que el equipo del proyecto pueda liberarse y alguien opere el sistema' },
              { id: 'b', text: 'Porque así lo exige el proveedor de pagos' },
              { id: 'c', text: 'Para empezar un proyecto nuevo' },
              { id: 'd', text: 'No es necesario transferirlo' },
            ],
            answer: 'a',
            explanation: 'El proyecto es temporal; la operación es permanente y la asume otra área.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: 'Ordena el cierre de RutaCaribe',
      description: 'Pon en orden los pasos para cerrar el proyecto.',
      config: {
        position: 5,
        kind: 'secuencia',
        review_ai_activity_id: AI_CIERRE.sequenceReview,
        instructions: 'Usa las flechas para ordenar los pasos del cierre, del primero al último.',
        params: {
          steps: [
            { id: 's1', text: 'Verificar que todos los entregables cumplen los criterios de aceptación', why: 'No se puede pedir aceptación de algo que no se verificó.' },
            { id: 's2', text: 'Obtener la aceptación formal firmada por la gerente', why: 'La aceptación formal habilita el resto del cierre.' },
            { id: 's3', text: 'Transferir el sistema, accesos y manuales al área de sistemas', why: 'Se transfiere lo que ya fue aceptado.' },
            { id: 's4', text: 'Cerrar los contratos con la agencia UX y el proveedor de hosting temporal', why: 'Los contratos se cierran cuando su trabajo ya fue recibido y transferido.' },
            { id: 's5', text: 'Hacer la sesión de lecciones aprendidas con el equipo', why: 'Se hace antes de liberar al equipo, mientras todos siguen disponibles.' },
            { id: 's6', text: 'Liberar al equipo y reconocer su trabajo', why: 'Se libera al equipo cuando ya no se necesita para el cierre.' },
            { id: 's7', text: 'Archivar la documentación y publicar el informe final', why: 'El informe final resume todo lo anterior: es el último paso.' },
          ],
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: 'El proyecto que no quería terminar',
      description: 'Dos meses después del lanzamiento, el proyecto sigue abierto. Ciérralo.',
      config: {
        position: 7,
        review_ai_activity_id: AI_CIERRE.caseReview,
        variant_ai_activity_id: AI_CIERRE.caseVariant,
        scenario: `Febrero. RutaCaribe salió el 1 de diciembre y funciona, pero el proyecto **sigue abierto**:

- La gerente nunca firmó la aceptación y cada semana pide "un ajustico" más.
- Dos desarrolladores siguen asignados "por si acaso" y la cooperativa les paga.
- El área de sistemas dice que no recibió los manuales y no sabe renovar el certificado SSL.
- La agencia UX reclama su último pago.
- Nadie documentó por qué la integración con PSE tomó el doble de lo estimado.

Las ventas en línea ya son el 18 % del total.`,
        questions: [
          { id: 'p1', prompt: '¿Qué pasos del cierre se omitieron y qué consecuencias está teniendo cada omisión?', placeholder: 'Se omitió…' },
          { id: 'p2', prompt: '¿Cómo manejarías los "ajusticos" de la gerente para poder cerrar?', placeholder: 'Con la gerente…' },
          { id: 'p3', prompt: 'Escribe una lección aprendida sobre la integración con PSE con situación, impacto, causa y recomendación.', placeholder: 'Situación… Impacto… Causa… Recomendación…' },
        ],
        rubric: [
          { id: 'c1', name: 'Pasos del cierre', description: 'Identifica aceptación, transferencia, cierre de contratos, lecciones y liberación del equipo como pendientes.' },
          { id: 'c2', name: 'Gestión del cliente', description: 'Separa lo que es garantía o defecto de lo que es alcance nuevo, que va a otro proyecto o al control de cambios.' },
          { id: 'c3', name: 'Lección aprendida', description: 'La lección tiene causa y una recomendación accionable para otros proyectos, no es una queja.' },
          { id: 'c4', name: 'Beneficios', description: 'Relaciona el 18 % con el objetivo del 30 % del acta y propone cómo y cuándo medirlo.' },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Retrospectiva final del proyecto',
      description: 'El equipo hace su última retrospectiva. Aporta una lección desde tu rol.',
      config: {
        position: 8,
        role: 'Director del proyecto',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt: 'El equipo de RutaCaribe se reúne por última vez para acordar qué lecciones dejarán en el repositorio de la cooperativa para el próximo proyecto.',
        contributions: [
          { author: 'Juan David Barrios', role: 'Líder técnico', text: 'Lo mejor fue la capa aislada de pagos: cuando PSE cambió su API solo tocamos un módulo. Recomiendo hacerlo con cualquier proveedor externo.' },
          { author: 'Andrés Castillo', role: 'Analista de calidad', text: 'Saltarnos las revisiones de código en la semana 9 nos costó tres semanas de corrección. La lección: la calidad no se negocia por fecha.' },
          { author: 'Camila Herrera', role: 'Diseñadora UX', text: 'Los taquilleros fueron nuestros mejores probadores. Debimos invitarlos desde el inicio y no en la semana 12.' },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: cierre',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: '¿Qué debe ocurrir antes de transferir el producto a operación?',
            options: [
              { id: 'a', text: 'Liberar al equipo' },
              { id: 'b', text: 'La aceptación formal de los entregables' },
              { id: 'c', text: 'Archivar la documentación' },
              { id: 'd', text: 'Iniciar el siguiente proyecto' },
            ],
          },
          {
            id: 'e2',
            prompt: '¿Cuál es una lección aprendida bien escrita?',
            options: [
              { id: 'a', text: 'PSE fue un desastre' },
              { id: 'b', text: 'El equipo trabajó mucho' },
              { id: 'c', text: 'La API de PSE no estaba documentada y la integración tardó el doble; en próximos proyectos, hacer una prueba técnica antes de estimar' },
              { id: 'd', text: 'Todo salió bien' },
            ],
          },
          {
            id: 'e3',
            prompt: '¿Por qué conviene hacer la sesión de lecciones aprendidas antes de liberar al equipo?',
            options: [
              { id: 'a', text: 'Porque así lo exige el contrato' },
              { id: 'b', text: 'Porque después las personas se dispersan y el conocimiento se pierde' },
              { id: 'c', text: 'Porque se cobra aparte' },
              { id: 'd', text: 'No importa el momento' },
            ],
          },
          {
            id: 'e4',
            prompt: 'Un beneficio como "30 % de ventas en línea a los seis meses" se mide…',
            options: [
              { id: 'a', text: 'El día del lanzamiento' },
              { id: 'b', text: 'Nunca: no es parte del proyecto' },
              { id: 'c', text: 'Después del cierre, por quien el informe final designe' },
              { id: 'd', text: 'Antes de firmar el acta' },
            ],
          },
          {
            id: 'e5',
            prompt: 'Verificar la entrega del proveedor, pagarle y liberarlo es…',
            options: [
              { id: 'a', text: 'Cerrar el contrato' },
              { id: 'b', text: 'Controlar el alcance' },
              { id: 'c', text: 'Desarrollar el equipo' },
              { id: 'd', text: 'Gestionar la configuración' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.cierre,
    type: 'autoevaluacion',
    config: {
      questions: [
        { id: 'e1', correct_answer: 'b', feedback_incorrect: 'Primero se aceptan formalmente los entregables; luego se transfieren a operación.' },
        { id: 'e2', correct_answer: 'c', feedback_incorrect: 'Una buena lección tiene situación, impacto, causa y una recomendación accionable.' },
        { id: 'e3', correct_answer: 'b', feedback_incorrect: 'Al liberar al equipo las personas se van a otros proyectos y el conocimiento se pierde.' },
        { id: 'e4', correct_answer: 'c', feedback_incorrect: 'Los beneficios se materializan después; el informe final define quién y cuándo los mide.' },
        { id: 'e5', correct_answer: 'a', feedback_incorrect: 'Verificar, pagar y liberar al proveedor es el cierre del contrato (adquisiciones).' },
      ],
    },
  },
}
