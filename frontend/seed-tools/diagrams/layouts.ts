import { Svg } from './svg'

export type Tone = 'accent' | 'success' | 'warning' | 'danger' | 'ai' | 'neutral'

export const SOFT: Record<Tone, string> = {
  accent: 'dg-accent-soft',
  success: 'dg-success-soft',
  warning: 'dg-warning-soft',
  danger: 'dg-danger-soft',
  ai: 'dg-ai-soft',
  neutral: 'dg-box',
}
export const SOLID: Record<Tone, string> = {
  accent: 'dg-accent',
  success: 'dg-success',
  warning: 'dg-warning',
  danger: 'dg-danger',
  ai: 'dg-accent',
  neutral: 'dg-accent',
}
export const INK: Record<Tone, string> = {
  accent: 'dg-ta',
  success: 'dg-ts',
  warning: 'dg-tw',
  danger: 'dg-td',
  ai: 'dg-ta',
  neutral: 'dg-t2',
}

export interface Step {
  title: string
  body: string
  /** Short output line shown at the bottom of the card. */
  out?: string
  tone?: Tone
}

/**
 * Numbered process cards laid out in rows, connected in reading order (a
 * snake connector joins the end of a row with the start of the next one).
 */
export function processGrid(label: string, steps: Step[], opts: { cols: number; cardH: number; legend?: string; connect?: boolean }) {
  const W = 800
  const pad = 16
  const gap = opts.connect === false ? 20 : 36
  const rowGap = opts.connect === false ? 20 : 44
  const rows = Math.ceil(steps.length / opts.cols)
  const cardW = (W - 2 * pad - (opts.cols - 1) * gap) / opts.cols
  const legendH = opts.legend ? 36 : 0
  const H = pad * 2 + rows * opts.cardH + (rows - 1) * rowGap + legendH
  const svg = new Svg(W, H, label)

  const pos = (i: number) => {
    const row = Math.floor(i / opts.cols)
    const col = i % opts.cols
    return { x: pad + col * (cardW + gap), y: pad + row * (opts.cardH + rowGap), row, col }
  }

  steps.forEach((step, i) => {
    const { x, y, row, col } = pos(i)
    const tone = step.tone ?? 'accent'
    svg.rect(x, y, cardW, opts.cardH, SOFT[tone], 16)
    svg.badge(x + 26, y + 28, String(i + 1), SOLID[tone])
    svg.text(x + 48, y + 34, step.title, { size: 16, weight: 650 })
    svg.text(x + 18, y + 64, step.body, { size: 14, cls: 'dg-t2', leading: 1.35 })
    if (step.out) {
      svg.path(`M${x + 18} ${y + opts.cardH - 40} H${x + cardW - 18}`, 'dg-line')
      svg.diamond(x + 24, y + opts.cardH - 20, 5, SOLID[tone])
      svg.text(x + 36, y + opts.cardH - 15, step.out, { size: 13.5, weight: 600, cls: INK[tone] })
    }
    const next = steps[i + 1]
    if (!next || opts.connect === false) return
    if (col < opts.cols - 1) {
      svg.arrow(x + cardW + 4, y + opts.cardH / 2, x + cardW + gap - 4, y + opts.cardH / 2)
    } else {
      const to = pos(i + 1)
      const midY = y + opts.cardH + rowGap / 2
      svg.path(
        `M${x + cardW / 2} ${y + opts.cardH + 4} V${midY} H${to.x + cardW / 2} V${to.y - 12}`,
        'dg-flow',
      )
      svg.path(`M${to.x + cardW / 2} ${to.y - 2} l-6 -11 h12 z`, 'dg-head')
      void row
    }
  })

  if (opts.legend) svg.text(W / 2, H - 14, opts.legend, { size: 13, cls: 'dg-t3', anchor: 'middle' })
  return svg
}

export interface Column {
  title: string
  subtitle: string
  tone: Tone
  items: string[]
}

/** Two side-by-side cards with a list each (comparisons). */
export function twoColumns(label: string, columns: [Column, Column], opts: { itemH?: number; footer?: string } = {}) {
  const W = 800
  const pad = 16
  const gap = 24
  const itemH = opts.itemH ?? 44
  const rows = Math.max(...columns.map((c) => c.items.length))
  const cardW = (W - 2 * pad - gap) / 2
  const cardH = 92 + rows * itemH + 8
  const footerH = opts.footer ? 40 : 0
  const H = pad * 2 + cardH + footerH
  const svg = new Svg(W, H, label)

  columns.forEach((column, c) => {
    const x = pad + c * (cardW + gap)
    svg.rect(x, pad, cardW, cardH, SOFT[column.tone], 18)
    svg.text(x + 22, pad + 38, column.title, { size: 19, weight: 700, cls: INK[column.tone] })
    svg.text(x + 22, pad + 62, column.subtitle, { size: 14, cls: 'dg-t2' })
    column.items.forEach((item, i) => {
      const y = pad + 82 + i * itemH
      svg.rect(x + 14, y, cardW - 28, itemH - 8, 'dg-card', 10)
      svg.diamond(x + 32, y + (itemH - 8) / 2, 5, SOLID[column.tone])
      svg.text(x + 46, y + (itemH - 8) / 2 + 5, item, { size: 14.5 })
    })
  })
  if (opts.footer) svg.text(W / 2, H - 16, opts.footer, { size: 14, cls: 'dg-t2', anchor: 'middle' })
  return svg
}
