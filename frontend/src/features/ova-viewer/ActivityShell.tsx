import type { ReactNode } from 'react'
import { CheckCircle2, ClipboardCheck, FlaskConical, ListChecks, MessagesSquare, Sparkles, type LucideIcon } from 'lucide-react'
import type { ActivityType } from '../../types/domain'

export const ACTIVITY_META: Record<ActivityType | 'evaluacion', { label: string; icon: LucideIcon }> = {
  quiz: { label: 'Quiz', icon: ListChecks },
  caso_estudio: { label: 'Caso de estudio', icon: ClipboardCheck },
  simulacion: { label: 'Simulación', icon: FlaskConical },
  colaborativa: { label: 'Trabajo en equipo', icon: MessagesSquare },
  evaluacion: { label: 'Autoevaluación', icon: CheckCircle2 },
}

interface ActivityShellProps {
  kind: ActivityType | 'evaluacion'
  title: string
  description?: string | null
  instructions?: string
  usesAI?: boolean
  done?: boolean
  children: ReactNode
}

export function ActivityShell({ kind, title, description, instructions, usesAI, done, children }: ActivityShellProps) {
  const { label, icon: Icon } = ACTIVITY_META[kind]
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-footnote font-semibold text-accent">
            <Icon className="size-4" aria-hidden />
            {label}
          </span>
          {usesAI && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ai-soft px-3 py-1 text-footnote font-semibold text-ai">
              <Sparkles className="size-3.5" aria-hidden />
              Con apoyo de IA
            </span>
          )}
          {done && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-footnote font-semibold text-success">
              <CheckCircle2 className="size-3.5" aria-hidden />
              Completada
            </span>
          )}
        </div>
        <h2 className="text-title-1 font-bold tracking-tight">{title}</h2>
        {description && <p className="text-body text-label-2">{description}</p>}
        {instructions && <p className="rounded-control bg-surface-2 px-4 py-3 text-subhead text-label">{instructions}</p>}
      </header>
      {children}
    </div>
  )
}

export interface ActivityProps<C> {
  id: string
  title: string
  description: string | null
  config: C
  done: boolean
  onComplete: (result: Record<string, unknown>) => void
}
