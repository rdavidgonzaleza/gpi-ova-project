import { processGrid, twoColumns } from './layouts'
import { Svg } from './svg'

export const riesgoProblema = () => {
  const W = 800
  const H = 270
  const svg = new Svg(W, H, 'Riesgo frente a problema')
  svg.path(`M30 120 H770`, 'dg-line')
  svg.diamond(400, 120, 11)
  svg.text(400, 96, 'Hoy', { size: 15, weight: 700, anchor: 'middle', cls: 'dg-ta' })

  svg.rect(24, 170, 340, 84, 'dg-box', 16)
  svg.text(44, 202, 'Problema (issue)', { size: 16, weight: 650 })
  svg.text(44, 228, 'Ya ocurrió: se resuelve, no se “gestiona”.', { size: 13.5, cls: 'dg-t2' })
  svg.text(194, 146, '← Pasado', { size: 13, cls: 'dg-t3', anchor: 'middle' })

  svg.text(606, 146, 'Futuro incierto →', { size: 13, cls: 'dg-t3', anchor: 'middle' })
  svg.rect(436, 16, 160, 84, 'dg-danger-soft', 16)
  svg.text(452, 48, 'Amenaza', { size: 16, weight: 650, cls: 'dg-td' })
  svg.text(452, 74, 'Si ocurre, perjudica', { size: 13, cls: 'dg-t2' })
  svg.rect(612, 16, 168, 84, 'dg-success-soft', 16)
  svg.text(628, 48, 'Oportunidad', { size: 16, weight: 650, cls: 'dg-ts' })
  svg.text(628, 74, 'Si ocurre, beneficia', { size: 13, cls: 'dg-t2' })
  svg.rect(436, 170, 344, 84, 'dg-accent-soft', 16)
  svg.text(452, 202, 'Riesgo', { size: 16, weight: 650, cls: 'dg-ta' })
  svg.text(452, 228, 'Evento incierto que afectaría un objetivo.', { size: 13.5, cls: 'dg-t2' })
  return svg
}

export const procesos = () =>
  processGrid(
    'Los siete procesos de la gestión de riesgos',
    [
      { title: 'Planificar', body: '¿Cómo\ngestionaremos\nlos riesgos?' },
      { title: 'Identificar', body: '¿Qué podría pasar?' },
      { title: 'Cualitativo', body: '¿Cuáles importan\nmás?' },
      { title: 'Cuantitativo', body: '¿Cuánto afectan\nen costo y plazo?' },
      { title: 'Responder', body: '¿Qué haremos con\ncada uno?', tone: 'success' },
      { title: 'Implementar', body: '¿Hicimos lo que\nplaneamos?', tone: 'success' },
      { title: 'Monitorear', body: '¿Qué cambió? ¿Hay\nriesgos nuevos?', tone: 'warning' },
    ],
    { cols: 4, cardH: 130, legend: 'Todo queda en el registro de riesgos: probabilidad, impacto, prioridad, responsable y respuesta' },
  )

export const enunciado = () => {
  const W = 800
  const H = 200
  const svg = new Svg(W, H, 'Cómo escribir un riesgo: causa, riesgo y efecto')
  const parts: Array<[string, string, string, string]> = [
    ['Causa', 'La documentación de la\nAPI de PSE está\ndesactualizada', 'dg-box', 'dg-t2'],
    ['Riesgo', 'La integración puede\ntomar más tiempo del\nestimado', 'dg-accent-soft', 'dg-ta'],
    ['Efecto', 'Se retrasarían las\npruebas integrales', 'dg-danger-soft', 'dg-td'],
  ]
  const w = 222
  const gap = (W - 32 - 3 * w) / 2
  parts.forEach(([title, body, cls, ink], i) => {
    const x = 16 + i * (w + gap)
    svg.rect(x, 24, w, 150, cls, 16)
    svg.text(x + 20, 58, title, { size: 17, weight: 700, cls: ink })
    svg.text(x + 20, 92, body, { size: 14, cls: 'dg-t' })
    if (i < 2) svg.arrow(x + w + 4, 99, x + w + gap - 4, 99)
  })
  svg.text(16 + w + gap / 2, 18, 'debido a', { size: 12.5, cls: 'dg-t3', anchor: 'middle' })
  svg.text(16 + 2 * w + 1.5 * gap, 18, 'lo que', { size: 12.5, cls: 'dg-t3', anchor: 'middle' })
  return svg
}

/** Matriz 3 × 3 de probabilidad e impacto con zonas de prioridad. */
export const matriz = () => {
  const W = 800
  const H = 400
  const svg = new Svg(W, H, 'Matriz de probabilidad e impacto')
  const x0 = 150
  const y0 = 20
  const c = 100
  const zone = (score: number) => (score >= 6 ? 'dg-danger-soft' : score >= 3 ? 'dg-warning-soft' : 'dg-success-soft')
  const ink = (score: number) => (score >= 6 ? 'dg-td' : score >= 3 ? 'dg-tw' : 'dg-ts')
  const levels = ['Baja', 'Media', 'Alta']
  for (let p = 3; p >= 1; p--) {
    for (let i = 1; i <= 3; i++) {
      const x = x0 + (i - 1) * c
      const y = y0 + (3 - p) * c
      const score = p * i
      svg.rect(x + 3, y + 3, c - 6, c - 6, zone(score), 12)
      svg.text(x + c / 2, y + c / 2 + 9, String(score), { size: 26, weight: 700, anchor: 'middle', cls: ink(score) })
    }
    svg.text(x0 - 14, y0 + (3 - p) * c + c / 2 + 5, `${levels[p - 1]} (${p})`, { size: 13.5, anchor: 'end', cls: 'dg-t2' })
  }
  levels.forEach((l, i) => svg.text(x0 + i * c + c / 2, y0 + 3 * c + 24, `${l} (${i + 1})`, { size: 13.5, anchor: 'middle', cls: 'dg-t2' }))
  svg.text(x0 + 1.5 * c, y0 + 3 * c + 50, 'Impacto →', { size: 14, weight: 650, anchor: 'middle' })
  svg.text(x0 - 120, y0 + 14, 'Probabilidad ↑', { size: 14, weight: 650 })

  const legend: Array<[string, string, string, string]> = [
    ['dg-danger-soft', 'dg-td', 'Alta · 6 a 9', 'Respuesta activa y responsable ya'],
    ['dg-warning-soft', 'dg-tw', 'Media · 3 a 4', 'Respuesta planificada y monitoreo'],
    ['dg-success-soft', 'dg-ts', 'Baja · 1 a 2', 'Lista de observación'],
  ]
  legend.forEach(([cls, t, title, body], i) => {
    const y = 30 + i * 96
    svg.rect(500, y, 284, 80, cls, 14)
    svg.text(518, y + 32, title, { size: 15.5, weight: 700, cls: t })
    svg.text(518, y + 58, body, { size: 13.5, cls: 'dg-t2' })
  })
  svg.text(500, 340, 'Prioridad = probabilidad × impacto', { size: 14, weight: 650, cls: 'dg-ta' })
  return svg
}

export const estrategias = () =>
  twoColumns(
    'Estrategias de respuesta a amenazas y oportunidades',
    [
      {
        title: 'Amenazas',
        subtitle: 'Reducir lo que puede salir mal',
        tone: 'danger',
        items: [
          'Evitar · cambiar el plan para eliminarla',
          'Transferir · contrato, seguro o SLA',
          'Mitigar · bajar probabilidad o impacto',
          'Aceptar · reserva si ocurre',
        ],
      },
      {
        title: 'Oportunidades',
        subtitle: 'Aprovechar lo que puede salir bien',
        tone: 'success',
        items: [
          'Explotar · asegurar que ocurra',
          'Compartir · aliarse con quien la aprovecha',
          'Mejorar · subir probabilidad o impacto',
          'Aceptar · aprovecharla si llega',
        ],
      },
    ],
    { itemH: 48, footer: 'Escalar: si el riesgo excede al proyecto, pasa a la organización · cada respuesta tiene responsable' },
  )
