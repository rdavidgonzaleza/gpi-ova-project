import type { Role } from '../../types/domain'

/** Landing route after signing in, by role. */
export function homeFor(role: Role): string {
  switch (role) {
    case 'docente':
    case 'administrador':
      return '/docente/progreso'
    case 'validador':
      return '/validacion'
    case 'estudiante':
      return '/'
  }
}
