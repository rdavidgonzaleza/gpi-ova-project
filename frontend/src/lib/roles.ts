import type { Role } from '../types/domain'

export const ROLE_LABEL: Record<Role, string> = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  administrador: 'Administrador',
  validador: 'Validador',
}

export function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}
