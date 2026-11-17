import { processGrid, twoColumns } from './layouts'
import { Svg } from './svg'

export const productoProyecto = () =>
  twoColumns(
    'Alcance del producto frente al alcance del proyecto en RutaCaribe',
    [
      {
        title: 'Alcance del producto',
        subtitle: 'Lo que se entrega: funciones y características',
        tone: 'accent',
        items: ['Compra de tiquetes en línea', 'Selección de silla en el mapa', 'Pago con PSE y tarjeta', 'Tiquete digital con código QR'],
      },
      {
        title: 'Alcance del proyecto',
        subtitle: 'El trabajo necesario para entregarlo',
        tone: 'warning',
        items: ['Levantar requisitos', 'Diseñar, desarrollar y probar', 'Capacitar a los taquilleros', 'Poner en producción'],
      },
    ],
    { footer: 'Las exclusiones también son alcance: “sin venta de encomiendas en esta versión”.' },
  )

export const procesos = () =>
  processGrid(
    'Los seis procesos de la gestión del alcance',
    [
      { title: 'Planificar', body: '¿Cómo definiremos y\ncontrolaremos el alcance?', out: 'Plan de gestión' },
      { title: 'Recopilar', body: '¿Qué necesitan los\ninteresados?', out: 'Matriz de trazabilidad' },
      { title: 'Definir', body: '¿Qué entra y qué\nqueda fuera?', out: 'Enunciado del alcance' },
      { title: 'Crear la EDT', body: '¿Cómo se descompone\nel trabajo?', out: 'Línea base del alcance' },
      { title: 'Validar', body: '¿El cliente acepta\nlo entregado?', out: 'Entregables aceptados', tone: 'success' },
      { title: 'Controlar', body: '¿Cómo manejamos\nlos cambios?', out: 'Solicitudes de cambio', tone: 'warning' },
    ],
    { cols: 3, cardH: 150, legend: 'Planificación en azul · seguimiento y control en verde y naranja' },
  )

/** EDT de RutaCaribe: raíz, cinco entregables y tres paquetes por rama. */
export const edt = () => {
  const W = 800
  const branches: Array<[string, string[]]> = [
    ['1. Gestión del\nproyecto', ['1.1 Acta', '1.2 Plan', '1.3 Informes']],
    ['2. Plataforma\nweb', ['2.1 Buscador', '2.2 Sillas', '2.3 Taquilla']],
    ['3. Aplicación\nmóvil', ['3.1 Compra', '3.2 Tiquete QR', '3.3 Avisos']],
    ['4. Integración\nde pagos', ['4.1 PSE', '4.2 Tarjeta', '4.3 Conciliación']],
    ['5. Puesta en\nproducción', ['5.1 Migración', '5.2 Capacitar', '5.3 Lanzamiento']],
  ]
  const pad = 12
  const gap = 10
  const colW = (W - 2 * pad - 4 * gap) / 5
  const H = 452
  const svg = new Svg(W, H, 'EDT de RutaCaribe en tres niveles')

  svg.rect(W / 2 - 110, 14, 220, 52, 'dg-accent', 14)
  svg.text(W / 2, 47, 'RutaCaribe', { cls: 'dg-on', size: 19, weight: 700, anchor: 'middle' })
  svg.path(`M${W / 2} 66 V88`, 'dg-line')
  const first = pad + colW / 2
  const last = pad + 4 * (colW + gap) + colW / 2
  svg.path(`M${first} 88 H${last}`, 'dg-line')

  branches.forEach(([name, leaves], b) => {
    const x = pad + b * (colW + gap)
    svg.path(`M${x + colW / 2} 88 V106`, 'dg-line')
    svg.rect(x, 106, colW, 62, 'dg-accent-soft', 12)
    svg.text(x + colW / 2, 132, name, { size: 14.5, weight: 650, anchor: 'middle', cls: 'dg-ta' })
    svg.path(`M${x + 12} 168 V${190 + 2 * 66 + 24}`, 'dg-line')
    leaves.forEach((leaf, i) => {
      const y = 190 + i * 66
      svg.path(`M${x + 12} ${y + 24} H${x + 22}`, 'dg-line')
      svg.rect(x + 22, y, colW - 22, 48, 'dg-box', 10)
      svg.diamond(x + 34, y + 24, 5)
      svg.text(x + 45, y + 29, leaf, { size: 13 })
    })
  })

  svg.rect(pad, 400, W - 2 * pad, 40, 'dg-card', 12)
  svg.diamond(pad + 22, 420, 6)
  svg.text(pad + 36, 425, 'Paquete de trabajo: el nivel más bajo, con un responsable y una estimación', {
    size: 13.5,
    cls: 'dg-t2',
  })
  return svg
}

export const reglasEdt = () =>
  processGrid(
    'Las cuatro reglas de una buena EDT',
    [
      { title: 'Regla del 100 %', body: 'Todo el trabajo del proyecto y nada más:\ncada nivel suma el 100 % de su padre.' },
      { title: 'Orientada a entregables', body: 'Sustantivos, no verbos: “Módulo de pagos”,\nno “Programar pagos”.' },
      { title: 'Paquetes de trabajo', body: 'El nivel más bajo se estima con confianza\ny tiene un único responsable.' },
      { title: 'Sin solapamientos', body: 'Un mismo trabajo nunca aparece\nen dos ramas.' },
    ],
    { cols: 2, cardH: 112, connect: false },
  )

/** Flujo de control de cambios y triple restricción. */
export const controlCambios = () => {
  const W = 800
  const H = 330
  const svg = new Svg(W, H, 'Proceso de control de cambios y triple restricción')
  const steps: Array<[string, string]> = [
    ['Solicitud', 'El interesado\nregistra el cambio'],
    ['Impacto', 'Alcance, tiempo,\ncosto, calidad, riesgo'],
    ['Comité (CCB)', 'Aprueba, rechaza\no difiere'],
    ['Líneas base', 'Se actualizan y\nse comunican'],
  ]
  const w = 170
  const gap = (W - 32 - 4 * w) / 3
  steps.forEach(([title, body], i) => {
    const x = 16 + i * (w + gap)
    svg.rect(x, 16, w, 118, i === 2 ? 'dg-warning-soft' : 'dg-accent-soft', 16)
    svg.badge(x + 26, 44, String(i + 1), i === 2 ? 'dg-warning' : 'dg-accent')
    svg.text(x + 48, 50, title, { size: 16, weight: 650 })
    svg.text(x + 16, 82, body, { size: 13.5, cls: 'dg-t2' })
    if (i < 3) svg.arrow(x + w + 4, 75, x + w + gap - 4, 75)
  })

  // Triple restricción.
  const cx = 240
  const top = 168
  const base = 312
  svg.path(`M${cx} ${top} L${cx + 110} ${base} L${cx - 110} ${base} Z`, 'dg-accent-soft')
  svg.text(cx, top - 8, 'Alcance', { size: 15, weight: 650, anchor: 'middle', cls: 'dg-ta' })
  svg.text(cx - 118, base + 2, 'Tiempo', { size: 15, weight: 650, anchor: 'end', cls: 'dg-ta' })
  svg.text(cx + 118, base + 2, 'Costo', { size: 15, weight: 650, cls: 'dg-ta' })
  svg.text(cx, 268, 'Calidad', { size: 14, anchor: 'middle', cls: 'dg-t2' })

  svg.rect(430, 170, 354, 66, 'dg-danger-soft', 14)
  svg.text(446, 196, 'Corrupción del alcance', { size: 15, weight: 650, cls: 'dg-td' })
  svg.text(446, 220, 'Pequeños “sí, es rápido” que desbordan todo', { size: 13.5, cls: 'dg-t2' })
  svg.rect(430, 246, 354, 66, 'dg-warning-soft', 14)
  svg.text(446, 272, 'Enchapado en oro', { size: 15, weight: 650, cls: 'dg-tw' })
  svg.text(446, 296, 'Funciones que nadie pidió', { size: 13.5, cls: 'dg-t2' })
  return svg
}
