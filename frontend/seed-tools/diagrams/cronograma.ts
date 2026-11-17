import { processGrid } from './layouts'
import { Svg, type Anchor } from './svg'

export const procesos = () =>
  processGrid(
    'Los seis procesos de la gestión del cronograma',
    [
      { title: 'Planificar', body: 'Reglas para estimar,\nmedir y controlar\nel tiempo', out: 'Plan del cronograma' },
      { title: 'Definir', body: 'Actividades a partir\nde los paquetes\nde trabajo', out: 'Lista de actividades' },
      { title: 'Secuenciar', body: 'Qué depende de qué:\nla red de actividades', out: 'Diagrama de red' },
      { title: 'Estimar', body: 'Cuánto dura cada\nactividad', out: 'Duraciones' },
      { title: 'Desarrollar', body: 'Red + duraciones +\ncalendario', out: 'Línea base y Gantt' },
      { title: 'Controlar', body: 'Comparar lo real con\nlo planeado', out: 'Pronósticos', tone: 'warning' },
    ],
    { cols: 3, cardH: 160 },
  )

/** Estimación por tres valores (PERT) con un ejemplo. */
export const pert = () => {
  const W = 800
  const H = 300
  const svg = new Svg(W, H, 'Estimación por tres valores (PERT)')
  const x0 = 40
  const x1 = 470
  const base = 220
  const toX = (weeks: number) => x0 + ((weeks - 2) / 8) * (x1 - x0)
  // Curva asimétrica (beta aproximada) entre O = 3 y P = 8, moda en M = 4.
  const pts: string[] = []
  for (let i = 0; i <= 60; i++) {
    const t = i / 60
    const w = 3 + t * 5
    const y = Math.pow(t, 0.8) * Math.pow(1 - t, 2.6)
    pts.push(`${toX(w).toFixed(1)} ${(base - y * 900).toFixed(1)}`)
  }
  svg.path(`M${pts.join(' L')} Z`, 'dg-accent-soft')
  svg.path(`M${toX(2)} ${base} H${toX(10)}`, 'dg-line')
  const marks: Array<[number, string, string]> = [
    [3, 'O = 3', 'Optimista'],
    [4, 'M = 4', 'Más probable'],
    [8, 'P = 8', 'Pesimista'],
  ]
  const anchors: Anchor[] = ['end', 'start', 'middle']
  marks.forEach(([w, a, b], i) => {
    const dx = anchors[i] === 'end' ? 6 : anchors[i] === 'start' ? -6 : 0
    svg.path(`M${toX(w)} ${base} V${base + 8}`, 'dg-line')
    svg.text(toX(w) + dx, base + 28, a, { size: 14, weight: 650, anchor: anchors[i] })
    svg.text(toX(w) + dx, base + 48, b, { size: 13, cls: 'dg-t2', anchor: anchors[i] })
  })
  const e = (3 + 4 * 4 + 8) / 6
  svg.path(`M${toX(e)} 60 V${base}`, 'dg-flow')
  svg.diamond(toX(e), 60, 8)
  svg.text(toX(e) + 14, 64, `Estimado = ${e.toFixed(1).replace('.', ',')} sem`, { size: 15, weight: 650, cls: 'dg-ta' })

  svg.rect(510, 40, 274, 196, 'dg-box', 16)
  svg.text(530, 76, 'Fórmula PERT', { size: 16, weight: 650 })
  svg.text(530, 110, '(O + 4M + P) / 6', { size: 18, weight: 700, cls: 'dg-ta' })
  svg.text(530, 146, '(3 + 16 + 8) / 6 = 4,5 semanas', { size: 14, cls: 'dg-t2' })
  svg.text(530, 182, 'El valor más probable pesa\ncuatro veces más.', { size: 13.5, cls: 'dg-t2' })
  return svg
}

/** Red de actividades de RutaCaribe (la misma de la simulación CPM). */
export const red = () => {
  const W = 800
  const H = 360
  const svg = new Svg(W, H, 'Red de actividades de RutaCaribe')
  const col = (i: number) => 16 + i * 158
  const nodes: Record<string, { x: number; y: number; name: string; d: number }> = {
    A: { x: col(0), y: 150, name: 'Requisitos', d: 4 },
    B: { x: col(1), y: 150, name: 'Arquitectura', d: 2 },
    C: { x: col(2), y: 40, name: 'Web', d: 5 },
    D: { x: col(2), y: 150, name: 'App móvil', d: 6 },
    E: { x: col(2), y: 260, name: 'Pagos PSE', d: 4 },
    G: { x: col(3), y: 40, name: 'Capacitación', d: 2 },
    F: { x: col(3), y: 205, name: 'Pruebas', d: 2 },
    H: { x: col(4), y: 150, name: 'Producción', d: 2 },
  }
  const w = 128
  const h = 64
  const edges = ['AB', 'BC', 'BD', 'BE', 'CG', 'CF', 'DF', 'EF', 'FH', 'GH']
  edges.forEach(([a, b]) => {
    const p = nodes[a]
    const q = nodes[b]
    const x1 = p.x + w
    const y1 = p.y + h / 2
    const x2 = q.x - 2
    const y2 = q.y + h / 2
    const mx = (x1 + x2) / 2
    svg.path(`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2 - 8} ${y2}`, 'dg-line')
    svg.path(`M${x2} ${y2} l-10 -5.5 v11 z`, 'dg-head-muted')
  })
  Object.entries(nodes).forEach(([id, node]) => {
    svg.rect(node.x, node.y, w, h, 'dg-box', 12)
    svg.rect(node.x + 10, node.y + 10, 24, 24, 'dg-accent', 7)
    svg.text(node.x + 22, node.y + 27, id, { cls: 'dg-on', size: 13, weight: 700, anchor: 'middle' })
    svg.text(node.x + 42, node.y + 27, node.name, { size: 13, weight: 600 })
    svg.text(node.x + 42, node.y + 50, `${node.d} semanas`, { size: 12.5, cls: 'dg-t2' })
  })
  svg.text(W / 2, H - 12, 'Dependencias fin a inicio · ¿cuál es la secuencia más larga?', {
    size: 13,
    cls: 'dg-t3',
    anchor: 'middle',
  })
  return svg
}

/** Notación de un nodo CPM y efecto de un retraso sobre la holgura. */
export const holgura = () => {
  const W = 800
  const H = 300
  const svg = new Svg(W, H, 'Notación de un nodo CPM y consumo de holgura')
  // Nodo.
  const x = 24
  const y = 40
  const cw = 92
  svg.rect(x, y, cw * 3, 168, 'dg-card', 14)
  svg.path(`M${x} ${y + 56} H${x + cw * 3} M${x} ${y + 112} H${x + cw * 3}`, 'dg-line')
  svg.path(`M${x + cw} ${y} V${y + 56} M${x + cw * 2} ${y} V${y + 56} M${x + cw} ${y + 112} V${y + 168} M${x + cw * 2} ${y + 112} V${y + 168}`, 'dg-line')
  const cell = (c: number, r: number, label: string, value: string, cls = 'dg-t') => {
    const cx = x + c * cw + cw / 2
    const cy = y + r * 56
    svg.text(cx, cy + 22, label, { size: 12, cls: 'dg-t2', anchor: 'middle' })
    svg.text(cx, cy + 44, value, { size: 17, weight: 700, anchor: 'middle', cls })
  }
  cell(0, 0, 'IT', '3')
  cell(1, 0, 'Duración', '5')
  cell(2, 0, 'FT', '8')
  svg.text(x + cw * 1.5, y + 90, 'Reportes de ventas', { size: 15, weight: 650, anchor: 'middle' })
  cell(0, 2, 'ITa', '4')
  cell(1, 2, 'Holgura', '1', 'dg-ta')
  cell(2, 2, 'FTa', '9')
  svg.text(x, y + 196, 'Holgura = ITa − IT = FTa − FT', { size: 14, weight: 600, cls: 'dg-ta' })
  svg.text(x, y + 220, 'Holgura cero → actividad crítica', { size: 13.5, cls: 'dg-t2' })

  // Barra de holgura.
  const bx = 360
  const unit = 44
  svg.text(bx, 52, 'Se retrasa 3 semanas con 1 de holgura', { size: 15, weight: 650 })
  svg.rect(bx, 76, unit * 5, 34, 'dg-accent', 8)
  svg.text(bx + unit * 2.5, 98, 'Duración 5', { size: 13, cls: 'dg-on', anchor: 'middle', weight: 600 })
  svg.rect(bx + unit * 5, 76, unit, 34, 'dg-accent-soft', 8)
  svg.text(bx + unit * 5.5, 98, '1', { size: 13, cls: 'dg-ta', anchor: 'middle' })
  svg.path(`M${bx + unit * 6} 66 V184`, 'dg-dash')
  svg.rect(bx, 130, unit * 5, 34, 'dg-accent', 8)
  svg.text(bx + unit * 2.5, 152, 'Duración 5', { size: 13, cls: 'dg-on', anchor: 'middle', weight: 600 })
  svg.rect(bx + unit * 5, 130, unit, 34, 'dg-warning-soft', 8)
  svg.rect(bx + unit * 6, 130, unit * 2, 34, 'dg-danger-soft', 8)
  svg.text(bx + unit * 7, 152, '+2', { size: 14, weight: 700, cls: 'dg-td', anchor: 'middle' })
  svg.text(bx + unit * 6, 202, 'Fin tardío', { size: 12.5, cls: 'dg-t3', anchor: 'middle' })
  svg.text(bx, 240, 'La holgura absorbe 1 semana; las otras 2 llegan\nal final del proyecto y la actividad se vuelve crítica.', {
    size: 13.5,
    cls: 'dg-t2',
  })
  return svg
}

/** Intensificación frente a ejecución rápida. */
export const compresion = () => {
  const W = 800
  const H = 290
  const svg = new Svg(W, H, 'Técnicas para comprimir el cronograma')
  const half = (W - 48) / 2
  const panel = (x: number, title: string, cost: string, tone: string, ink: string) => {
    svg.rect(x, 16, half, 258, tone, 18)
    svg.text(x + 20, 50, title, { size: 18, weight: 700, cls: ink })
    svg.text(x + 20, 252, cost, { size: 14, weight: 650, cls: ink })
  }
  panel(16, 'Intensificación (crashing)', '↑ Costo: más recursos en la ruta crítica', 'dg-accent-soft', 'dg-ta')
  panel(32 + half, 'Ejecución rápida (fast tracking)', '↑ Riesgo: retrabajo por solapar', 'dg-warning-soft', 'dg-tw')

  const u = 34
  // Intensificación: la misma actividad, más corta con más personas.
  let x = 36
  svg.text(x, 86, 'Antes', { size: 13, cls: 'dg-t2' })
  svg.rect(x + 60, 70, u * 6, 28, 'dg-accent', 7)
  svg.text(x + 60 + u * 3, 89, '6 semanas · 3 personas', { size: 12.5, cls: 'dg-on', anchor: 'middle' })
  svg.text(x, 136, 'Después', { size: 13, cls: 'dg-t2' })
  svg.rect(x + 60, 120, u * 4, 28, 'dg-accent', 7)
  svg.text(x + 60 + u * 2, 139, '4 sem · 5 personas', { size: 12.5, cls: 'dg-on', anchor: 'middle' })
  svg.text(x, 190, 'Empieza por la actividad crítica más\nbarata de acortar. Ojo con la ley de Brooks.', {
    size: 13,
    cls: 'dg-t2',
  })

  // Ejecución rápida: de secuencia a solape.
  x = 52 + half
  svg.text(x, 86, 'Antes', { size: 13, cls: 'dg-t2' })
  svg.rect(x + 60, 70, u * 3, 28, 'dg-accent', 7)
  svg.text(x + 60 + u * 1.5, 89, 'Diseño', { size: 12.5, cls: 'dg-on', anchor: 'middle' })
  svg.rect(x + 60 + u * 3 + 4, 70, u * 3, 28, 'dg-accent-soft', 7)
  svg.text(x + 60 + u * 4.5 + 4, 89, 'Desarrollo', { size: 12.5, cls: 'dg-ta', anchor: 'middle' })
  svg.text(x, 136, 'Después', { size: 13, cls: 'dg-t2' })
  svg.rect(x + 60, 112, u * 3, 28, 'dg-accent', 7)
  svg.text(x + 60 + u * 1.5, 131, 'Diseño', { size: 12.5, cls: 'dg-on', anchor: 'middle' })
  svg.rect(x + 60 + u * 1.5, 144, u * 3, 28, 'dg-accent-soft', 7)
  svg.text(x + 60 + u * 3, 163, 'Desarrollo', { size: 12.5, cls: 'dg-ta', anchor: 'middle' })
  svg.text(x, 214, 'Actividades planeadas en secuencia\nse hacen en paralelo.', { size: 13, cls: 'dg-t2' })
  return svg
}
