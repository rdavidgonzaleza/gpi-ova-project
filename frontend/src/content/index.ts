import { alcance } from './alcance'
import { cambios } from './cambios'
import { cierre } from './cierre'
import { costos } from './costos'
import { cronograma } from './cronograma'
import { ejecucion } from './ejecucion'
import { inicio } from './inicio'
import { riesgos } from './riesgos'
import type { CourseUnit } from './types'

/** Course content, in learning-path order: the project life cycle. */
export const COURSE_UNITS: CourseUnit[] = [inicio, alcance, cronograma, costos, riesgos, ejecucion, cambios, cierre]
