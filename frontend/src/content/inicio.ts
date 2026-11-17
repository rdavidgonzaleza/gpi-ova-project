import { OVA_IDS, SHARED_AI, ids } from './ids'
import type { CourseUnit } from './types'

const U = 5

export const AI_INICIO = {
  caseReview: ids.ai(U, 1),
  caseVariant: ids.ai(U, 2),
  stakeholdersReview: ids.ai(U, 3),
}

export const inicio: CourseUnit = {
  ovaId: OVA_IDS.inicio,
  blocks: [
    {
      id: ids.block(U, 1),
      type: 'texto',
      position: 1,
      content: `## El proyecto que nos acompaña

La **Cooperativa de Transportes Brisas del Caribe** vende tiquetes en taquilla y por WhatsApp. La gerencia quiere **RutaCaribe**: comprar tiquetes, elegir silla y pagar en línea.

Tú serás su director de proyecto. En ocho OVA recorrerás el **ciclo de vida completo**: lo inicias, lo planificas, lo ejecutas, controlas sus cambios y lo cierras.

![Ciclo de vida del proyecto: inicio, planificación, ejecución y cierre, con monitoreo y control durante todo el proyecto](/ovas/inicio-ciclo-vida.svg)

> Un proyecto es temporal y crea un resultado único. Por eso tiene un inicio formal y un cierre formal.`,
    },
    {
      id: ids.block(U, 2),
      type: 'texto',
      position: 2,
      content: `## El acta de constitución

El proyecto **existe** cuando el patrocinador firma el **acta de constitución**. Ese documento lo autoriza y le da al director la autoridad para usar recursos.

![Contenido del acta de constitución: propósito, objetivos medibles, requisitos de alto nivel, hitos y presupuesto resumido, riesgos iniciales y autoridad del director](/ovas/inicio-acta.svg)

Los objetivos deben ser **medibles**: "vender el 30 % de los tiquetes en línea a los seis meses", no "modernizar la venta".`,
    },
    {
      id: ids.block(U, 3),
      type: 'texto',
      position: 4,
      content: `## Identificar a los interesados

Un **interesado** es cualquier persona u organización que afecta el proyecto o se ve afectada por él: la gerente, los taquilleros, los pasajeros, el proveedor de pagos, la Superintendencia de Transporte.

Se registran en el **registro de interesados** y se ubican según su **poder** sobre el proyecto y su **interés** en él:

![Matriz de poder e interés con las cuatro estrategias de gestión de interesados](/ovas/inicio-interesados.svg)

Un interesado olvidado al inicio suele aparecer al final… con un requisito nuevo.`,
    },
    {
      id: ids.block(U, 4),
      type: 'texto',
      position: 6,
      content: `## El plan para la dirección del proyecto

Planificar es decidir **cómo** se va a lograr lo que autorizó el acta. El resultado es el **plan para la dirección del proyecto**: integra las líneas base y los planes de cada área.

![El plan para la dirección integra las líneas base de alcance, cronograma y costos con los planes subsidiarios](/ovas/inicio-plan.svg)

La planificación es **gradual** (*elaboración progresiva*): se detalla lo cercano y se deja más general lo lejano. En los próximos OVA construirás cada línea base: alcance, cronograma, costos y riesgos.`,
    },
  ],
  activities: [
    {
      id: ids.activity(U, 1),
      type: 'quiz',
      title: 'Comprueba los conceptos',
      description: 'Tres preguntas sobre el ciclo de vida y el acta de constitución.',
      config: {
        position: 3,
        hints_ai_activity_id: SHARED_AI.hints,
        questions: [
          {
            id: 'q1',
            prompt: '¿Qué documento **autoriza formalmente** el proyecto RutaCaribe?',
            options: [
              { id: 'a', text: 'El plan para la dirección del proyecto' },
              { id: 'b', text: 'El acta de constitución' },
              { id: 'c', text: 'El registro de interesados' },
              { id: 'd', text: 'El contrato con el proveedor de pagos' },
            ],
            answer: 'b',
            explanation: 'El acta, firmada por el patrocinador, autoriza el proyecto y da autoridad al director.',
          },
          {
            id: 'q2',
            prompt: '¿Cuál es un objetivo **bien escrito** para el acta?',
            options: [
              { id: 'a', text: 'Modernizar la venta de tiquetes' },
              { id: 'b', text: 'Hacer la mejor app de transporte del Caribe' },
              { id: 'c', text: 'Vender el 30 % de los tiquetes en línea seis meses después del lanzamiento' },
              { id: 'd', text: 'Usar tecnología de punta' },
            ],
            answer: 'c',
            explanation: 'Un objetivo útil es medible y tiene plazo: se puede comprobar si se cumplió.',
          },
          {
            id: 'q3',
            prompt: '¿Qué grupo de procesos ocurre **durante todo** el proyecto?',
            options: [
              { id: 'a', text: 'Inicio' },
              { id: 'b', text: 'Ejecución' },
              { id: 'c', text: 'Monitoreo y control' },
              { id: 'd', text: 'Cierre' },
            ],
            answer: 'c',
            explanation: 'El monitoreo y control acompaña a las demás fases: compara lo real con lo planeado en todo momento.',
          },
        ],
      },
    },
    {
      id: ids.activity(U, 2),
      type: 'simulacion',
      title: 'Mapa de interesados de RutaCaribe',
      description: 'Ubica a cada interesado en la matriz de poder e interés.',
      config: {
        position: 5,
        kind: 'clasificacion',
        review_ai_activity_id: AI_INICIO.stakeholdersReview,
        instructions: 'Lee cada interesado y decide su cuadrante según su poder sobre el proyecto y su interés en él.',
        params: {
          categories: [
            { id: 'cerca', name: 'Gestionar de cerca', hint: 'Mucho poder · mucho interés' },
            { id: 'satisfecho', name: 'Mantener satisfecho', hint: 'Mucho poder · poco interés' },
            { id: 'informado', name: 'Mantener informado', hint: 'Poco poder · mucho interés' },
            { id: 'monitorear', name: 'Monitorear', hint: 'Poco poder · poco interés' },
          ],
          items: [
            { id: 'i1', text: 'Gerente general de la cooperativa, patrocinadora que firmó el acta', category: 'cerca', reason: 'Aprueba el presupuesto y sigue el proyecto cada semana.' },
            { id: 'i2', text: 'Junta directiva, que solo revisa el proyecto en su informe trimestral', category: 'satisfecho', reason: 'Puede cancelar el proyecto, pero no sigue el día a día.' },
            { id: 'i3', text: 'Taquilleros, que temen que la venta en línea reduzca su trabajo', category: 'informado', reason: 'Les afecta mucho, pero no deciden sobre el proyecto: hay que informarlos y acompañarlos.' },
            { id: 'i4', text: 'Pasajeros frecuentes que piden comprar desde el celular', category: 'informado', reason: 'Son los usuarios finales y les interesa mucho, aunque no tienen autoridad sobre el proyecto.' },
            { id: 'i5', text: 'Superintendencia de Transporte, que regula la venta de tiquetes', category: 'satisfecho', reason: 'Su norma es obligatoria, pero no participa en el proyecto: basta con cumplirla y consultarla.' },
            { id: 'i6', text: 'Proveedor de la pasarela PSE, del que depende el pago en línea', category: 'cerca', reason: 'Su integración está en la ruta crítica y tiene mucho interés comercial.' },
            { id: 'i7', text: 'Empresa de aseo que limpia las oficinas de la cooperativa', category: 'monitorear', reason: 'Ni el proyecto la afecta ni ella lo afecta.' },
            { id: 'i8', text: 'Conductores de los buses', category: 'monitorear', reason: 'El sistema casi no cambia su trabajo; basta con observar si eso cambia.' },
          ],
        },
      },
    },
    {
      id: ids.activity(U, 3),
      type: 'caso_estudio',
      title: 'El acta que nadie firmó',
      description: 'El equipo ya empezó a programar sin acta. Ayuda a ordenar el inicio del proyecto.',
      config: {
        position: 7,
        review_ai_activity_id: AI_INICIO.caseReview,
        variant_ai_activity_id: AI_INICIO.caseVariant,
        scenario: `La gerente general de Brisas del Caribe le dijo al jefe de sistemas en un pasillo: *"Hagan una app para vender tiquetes, que la competencia ya tiene una"*. Dos desarrolladores empezaron a programar al día siguiente.

Tres semanas después:
- La contadora pregunta quién autorizó comprar un servidor en la nube.
- El jefe de taquilla se enteró por un pasajero y está molesto.
- Nadie sabe si la app debe vender también las rutas intermunicipales a Sincelejo.
- La gerente pregunta cuándo estará lista y cuánto va a costar.

Te nombran director del proyecto para "poner orden".`,
        questions: [
          { id: 'p1', prompt: '¿Qué problemas del caso se explican por la falta de un acta de constitución?', placeholder: 'Sin acta…' },
          { id: 'p2', prompt: 'Redacta los elementos clave del acta de RutaCaribe: propósito, dos objetivos medibles y dos requisitos de alto nivel.', placeholder: 'Propósito… Objetivos… Requisitos…' },
          { id: 'p3', prompt: '¿Qué harías con el jefe de taquilla y con los desarrolladores esta semana?', placeholder: 'Con el jefe de taquilla… Con los desarrolladores…' },
        ],
        rubric: [
          { id: 'c1', name: 'Diagnóstico', description: 'Relaciona los problemas (autoridad para gastar, alcance difuso, plazos) con la ausencia del acta.' },
          { id: 'c2', name: 'Objetivos medibles', description: 'Propone objetivos con métrica y plazo, y requisitos de alto nivel coherentes con el caso.' },
          { id: 'c3', name: 'Interesados', description: 'Reconoce al jefe de taquilla como interesado clave y propone cómo involucrarlo.' },
          { id: 'c4', name: 'Orden del inicio', description: 'Propone formalizar antes de seguir: firma del acta, alcance inicial y plan, sin descartar el trabajo útil ya hecho.' },
        ],
      },
    },
    {
      id: ids.activity(U, 4),
      type: 'colaborativa',
      title: 'Reunión de arranque (kickoff)',
      description: 'El equipo discute cómo planificar RutaCaribe. Aporta desde tu rol.',
      config: {
        position: 8,
        role: 'Director del proyecto',
        synthesis_ai_activity_id: SHARED_AI.teamSynthesis,
        prompt: 'Con el acta firmada, el equipo se reúne para decidir cuánto planificar antes de empezar a construir RutaCaribe y cómo mantener informados a los interesados.',
        contributions: [
          { author: 'Valentina Orozco', role: 'Product owner', text: 'Propongo trabajar con sprints de dos semanas y planificar en detalle solo el primero. Lo demás lo iremos descubriendo con los usuarios.' },
          { author: 'Andrés Castillo', role: 'Analista de calidad', text: 'La gerente necesita una fecha y un presupuesto para diciembre. Sin un plan con líneas base no vamos a poder decir si vamos atrasados.' },
          { author: 'Daniela Acosta', role: 'Administradora de infraestructura', text: 'Me preocupa que nadie haya hablado con la Superintendencia. Si la norma exige factura electrónica en cada tiquete, eso cambia todo el plan.' },
        ],
      },
    },
    {
      id: ids.activity(U, 5),
      type: 'quiz',
      title: 'Autoevaluación: inicio y planificación',
      description: 'Cinco preguntas calificadas. Tu resultado queda en tu historial.',
      config: {
        position: 100,
        evaluation_id: ids.evaluation(U),
        explain_ai_activity_id: SHARED_AI.explainMistakes,
        questions: [
          {
            id: 'e1',
            prompt: '¿Quién firma el acta de constitución?',
            options: [
              { id: 'a', text: 'El director del proyecto' },
              { id: 'b', text: 'El equipo de desarrollo' },
              { id: 'c', text: 'El patrocinador' },
              { id: 'd', text: 'Los usuarios finales' },
            ],
          },
          {
            id: 'e2',
            prompt: 'Un interesado con mucho poder y poco interés en el proyecto se debe…',
            options: [
              { id: 'a', text: 'Gestionar de cerca' },
              { id: 'b', text: 'Mantener satisfecho' },
              { id: 'c', text: 'Mantener informado' },
              { id: 'd', text: 'Ignorar' },
            ],
          },
          {
            id: 'e3',
            prompt: '¿Qué integra el plan para la dirección del proyecto?',
            options: [
              { id: 'a', text: 'Solo el cronograma' },
              { id: 'b', text: 'Las líneas base y los planes subsidiarios de cada área' },
              { id: 'c', text: 'El código fuente y los manuales' },
              { id: 'd', text: 'El acta y el contrato' },
            ],
          },
          {
            id: 'e4',
            prompt: 'Detallar primero lo cercano y dejar general lo lejano se llama…',
            options: [
              { id: 'a', text: 'Elaboración progresiva' },
              { id: 'b', text: 'Enchapado en oro' },
              { id: 'c', text: 'Ejecución rápida' },
              { id: 'd', text: 'Corrupción del alcance' },
            ],
          },
          {
            id: 'e5',
            prompt: '¿Cuál de estos es un interesado del proyecto RutaCaribe?',
            options: [
              { id: 'a', text: 'Solo quien paga el proyecto' },
              { id: 'b', text: 'Solo el equipo de desarrollo' },
              { id: 'c', text: 'Cualquiera que afecte el proyecto o se vea afectado por él' },
              { id: 'd', text: 'Solo los usuarios que compran tiquetes' },
            ],
          },
        ],
      },
    },
  ],
  evaluation: {
    id: ids.evaluation(U),
    ova_id: OVA_IDS.inicio,
    type: 'autoevaluacion',
    config: {
      questions: [
        { id: 'e1', correct_answer: 'c', feedback_incorrect: 'El patrocinador firma el acta: autoriza el proyecto y le da autoridad al director.' },
        { id: 'e2', correct_answer: 'b', feedback_incorrect: 'Mucho poder y poco interés: mantener satisfecho, sin saturarlo de información.' },
        { id: 'e3', correct_answer: 'b', feedback_incorrect: 'El plan para la dirección integra las líneas base de alcance, cronograma y costos y los planes de cada área.' },
        { id: 'e4', correct_answer: 'a', feedback_incorrect: 'La elaboración progresiva detalla el plan a medida que se conoce más.' },
        { id: 'e5', correct_answer: 'c', feedback_incorrect: 'Un interesado es cualquier persona u organización que afecta el proyecto o se ve afectada por él.' },
      ],
    },
  },
}
