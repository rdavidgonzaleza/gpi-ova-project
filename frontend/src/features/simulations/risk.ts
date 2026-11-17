export type Level = 1 | 2 | 3
export type Zone = 'alta' | 'media' | 'baja'

export interface Risk {
  id: string
  text: string
  type: 'amenaza' | 'oportunidad'
  probability: Level
  impact: Level
  responses: string[]
  reason: string
}

export interface RiskAnswer {
  p?: Level
  i?: Level
  r?: string
}

export const LEVELS: Array<{ value: Level; label: string }> = [
  { value: 1, label: 'Baja' },
  { value: 2, label: 'Media' },
  { value: 3, label: 'Alta' },
]

export const RESPONSES = {
  amenaza: ['evitar', 'transferir', 'mitigar', 'aceptar'],
  oportunidad: ['explotar', 'compartir', 'mejorar', 'aceptar'],
} as const

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** Priority zone of a 3×3 probability–impact matrix (spec: 6–9 alta, 3–4 media, 1–2 baja). */
export function zone(p: number, i: number): Zone {
  const score = p * i
  return score >= 6 ? 'alta' : score >= 3 ? 'media' : 'baja'
}

export function grade(risk: Risk, answer: RiskAnswer | undefined) {
  const zoneOk = Boolean(answer?.p && answer?.i && zone(answer.p, answer.i) === zone(risk.probability, risk.impact))
  const responseOk = Boolean(answer?.r && risk.responses.includes(answer.r))
  return { zoneOk, responseOk, ok: zoneOk && responseOk }
}
