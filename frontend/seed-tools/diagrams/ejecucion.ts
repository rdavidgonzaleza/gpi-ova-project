import { processGrid, twoColumns } from './layouts'
import { Svg } from './svg'

export const procesos = () =>
  processGrid(
    'Procesos de la ejecución',
    [
      { title: 'Dirigir el trabajo', body: 'Coordinar a las personas\npara producir los\nentregables del plan.' },
      { title: 'Conocimiento', body: 'Usar y documentar lo\nque se aprende mientras\nse trabaja.' },
      { title: 'Calidad', body: 'Asegurar que el proceso\nproduzca un buen\nproducto.', tone: 'success' },
      { title: 'Equipo', body: 'Adquirir, desarrollar y\ndirigir a las personas.' },
      { title: 'Comunicaciones', body: 'Que cada interesado\nreciba lo que necesita,\na tiempo.' },
      { title: 'Riesgos', body: 'Implementar las\nrespuestas planificadas.', tone: 'warning' },
    ],
    { cols: 3, cardH: 132, connect: false },
  )

/** Etapas de Tuckman con la curva de desempeño. */
export const tuckman = () => {
  const W = 800
  const H = 330
  const svg = new Svg(W, H, 'Modelo de Tuckman de desarrollo del equipo')
  const stages: Array<[string, string, number]> = [
    ['Formación', 'Orientar: roles\ny objetivos claros', 0.45],
    ['Conflicto', 'Mediar: acuerdos\ny escucha', 0.25],
    ['Normalización', 'Apoyar: reglas\ndel propio equipo', 0.6],
    ['Desempeño', 'Delegar: dar\nautonomía', 0.9],
    ['Disolución', 'Cerrar: reconocer\ny liberar', 0.7],
  ]
  const x0 = 40
  const step = (W - 80) / (stages.length - 1)
  const y = (v: number) => 190 - v * 140
  const pts = stages.map(([, , v], i) => `${x0 + i * step} ${y(v)}`)
  svg.path(`M${pts.join(' L')}`, 'dg-s1')
  svg.text(x0, 30, 'Desempeño del equipo', { size: 13, cls: 'dg-t3' })
  stages.forEach(([name, body, v], i) => {
    const cx = x0 + i * step
    svg.circle(cx, y(v), 7, i === 3 ? 'dg-success' : 'dg-accent')
    const anchor = i === 0 ? 'start' : i === stages.length - 1 ? 'end' : 'middle'
    svg.text(cx, 236, name, { size: 15, weight: 700, anchor })
    svg.text(cx, 262, body, { size: 13, cls: 'dg-t2', anchor })
  })
  return svg
}

/** Matriz RACI de ejemplo. */
export const raci = () => {
  const W = 800
  const H = 290
  const svg = new Svg(W, H, 'Matriz RACI de RutaCaribe')
  const people = ['Director', 'Líder técnico', 'Desarrollador', 'Analista QA', 'Gerente']
  const rows: Array<[string, string[]]> = [
    ['Arquitectura', ['A', 'R', 'C', 'C', 'I']],
    ['App móvil', ['A', 'C', 'R', 'C', 'I']],
    ['Plan de pruebas', ['A', 'C', 'I', 'R', 'I']],
    ['Aceptación final', ['R', 'I', 'I', 'C', 'A']],
  ]
  const x0 = 180
  const cw = (W - x0 - 16) / people.length
  const rh = 48
  people.forEach((p, i) => svg.text(x0 + i * cw + cw / 2, 34, p, { size: 13.5, weight: 650, anchor: 'middle' }))
  const tone: Record<string, [string, string]> = {
    R: ['dg-accent', 'dg-on'],
    A: ['dg-danger-soft', 'dg-td'],
    C: ['dg-warning-soft', 'dg-tw'],
    I: ['dg-box', 'dg-t2'],
  }
  rows.forEach(([name, cells], r) => {
    const y = 50 + r * rh
    svg.text(16, y + 30, name, { size: 14.5, weight: 600 })
    cells.forEach((c, i) => {
      const [cls, ink] = tone[c]
      svg.rect(x0 + i * cw + 8, y + 6, cw - 16, rh - 12, cls, 10)
      svg.text(x0 + i * cw + cw / 2, y + 30, c, { size: 15, weight: 700, cls: ink, anchor: 'middle' })
    })
  })
  svg.text(16, H - 22, 'R responsable de hacerlo · A aprueba (solo uno) · C consultado · I informado', {
    size: 13.5,
    cls: 'dg-t2',
  })
  return svg
}

export const calidad = () =>
  twoColumns('Gestionar la calidad frente a controlar la calidad', [
    {
      title: 'Gestionar la calidad',
      subtitle: 'El proceso · prevenir',
      tone: 'success',
      items: ['Revisiones de código', 'Auditorías del proceso', 'Estándares y listas de chequeo', 'Pruebas automatizadas desde el inicio'],
    },
    {
      title: 'Controlar la calidad',
      subtitle: 'El producto · detectar',
      tone: 'warning',
      items: ['Inspeccionar entregables', 'Ejecutar casos de prueba', 'Medir defectos por semana', 'Verificar antes de entregar'],
    },
  ])
