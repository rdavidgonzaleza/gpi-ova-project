import { processGrid } from './layouts'
import { Svg } from './svg'

/** Informe semáforo con umbrales. */
export const semaforo = () => {
  const W = 800
  const H = 260
  const svg = new Svg(W, H, 'Informe de desempeño con semáforo')
  const zones: Array<[string, string, string, string, string]> = [
    ['dg-success-soft', 'dg-ts', 'Verde', 'CPI y SPI ≥ 0,95', 'Seguir el plan y reportar.'],
    ['dg-warning-soft', 'dg-tw', 'Amarillo', 'Entre 0,85 y 0,95', 'Analizar la causa y vigilar\ncada semana.'],
    ['dg-danger-soft', 'dg-td', 'Rojo', 'Menor que 0,85', 'Acción correctiva y aviso\nal patrocinador.'],
  ]
  const w = (W - 32 - 2 * 16) / 3
  zones.forEach(([cls, ink, name, rule, action], i) => {
    const x = 16 + i * (w + 16)
    svg.rect(x, 16, w, 196, cls, 18)
    svg.circle(x + 34, 52, 14, ink === 'dg-ts' ? 'dg-success' : ink === 'dg-tw' ? 'dg-warning' : 'dg-danger')
    svg.text(x + 58, 58, name, { size: 18, weight: 700, cls: ink })
    svg.text(x + 20, 104, rule, { size: 16, weight: 650 })
    svg.text(x + 20, 140, action, { size: 14, cls: 'dg-t2' })
  })
  svg.text(W / 2, H - 18, 'Los umbrales se acuerdan en el plan, antes de medir', { size: 13.5, cls: 'dg-t3', anchor: 'middle' })
  return svg
}

/** Flujo del control integrado de cambios con la decisión del comité. */
export const flujo = () => {
  const W = 800
  const H = 360
  const svg = new Svg(W, H, 'Flujo del control integrado de cambios')
  const box = (x: number, y: number, w: number, title: string, body: string, cls = 'dg-accent-soft', ink = 'dg-t') => {
    svg.rect(x, y, w, 84, cls, 14)
    svg.text(x + 16, y + 32, title, { size: 15.5, weight: 650, cls: ink })
    svg.text(x + 16, y + 58, body, { size: 13, cls: 'dg-t2' })
  }
  box(16, 24, 170, 'Solicitud', 'Cualquiera puede\npedir un cambio')
  box(218, 24, 170, 'Registro', 'Queda en el registro\nde cambios')
  box(420, 24, 170, 'Impacto', 'Alcance, tiempo,\ncosto, calidad, riesgo')
  svg.arrow(190, 66, 214, 66)
  svg.arrow(392, 66, 416, 66)
  // Decisión.
  const cx = 700
  const cy = 66
  svg.path(`M${cx} ${cy - 46} L${cx + 82} ${cy} L${cx} ${cy + 46} L${cx - 82} ${cy} Z`, 'dg-warning-soft')
  svg.text(cx, cy - 2, 'Comité', { size: 15.5, weight: 700, anchor: 'middle', cls: 'dg-tw' })
  svg.text(cx, cy + 18, '(CCB)', { size: 13, anchor: 'middle', cls: 'dg-t2' })
  svg.arrow(594, 66, 614, 66)
  // Rechazada o diferida: baja directo a comunicar.
  svg.path(`M${cx} ${cy + 46} V244`, 'dg-flow')
  svg.path(`M${cx} 248 l-6 -11 h12 z`, 'dg-head')
  svg.text(cx + 10, 176, 'Rechazada', { size: 12.5, weight: 650, cls: 'dg-td' })
  svg.text(cx + 10, 194, 'o diferida', { size: 12.5, cls: 'dg-t2' })
  // Aprobada: vuelve a la izquierda y baja a la fila de ejecución.
  svg.path(`M${cx - 41} ${cy + 23} L${cx - 41} 200 H116 V244`, 'dg-flow')
  svg.path(`M116 248 l-6 -11 h12 z`, 'dg-head')
  svg.text(cx - 50, 190, 'Aprobada', { size: 12.5, weight: 650, cls: 'dg-ts', anchor: 'end' })
  box(16, 250, 200, 'Actualizar línea base', 'Nueva versión del\nplan y documentos', 'dg-success-soft')
  box(240, 250, 160, 'Implementar', 'El equipo hace\nel cambio')
  box(424, 250, 170, 'Verificar', 'Quedó como\nse aprobó', 'dg-success-soft')
  box(618, 250, 166, 'Comunicar', 'La decisión, a\ntodos los afectados', 'dg-box')
  svg.arrow(218, 292, 236, 292)
  svg.arrow(402, 292, 420, 292)
  svg.arrow(596, 292, 614, 292)
  return svg
}

export const tipos = () =>
  processGrid(
    'Tipos de solicitud de cambio',
    [
      { title: 'Cambio de alcance', body: 'Agrega, quita o modifica\nlo que se entrega.\nVa siempre al comité.', out: 'Actualiza la línea base' },
      { title: 'Acción correctiva', body: 'Devuelve el desempeño\nal plan después de un\ndesvío ya medido.', tone: 'warning', out: 'Responde a un desvío' },
      { title: 'Acción preventiva', body: 'Evita que ocurra un\ndesvío futuro.', tone: 'success', out: 'Se anticipa' },
      { title: 'Reparar defecto', body: 'Corrige un producto que\nno cumple un requisito\nya aprobado.', tone: 'danger', out: 'Arregla el producto' },
    ],
    { cols: 2, cardH: 150, connect: false },
  )

/** Versiones de la línea base bajo control de configuración. */
export const configuracion = () => {
  const W = 800
  const H = 240
  const svg = new Svg(W, H, 'Versiones de la línea base bajo control de configuración')
  const versions: Array<[string, string, string]> = [
    ['v1.0', 'Semana 2', 'Línea base aprobada'],
    ['v1.1', 'Semana 7', 'SC-04: pago con Nequi'],
    ['v1.2', 'Semana 10', 'SC-09: pruebas de carga'],
    ['v2.0', 'Semana 13', 'SC-12: nueva fecha'],
  ]
  svg.path(`M40 92 H760`, 'dg-line')
  const step = 720 / (versions.length - 1)
  versions.forEach(([v, when, what], i) => {
    const x = 40 + i * step
    svg.diamond(x, 92, 14, i === versions.length - 1 ? 'dg-success' : 'dg-accent')
    svg.text(x, 56, v, { size: 18, weight: 700, anchor: i === 0 ? 'start' : i === versions.length - 1 ? 'end' : 'middle' })
    const anchor = i === 0 ? 'start' : i === versions.length - 1 ? 'end' : 'middle'
    svg.text(x, 136, when, { size: 13, cls: 'dg-t2', anchor })
    svg.text(x, 160, what, { size: 13.5, weight: 600, anchor })
  })
  svg.rect(16, 186, W - 32, 40, 'dg-box', 12)
  svg.text(W / 2, 211, 'Cada versión enlaza la solicitud aprobada que la originó (trazabilidad)', {
    size: 13.5,
    cls: 'dg-t2',
    anchor: 'middle',
  })
  return svg
}
