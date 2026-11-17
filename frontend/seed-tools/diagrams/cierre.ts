import { processGrid, twoColumns } from './layouts'
import { Svg } from './svg'

export const tipos = () =>
  twoColumns(
    'Cierre del proyecto y cierre de contratos',
    [
      {
        title: 'Cierre del proyecto o fase',
        subtitle: 'Lo que hace el equipo',
        tone: 'accent',
        items: ['Aceptación formal de entregables', 'Transferencia a operación', 'Lecciones aprendidas', 'Liberar al equipo e informe final'],
      },
      {
        title: 'Cierre de contratos',
        subtitle: 'Con cada proveedor',
        tone: 'warning',
        items: ['Verificar lo entregado', 'Resolver reclamos pendientes', 'Último pago y paz y salvo', 'Archivar el contrato'],
      },
    ],
    { footer: 'Un contrato puede cerrarse antes que el proyecto, pero el proyecto no cierra con contratos abiertos' },
  )

/** Formato de una lección aprendida con ejemplo. */
export const lecciones = () => {
  const W = 800
  const H = 250
  const svg = new Svg(W, H, 'Formato de una lección aprendida')
  const parts: Array<[string, string, string]> = [
    ['Situación', 'La integración con\nPSE tardó 8 semanas\ny no 4', 'dg-box'],
    ['Impacto', 'Atrasó las pruebas\ny consumió reserva', 'dg-danger-soft'],
    ['Causa', 'Se estimó sin\nrevisar la API', 'dg-warning-soft'],
    ['Recomendación', 'Hacer una prueba\ntécnica de 1 semana\nantes de estimar', 'dg-success-soft'],
  ]
  const w = 176
  const gap = (W - 32 - 4 * w) / 3
  parts.forEach(([title, body, cls], i) => {
    const x = 16 + i * (w + gap)
    svg.rect(x, 24, w, 168, cls, 16)
    svg.text(x + 16, 56, title, { size: 16, weight: 700 })
    svg.text(x + 16, 88, body, { size: 13.5, cls: 'dg-t2' })
    if (i < 3) svg.arrow(x + w + 2, 108, x + w + gap - 2, 108)
  })
  svg.text(W / 2, H - 24, 'Sin recomendación accionable no es una lección: es una queja', {
    size: 13.5,
    cls: 'dg-t3',
    anchor: 'middle',
  })
  return svg
}

export const exito = () =>
  processGrid(
    'Criterios de éxito del proyecto',
    [
      { title: 'Alcance', body: 'Entregables aceptados\ncontra sus criterios.', tone: 'success' },
      { title: 'Plazo', body: 'Lanzamiento frente\nal hito del acta.', tone: 'success' },
      { title: 'Costo', body: 'Costo real frente\nal presupuesto.', tone: 'success' },
      { title: 'Calidad', body: 'Defectos en producción\ny disponibilidad.' },
      { title: 'Interesados', body: 'Satisfacción de la\ngerente y taquilleros.' },
      { title: 'Beneficio', body: 'El 30 % de ventas\nen línea: se mide\ndespués del cierre.', tone: 'warning' },
    ],
    { cols: 3, cardH: 124, connect: false },
  )
