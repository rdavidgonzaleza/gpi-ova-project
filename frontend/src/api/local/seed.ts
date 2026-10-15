// Initial rows for the local adapters. IDs are fixed so the same records can
// be loaded into the microservices' databases and stay consistent with the
// frontend (e.g. evaluations reference these OVA ids).
//
// Bump SEED_VERSION whenever these rows change: seeded rows are refreshed and
// rows created by people are kept.

export const SEED_VERSION = 1

const PASSWORD_HASH = 'pbkdf2-sha256$100000$S_7ReoFH-BcJihT5mBE5sw$j0WRgmKUt-R2AZ0D-0bRqfvRAujD_6Yx9rpi3cwFz8c'

export const OVA_IDS = {
  alcance: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01',
  cronograma: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02',
  costos: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03',
  riesgos: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04',
} as const

export const USER_IDS = {
  docente: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b10',
  administrador: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b11',
  validador: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b12',
  estudiante: '0b6f8a52-7c1e-4d3a-8f2b-5e9c1d7a3b20',
} as const

type Row = { id: string } & Record<string, unknown>

export function seedTables(): Record<string, Row[]> {
  return {
    users: [
      user(USER_IDS.docente, 'docente.gpi@unicartagena.edu.co', 'Carlos Herrera Díaz', 'docente'),
      user(USER_IDS.administrador, 'admin.ova@unicartagena.edu.co', 'Mónica Ríos Pacheco', 'administrador'),
      user(USER_IDS.validador, 'validacion.ova@unicartagena.edu.co', 'Andrés Villalba Torres', 'validador'),
      user(USER_IDS.estudiante, 'laura.martinez@unicartagena.edu.co', 'Laura Martínez Gómez', 'estudiante'),
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
    ],
  }
}

function user(id: string, email: string, full_name: string, role: string) {
  return { id, email, full_name, role, password_hash: PASSWORD_HASH, created_at: '2026-08-20T15:00:00Z' }
}
