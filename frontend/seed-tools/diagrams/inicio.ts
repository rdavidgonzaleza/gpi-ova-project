import { processGrid } from './layouts'
import { Svg } from './svg'

/** Grupos de procesos en el tiempo, con los OVA que cubren cada fase. */
export const cicloVida = () => {
  const W = 800
  const H = 300
  const svg = new Svg(W, H, 'Ciclo de vida del proyecto y grupos de procesos')
  const phases: Array<[string, string, string, number, number]> = [
    ['Inicio', 'Acta e\ninteresados', 'dg-accent-soft', 16, 120],
    ['Planificación', 'Alcance, cronograma,\ncostos y riesgos', 'dg-accent-soft', 148, 220],
    ['Ejecución', 'Equipo, comunicaciones\ny calidad', 'dg-success-soft', 380, 236],
    ['Cierre', 'Aceptación y\nlecciones', 'dg-box', 628, 156],
  ]
  phases.forEach(([title, body, cls, x, w]) => {
    svg.rect(x, 24, w, 128, cls, 16)
    svg.text(x + 16, 56, title, { size: 17, weight: 700 })
    svg.text(x + 16, 86, body, { size: 13.5, cls: 'dg-t2' })
  })
  svg.rect(16, 168, W - 32, 56, 'dg-warning-soft', 16)
  svg.text(32, 202, 'Monitoreo y control · durante todo el proyecto: desempeño y gestión de cambios', {
    size: 15,
    weight: 650,
    cls: 'dg-tw',
  })
  svg.path(`M16 256 H${W - 16}`, 'dg-line')
  svg.diamond(24, 256, 9)
  svg.text(40, 284, 'Acta firmada', { size: 13, cls: 'dg-t2' })
  svg.diamond(W - 24, 256, 9)
  svg.text(W - 40, 284, 'Aceptación final', { size: 13, cls: 'dg-t2', anchor: 'end' })
  svg.text(W / 2, 284, 'Tiempo →', { size: 13, cls: 'dg-t3', anchor: 'middle' })
  return svg
}

export const acta = () =>
  processGrid(
    'Contenido del acta de constitución',
    [
      { title: 'Propósito', body: '¿Por qué existe el\nproyecto? Vender en línea\nantes de la temporada.' },
      { title: 'Objetivos', body: 'Medibles y con plazo:\n30 % de ventas en línea\na los seis meses.' },
      { title: 'Requisitos', body: 'De alto nivel: compra,\nsilla, pago y tiquete\ncon QR.' },
      { title: 'Hitos y dinero', body: 'Lanzamiento el 1 de\ndiciembre · $480 M\naprobados.' },
      { title: 'Riesgos', body: 'Iniciales: integración\ncon PSE, resistencia\nde taquilleros.', tone: 'warning' },
      { title: 'Autoridad', body: 'Director nombrado y\npatrocinador que firma.', tone: 'success' },
    ],
    { cols: 3, cardH: 132, connect: false },
  )

/** Matriz de poder e interés con las estrategias. */
export const interesados = () => {
  const W = 800
  const H = 400
  const svg = new Svg(W, H, 'Matriz de poder e interés')
  const x0 = 110
  const y0 = 16
  const cw = 330
  const ch = 160
  const quads: Array<[number, number, string, string, string, string]> = [
    [0, 0, 'dg-warning-soft', 'dg-tw', 'Mantener satisfecho', 'Consultar en decisiones clave,\nsin saturar de detalles.'],
    [1, 0, 'dg-danger-soft', 'dg-td', 'Gestionar de cerca', 'Involucrar siempre: reuniones\nfrecuentes y decisiones conjuntas.'],
    [0, 1, 'dg-box', 'dg-t2', 'Monitorear', 'Observar con poco esfuerzo\npor si su posición cambia.'],
    [1, 1, 'dg-accent-soft', 'dg-ta', 'Mantener informado', 'Comunicar el avance con\nregularidad y escuchar.'],
  ]
  quads.forEach(([c, r, cls, ink, title, body]) => {
    const x = x0 + c * cw
    const y = y0 + r * ch
    svg.rect(x + 4, y + 4, cw - 8, ch - 8, cls, 16)
    svg.text(x + 24, y + 44, title, { size: 17, weight: 700, cls: ink })
    svg.text(x + 24, y + 78, body, { size: 14, cls: 'dg-t2' })
  })
  svg.path(`M${x0 - 16} ${y0} V${y0 + 2 * ch}`, 'dg-line')
  svg.text(x0 - 24, y0 + 20, 'Mucho', { size: 13, cls: 'dg-t2', anchor: 'end' })
  svg.text(x0 - 24, y0 + 2 * ch, 'Poco', { size: 13, cls: 'dg-t2', anchor: 'end' })
  svg.text(x0 - 24, y0 + ch + 5, 'Poder', { size: 14, weight: 650, anchor: 'end' })
  svg.path(`M${x0} ${y0 + 2 * ch + 16} H${x0 + 2 * cw}`, 'dg-line')
  svg.text(x0, y0 + 2 * ch + 38, 'Poco', { size: 13, cls: 'dg-t2' })
  svg.text(x0 + 2 * cw, y0 + 2 * ch + 38, 'Mucho', { size: 13, cls: 'dg-t2', anchor: 'end' })
  svg.text(x0 + cw, y0 + 2 * ch + 38, 'Interés', { size: 14, weight: 650, anchor: 'middle' })
  return svg
}

/** El plan para la dirección: líneas base y planes subsidiarios. */
export const plan = () => {
  const W = 800
  const H = 350
  const svg = new Svg(W, H, 'Plan para la dirección del proyecto')
  svg.rect(W / 2 - 190, 16, 380, 56, 'dg-accent', 16)
  svg.text(W / 2, 51, 'Plan para la dirección del proyecto', { size: 17, weight: 700, cls: 'dg-on', anchor: 'middle' })
  const bases = ['Alcance', 'Cronograma', 'Costos']
  bases.forEach((b, i) => {
    const x = 24 + i * 252
    svg.path(`M${W / 2} 72 V90 H${x + 116} V104`, 'dg-line')
    svg.rect(x, 104, 232, 60, 'dg-accent-soft', 14)
    svg.diamond(x + 24, 134, 7)
    svg.text(x + 42, 140, `Línea base de ${b.toLowerCase()}`, { size: 14.5, weight: 600 })
  })
  svg.text(24, 190, 'Líneas base: contra ellas se mide el avance', { size: 13.5, weight: 650, cls: 'dg-ta' })
  svg.text(24, 236, 'Planes subsidiarios · cómo se gestiona cada área', { size: 14, weight: 650, cls: 'dg-t2' })
  const plans = ['Riesgos', 'Calidad', 'Comunicaciones', 'Interesados', 'Recursos', 'Adquisiciones']
  plans.forEach((p, i) => {
    const x = 24 + i * 127
    svg.rect(x, 250, 117, 48, 'dg-box', 12)
    svg.text(x + 58.5, 280, p, { size: 13.5, anchor: 'middle' })
  })
  svg.text(W / 2, 334, 'Más el plan de gestión de cambios y de configuración', { size: 13, cls: 'dg-t3', anchor: 'middle' })
  return svg
}
