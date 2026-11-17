import { processGrid } from './layouts'
import { Svg } from './svg'

export const procesos = () =>
  processGrid(
    'Los cuatro procesos de la gestión de los costos',
    [
      { title: 'Planificar', body: 'Unidades, precisión y umbrales\nde control', out: 'Plan de costos' },
      { title: 'Estimar', body: 'Costo de cada paquete de trabajo', out: 'Estimaciones' },
      { title: 'Presupuestar', body: 'Sumar y repartir\nen el tiempo', out: 'Línea base (curva S)' },
      { title: 'Controlar', body: 'Comparar lo gastado\ncon lo logrado', out: 'CPI, SPI y EAC', tone: 'warning' },
    ],
    { cols: 2, cardH: 140 },
  )

/** Cómo se arma el presupuesto: escalera de paquetes, reservas y total. */
export const presupuesto = () => {
  const W = 800
  const H = 330
  const svg = new Svg(W, H, 'Del costo de los paquetes de trabajo al presupuesto total')
  const base = 270
  const scale = 0.42
  const bars: Array<{ label: string; from: number; value: number; cls: string; ink: string; total?: boolean }> = [
    { label: 'Paquetes de\ntrabajo', from: 0, value: 380, cls: 'dg-accent', ink: 'dg-on' },
    { label: 'Reserva para\ncontingencias', from: 380, value: 60, cls: 'dg-accent-soft', ink: 'dg-ta' },
    { label: 'Línea base\nde costos', from: 0, value: 440, cls: 'dg-accent', ink: 'dg-on', total: true },
    { label: 'Reserva de\ngestión', from: 440, value: 60, cls: 'dg-warning-soft', ink: 'dg-tw' },
    { label: 'Presupuesto\ntotal', from: 0, value: 500, cls: 'dg-box', ink: 'dg-t', total: true },
  ]
  const bw = 110
  const gap = (W - 40 - bars.length * bw) / (bars.length - 1)
  bars.forEach((bar, i) => {
    const x = 20 + i * (bw + gap)
    const top = base - (bar.from + bar.value) * scale
    const h = bar.value * scale
    svg.rect(x, top, bw, h, bar.cls, 10)
    if (bar.total) svg.text(x + bw / 2, top - 10, bar === bars[2] ? 'BAC' : 'Total', { size: 13, weight: 650, anchor: 'middle', cls: 'dg-t2' })
    svg.text(x + bw / 2, base + 24, bar.label, { size: 13, anchor: 'middle', cls: 'dg-t2', weight: bar.total ? 650 : undefined })
    if (i < bars.length - 1) {
      const level = base - (bar.from + bar.value) * scale
      svg.path(`M${x + bw} ${level} H${x + bw + gap}`, 'dg-dash')
    }
  })
  svg.path(`M12 ${base} H${W - 12}`, 'dg-line')
  return svg
}

/** Curva S con PV, EV y AC en la fecha de corte, y las variaciones. */
export const curvaS = () => {
  const W = 800
  const H = 380
  const svg = new Svg(W, H, 'Curva S con valor planificado, valor ganado y costo real')
  const x0 = 70
  const x1 = 500
  const y0 = 320
  const y1 = 40
  const weeks = 12
  const cut = 7
  const X = (w: number) => x0 + (w / weeks) * (x1 - x0)
  const Y = (v: number) => y0 - v * (y0 - y1)
  const s = (t: number) => 1 / (1 + Math.exp(-9 * (t - 0.5)))
  const norm = (t: number) => (s(t) - s(0)) / (s(1) - s(0))
  const pv = (w: number) => norm(w / weeks)
  const ev = (w: number) => pv(w) * 0.8
  const ac = (w: number) => pv(w) * 1.15
  const line = (f: (w: number) => number, to: number) => {
    const pts: string[] = []
    for (let i = 0; i <= to * 4; i++) pts.push(`${X(i / 4).toFixed(1)} ${Y(f(i / 4)).toFixed(1)}`)
    return `M${pts.join(' L')}`
  }
  svg.path(`M${x0} ${y1 - 10} V${y0} H${x1 + 10}`, 'dg-line')
  svg.text(x0 - 10, y1, 'Dinero', { size: 12.5, cls: 'dg-t3', anchor: 'end' })
  svg.text(x1, y0 + 24, 'Tiempo', { size: 12.5, cls: 'dg-t3', anchor: 'end' })
  svg.path(line(pv, weeks), 'dg-s3')
  svg.path(line(ac, cut), 'dg-s2')
  svg.path(line(ev, cut), 'dg-s1')
  svg.path(`M${X(cut)} ${y1} V${y0}`, 'dg-dash')
  svg.text(X(cut), y0 + 24, 'Fecha de corte', { size: 12.5, cls: 'dg-t2', anchor: 'middle' })
  svg.path(`M${X(weeks)} ${Y(1)} H${X(weeks) + 6}`, 'dg-line')
  svg.text(X(weeks) - 6, Y(1) - 10, 'BAC', { size: 13, weight: 700, cls: 'dg-t2', anchor: 'end' })

  const pvC = Y(pv(cut))
  const evC = Y(ev(cut))
  const acC = Y(ac(cut))
  svg.circle(X(cut), pvC, 5, 'dg-f3')
  svg.circle(X(cut), evC, 5, 'dg-f1')
  svg.circle(X(cut), acC, 5, 'dg-f2')
  // Variaciones a la izquierda de la fecha de corte.
  const bx = X(cut) - 26
  svg.path(`M${bx} ${acC} V${evC}`, 'dg-line')
  svg.text(bx - 8, (acC + evC) / 2 + 5, 'CV', { size: 13, weight: 700, cls: 'dg-td', anchor: 'end' })
  const sx = X(cut) + 26
  svg.path(`M${sx} ${pvC} V${evC}`, 'dg-line')
  svg.text(sx + 8, (pvC + evC) / 2 + 5, 'SV', { size: 13, weight: 700, cls: 'dg-tw' })

  const legend: Array<[string, string, string]> = [
    ['dg-s3', 'PV · valor planificado', 'Lo que debía estar hecho'],
    ['dg-s1', 'EV · valor ganado', 'Lo hecho, a precio del plan'],
    ['dg-s2', 'AC · costo real', 'Lo que se gastó'],
  ]
  legend.forEach(([cls, title, body], i) => {
    const y = 70 + i * 80
    svg.path(`M548 ${y} H584`, cls)
    svg.text(596, y + 5, title, { size: 14, weight: 650 })
    svg.text(596, y + 27, body, { size: 12.5, cls: 'dg-t2' })
  })
  return svg
}

/** Fórmulas de EVM en tarjetas. */
export const indicadores = () => {
  const W = 800
  const H = 300
  const svg = new Svg(W, H, 'Indicadores y pronósticos del valor ganado')
  const cards: Array<[string, string, string, string]> = [
    ['Variación del costo', 'CV = EV − AC', 'Negativa: sobrecosto', 'dg-danger-soft'],
    ['Variación del cronograma', 'SV = EV − PV', 'Negativa: atraso', 'dg-warning-soft'],
    ['Índice de costo', 'CPI = EV / AC', '< 1: cada peso rinde menos', 'dg-danger-soft'],
    ['Índice de cronograma', 'SPI = EV / PV', '< 1: se avanza más lento', 'dg-warning-soft'],
    ['Estimado a la conclusión', 'EAC = BAC / CPI', 'Costo final si todo sigue igual', 'dg-accent-soft'],
    ['Variación a la conclusión', 'VAC = BAC − EAC', 'Cuánto faltará o sobrará', 'dg-accent-soft'],
  ]
  const cw = (W - 32 - 2 * 16) / 3
  cards.forEach(([title, formula, read, cls], i) => {
    const x = 16 + (i % 3) * (cw + 16)
    const y = 16 + Math.floor(i / 3) * 140
    svg.rect(x, y, cw, 124, cls, 16)
    svg.text(x + 18, y + 32, title, { size: 14, cls: 'dg-t2', weight: 600 })
    svg.text(x + 18, y + 68, formula, { size: 21, weight: 700 })
    svg.text(x + 18, y + 102, read, { size: 13, cls: 'dg-t2' })
  })
  return svg
}

/** Cuadrantes CPI × SPI con su lectura. */
export const cuadrantes = () => {
  const W = 800
  const H = 400
  const svg = new Svg(W, H, 'Lectura combinada de CPI y SPI')
  const x0 = 110
  const y0 = 20
  const size = 340
  const cell = size / 2
  const quads: Array<[number, number, string, string, string]> = [
    [0, 0, 'dg-warning-soft', 'Adelantado,\npero caro', 'Horas extra, más\nrecursos'],
    [1, 0, 'dg-success-soft', 'Adelantado y\nbajo presupuesto', 'Verifica que la\ncalidad no sufra'],
    [0, 1, 'dg-danger-soft', 'Atrasado y\ncon sobrecosto', 'Busca la causa\nantes de pedir dinero'],
    [1, 1, 'dg-warning-soft', 'Atrasado, pero\nbarato', 'Suele faltar gente\nen el equipo'],
  ]
  quads.forEach(([c, r, cls, title, body]) => {
    const x = x0 + c * cell
    const y = y0 + r * cell
    svg.rect(x + 4, y + 4, cell - 8, cell - 8, cls, 14)
    svg.text(x + 20, y + 38, title, { size: 15, weight: 650 })
    svg.text(x + 20, y + 100, body, { size: 13, cls: 'dg-t2' })
  })
  svg.path(`M${x0} ${y0 + size + 14} H${x0 + size}`, 'dg-line')
  svg.text(x0, y0 + size + 34, 'CPI < 1', { size: 13, cls: 'dg-t2' })
  svg.text(x0 + size, y0 + size + 34, 'CPI > 1', { size: 13, cls: 'dg-t2', anchor: 'end' })
  svg.text(x0 + size / 2, y0 + size + 34, 'Costo', { size: 13, weight: 650, anchor: 'middle' })
  svg.path(`M${x0 - 14} ${y0} V${y0 + size}`, 'dg-line')
  svg.text(x0 - 22, y0 + 16, 'SPI > 1', { size: 13, cls: 'dg-t2', anchor: 'end' })
  svg.text(x0 - 22, y0 + size, 'SPI < 1', { size: 13, cls: 'dg-t2', anchor: 'end' })
  svg.text(x0 - 22, y0 + size / 2 + 5, 'Tiempo', { size: 13, weight: 650, anchor: 'end' })

  svg.rect(500, 40, 284, 140, 'dg-box', 16)
  svg.text(518, 74, 'Regla del 20 %', { size: 16, weight: 650 })
  svg.text(518, 104, 'Pasado el 20 % de avance, el CPI\nrara vez mejora solo. Si el EAC\nsupera el presupuesto, actúa ya.', {
    size: 13.5,
    cls: 'dg-t2',
  })
  svg.rect(500, 200, 284, 140, 'dg-accent-soft', 16)
  svg.text(518, 234, 'EV usa el presupuesto', { size: 16, weight: 650, cls: 'dg-ta' })
  svg.text(518, 264, 'Paquete de $40 M al 50 %:\nEV = $20 M, aunque se hayan\ngastado $30 M.', { size: 13.5, cls: 'dg-t2' })
  return svg
}
