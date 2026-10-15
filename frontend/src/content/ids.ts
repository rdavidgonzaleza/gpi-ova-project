// Deterministic UUID v4-shaped ids for course content, so the same records can
// be loaded into every service database (see scripts/export-seed.ts).

export const OVA_IDS = {
  alcance: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a01',
  cronograma: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a02',
  costos: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a03',
  riesgos: '6f1c2a3e-1b7d-4c55-9a0e-2d4b8e7f1a04',
} as const

const KIND = { block: 1, activity: 2, evaluation: 3, ai: 4 } as const

function uid(kind: keyof typeof KIND, unit: number, seq: number) {
  return `c0a7e17d-0000-4000-8${KIND[kind]}${unit}0-${seq.toString().padStart(12, '0')}`
}

export const ids = {
  block: (unit: number, seq: number) => uid('block', unit, seq),
  activity: (unit: number, seq: number) => uid('activity', unit, seq),
  evaluation: (unit: number) => uid('evaluation', unit, 1),
  ai: (unit: number, seq: number) => uid('ai', unit, seq),
}

/** AI activities shared by every OVA (unit 0). */
export const SHARED_AI = {
  hints: ids.ai(0, 1),
  explainMistakes: ids.ai(0, 2),
  recap: ids.ai(0, 3),
  teamSynthesis: ids.ai(0, 4),
  questionDrafts: ids.ai(0, 5),
} as const
