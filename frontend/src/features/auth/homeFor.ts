import type { Role } from '../../types/domain'

/** Landing route after signing in, by role. */
export function homeFor(role: Role): string {
  switch (role) {
    case 'estudiante':
    case 'docente':
    case 'administrador':
    case 'validador':
      return '/'
  }
}
