import { alcance } from './alcance'
import { costos } from './costos'
import { cronograma } from './cronograma'
import { riesgos } from './riesgos'
import type { CourseUnit } from './types'

/** Course content, in learning-path order. */
export const COURSE_UNITS: CourseUnit[] = [alcance, cronograma, costos, riesgos]
