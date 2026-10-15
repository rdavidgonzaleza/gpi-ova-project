import { BookOpen, FilePlus2, LineChart, ShieldCheck, type LucideIcon } from 'lucide-react'
import type { Role } from './types/domain'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  roles?: Role[]
  end?: boolean
}

// Top-level sections. Tabs navigate, never act (HIG tab-bars.md); sections
// appear only for the roles that can use them.
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Aprendizaje', icon: BookOpen, end: true },
  { to: '/docente/progreso', label: 'Progreso', icon: LineChart, roles: ['docente', 'administrador'] },
  { to: '/docente/ovas/nuevo', label: 'Nuevo OVA', icon: FilePlus2, roles: ['docente', 'administrador'] },
  { to: '/validacion', label: 'Validación', icon: ShieldCheck, roles: ['validador', 'docente', 'administrador'] },
]
