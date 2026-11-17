// Initial rows for the local adapters. IDs are fixed so the same records can
// be loaded into the microservices' databases and stay consistent with the
// frontend (e.g. evaluations reference these OVA ids).
//
// Bump SEED_VERSION whenever these rows change: seeded rows are refreshed and
// rows created by people are kept.

export const SEED_VERSION = 7

const PASSWORD_HASH = 'pbkdf2-sha256$100000$S_7ReoFH-BcJihT5mBE5sw$j0WRgmKUt-R2AZ0D-0bRqfvRAujD_6Yx9rpi3cwFz8c'

export { OVA_IDS } from '../../content/ids'
import { OVA_IDS } from '../../content/ids'
import { COURSE_UNITS } from '../../content'

export const USER_IDS = {
  docente: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10',
  administrador: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b11',
  validador: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b12',
  estudiante: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b20',
} as const

// Course group 2026-2. Same rows as deploy/local/seed/identity_users.sql.
export const STUDENTS: Array<[id: string, email: string, fullName: string]> = [
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b20', 'laura.martinez@unicartagena.edu.co', 'Laura Martínez Gómez'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b21', 'andres.castillo@unicartagena.edu.co', 'Andrés Castillo Pérez'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b22', 'valentina.orozco@unicartagena.edu.co', 'Valentina Orozco Ruiz'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b23', 'juan.barrios@unicartagena.edu.co', 'Juan David Barrios Mendoza'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b24', 'camila.herrera@unicartagena.edu.co', 'Camila Herrera Julio'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b25', 'santiago.pineda@unicartagena.edu.co', 'Santiago Pineda Arrieta'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b26', 'mariana.lopez@unicartagena.edu.co', 'Mariana López Villadiego'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b27', 'sebastian.marrugo@unicartagena.edu.co', 'Sebastián Marrugo Cassiani'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b28', 'daniela.acosta@unicartagena.edu.co', 'Daniela Acosta Blanco'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b29', 'nicolas.guerrero@unicartagena.edu.co', 'Nicolás Guerrero Torres'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b2a', 'isabella.cabarcas@unicartagena.edu.co', 'Isabella Cabarcas Díaz'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b2b', 'mateo.puello@unicartagena.edu.co', 'Mateo Puello Morales'],
  ['0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b2c', 'sofia.ramos@unicartagena.edu.co', 'Sofía Ramos Carmona'],
]

type Row = { id: string } & Record<string, unknown>

export function seedTables(): Record<string, Row[]> {
  const units = COURSE_UNITS
  const created = '2026-09-01T13:00:00Z'
  return {
    content_blocks: units.flatMap((unit) => unit.blocks.map((block) => ({ ...block, ova_id: unit.ovaId }))),
    // content-service keeps a summary of each activity (spec 7.2).
    ova_activities: units.flatMap((unit) =>
      unit.activities.map(({ id, title, description, config }) => ({
        id,
        ova_id: unit.ovaId,
        title,
        description,
        is_ai: Object.keys(config).some((key) => key.endsWith('ai_activity_id')),
      })),
    ),
    activities: units.flatMap((unit) =>
      unit.activities.map((activity) => ({ ...activity, ova_id: unit.ovaId, created_at: created })),
    ),
    evaluations: units.map((unit) => ({ ...unit.evaluation })),
    progress: groupProgress(),
    users: [
      user(USER_IDS.docente, 'docente.gpi@unicartagena.edu.co', 'Carlos Herrera Díaz', 'docente'),
      user(USER_IDS.administrador, 'admin.ova@unicartagena.edu.co', 'Mónica Ríos Pacheco', 'administrador'),
      user(USER_IDS.validador, 'validacion.ova@unicartagena.edu.co', 'Andrés Villalba Torres', 'validador'),
      ...STUDENTS.map(([id, email, fullName]) => user(id, email, fullName, 'estudiante')),
    ],
    ovas: [
      {
        id: OVA_IDS.alcance,
        title: 'Gestión del alcance',
        description:
          'Define qué entra y qué no entra en un proyecto de software: requisitos, enunciado del alcance y la Estructura de Desglose del Trabajo (EDT).',
        learning_outcome:
          'Construye una EDT orientada a entregables a partir de un enunciado de alcance y controla los cambios mediante el proceso formal.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-09-01T13:00:00Z',
      },
      {
        id: OVA_IDS.cronograma,
        title: 'Gestión del cronograma',
        description:
          'Secuencia actividades, estima duraciones y encuentra la ruta crítica de un proyecto con el método CPM y diagramas de Gantt.',
        learning_outcome:
          'Calcula la ruta crítica y las holguras de una red de actividades y explica el impacto de un retraso en la fecha de entrega.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-09-02T13:00:00Z',
      },
      {
        id: OVA_IDS.costos,
        title: 'Gestión de costos',
        description:
          'Estima, presupuesta y controla los costos de un proyecto con la técnica de Valor Ganado (EVM): PV, EV, AC, CPI, SPI y pronósticos.',
        learning_outcome:
          'Interpreta los indicadores de valor ganado de un proyecto en curso y pronostica su costo final (EAC) para tomar decisiones correctivas.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-09-03T13:00:00Z',
      },
      {
        id: OVA_IDS.riesgos,
        title: 'Gestión de riesgos',
        description:
          'Identifica, analiza y planifica respuestas a los riesgos de un proyecto informático con la matriz de probabilidad e impacto.',
        learning_outcome:
          'Prioriza los riesgos de un proyecto con análisis cualitativo y propone respuestas adecuadas para amenazas y oportunidades.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-09-04T13:00:00Z',
      },
      {
        id: OVA_IDS.inicio,
        title: 'Inicio y planificación del proyecto',
        description:
          'Recorre el ciclo de vida de un proyecto informático, redacta el acta de constitución, identifica a los interesados y arma el plan para la dirección.',
        learning_outcome:
          'Formula el acta de constitución con objetivos medibles y clasifica a los interesados según su poder e interés para planificar su gestión.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-08-31T13:00:00Z',
      },
      {
        id: OVA_IDS.ejecucion,
        title: 'Ejecución del proyecto',
        description:
          'Dirige al equipo, asigna responsabilidades con la matriz RACI, planifica las comunicaciones y gestiona la calidad mientras se construye el producto.',
        learning_outcome:
          'Reconoce la etapa de desarrollo de un equipo y propone acciones de dirección, comunicación y calidad acordes con la situación del proyecto.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-09-05T13:00:00Z',
      },
      {
        id: OVA_IDS.cambios,
        title: 'Monitoreo, control y gestión de cambios',
        description:
          'Mide el desempeño con informes semáforo, gestiona solicitudes de cambio con el comité y mantiene las líneas base bajo control de configuración.',
        learning_outcome:
          'Clasifica solicitudes de cambio y las gestiona con el control integrado de cambios, sustentando el análisis de impacto ante el comité.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-09-06T13:00:00Z',
      },
      {
        id: OVA_IDS.cierre,
        title: 'Cierre del proyecto',
        description:
          'Obtén la aceptación formal, transfiere el producto, cierra contratos, registra lecciones aprendidas y evalúa el éxito del proyecto.',
        learning_outcome:
          'Ejecuta el cierre ordenado de un proyecto y redacta lecciones aprendidas accionables que otros proyectos puedan reutilizar.',
        status: 'publicado',
        created_by: USER_IDS.docente,
        created_at: '2026-09-07T13:00:00Z',
      },
    ],
  }
}

function user(id: string, email: string, full_name: string, role: string) {
  return { id, email, full_name, role, password_hash: PASSWORD_HASH, created_at: '2026-08-20T15:00:00Z' }
}

// Progress of the rest of the course group, so the teacher dashboard reflects
// a class already working through the path (tracking-service, spec 7.6).
const GROUP_PROGRESS: Array<[number, number, number, number, number, number, number, number]> = [
  // inicio, alcance, cronograma, costos, riesgos, ejecución, cambios, cierre (percent; -1 = not started)
  [100, 100, 100, 64, 18, -1, -1, -1],
  [100, 100, 82, 27, -1, -1, -1, -1],
  [100, 100, 100, 100, 100, 60, 20, -1],
  [100, 73, 18, -1, -1, -1, -1, -1],
  [100, 100, 91, 45, -1, -1, -1, -1],
  [82, 36, -1, -1, -1, -1, -1, -1],
  [100, 100, 100, 82, 9, -1, -1, -1],
  [100, 100, 55, -1, -1, -1, -1, -1],
  [45, 9, -1, -1, -1, -1, -1, -1],
  [100, 100, 100, 100, 100, 100, 100, 71],
  [100, 91, 27, -1, -1, -1, -1, -1],
  [100, 100, 73, 9, -1, -1, -1, -1],
]

function groupProgress(): Row[] {
  const order = [
    OVA_IDS.inicio, OVA_IDS.alcance, OVA_IDS.cronograma, OVA_IDS.costos,
    OVA_IDS.riesgos, OVA_IDS.ejecucion, OVA_IDS.cambios, OVA_IDS.cierre,
  ]
  return STUDENTS.slice(1).flatMap(([studentId], row) =>
    GROUP_PROGRESS[row].flatMap((percent, column) =>
      percent < 0
        ? []
        : [
            {
              id: `9e0d1c2b-0000-4000-8000-${(row * 10 + column).toString().padStart(12, '0')}`,
              student_id: studentId,
              ova_id: order[column],
              status: percent >= 100 ? 'completado' : 'en_progreso',
              percent_complete: percent,
              last_accessed_at: new Date(Date.UTC(2026, 9, 14 - ((row + column) % 9), 14 + (row % 6), 10 * column)).toISOString().replace(/\.\d{3}Z$/, 'Z'),
            },
          ],
    ),
  )
}
