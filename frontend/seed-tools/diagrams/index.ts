// Writes the OVA diagrams to public/ovas. Run with `pnpm diagrams` after
// changing any file in this folder.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as alcance from './alcance'
import * as costos from './costos'
import * as cronograma from './cronograma'
import * as riesgos from './riesgos'
import type { Svg } from './svg'

const out = join(dirname(fileURLToPath(import.meta.url)), '../../public/ovas')

const diagrams: Record<string, () => Svg> = {
  'alcance-producto-proyecto': alcance.productoProyecto,
  'alcance-procesos': alcance.procesos,
  'alcance-edt': alcance.edt,
  'alcance-reglas-edt': alcance.reglasEdt,
  'alcance-control-cambios': alcance.controlCambios,
  'cronograma-procesos': cronograma.procesos,
  'cronograma-pert': cronograma.pert,
  'cronograma-red': cronograma.red,
  'cronograma-holgura': cronograma.holgura,
  'cronograma-compresion': cronograma.compresion,
  'costos-procesos': costos.procesos,
  'costos-presupuesto': costos.presupuesto,
  'costos-curva-s': costos.curvaS,
  'costos-indicadores': costos.indicadores,
  'costos-cuadrantes': costos.cuadrantes,
  'riesgos-riesgo-problema': riesgos.riesgoProblema,
  'riesgos-procesos': riesgos.procesos,
  'riesgos-enunciado': riesgos.enunciado,
  'riesgos-matriz': riesgos.matriz,
  'riesgos-estrategias': riesgos.estrategias,
}

mkdirSync(out, { recursive: true })
for (const [name, build] of Object.entries(diagrams)) {
  writeFileSync(join(out, `${name}.svg`), build().toString())
}
console.log(`${Object.keys(diagrams).length} diagramas en public/ovas`)
