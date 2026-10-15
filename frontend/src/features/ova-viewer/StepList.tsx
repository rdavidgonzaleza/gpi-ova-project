import { Link } from 'react-router'
import { BookOpenText, Check, Image, Sparkles } from 'lucide-react'
import { cn } from '../../lib/cn'
import { ACTIVITY_META } from './ActivityShell'
import type { Step } from './useOVAJourney'

export function stepIcon(step: Step) {
  switch (step.kind) {
    case 'block':
      return step.block.type === 'texto' ? BookOpenText : Image
    case 'activity':
      return ACTIVITY_META[step.activity.type].icon
    case 'evaluation':
      return ACTIVITY_META.evaluacion.icon
    case 'recap':
      return Sparkles
  }
}

interface StepListProps {
  ovaId: string
  steps: Step[]
  current?: number
  completed: Set<string>
  onNavigate?: () => void
}

export function StepList({ ovaId, steps, current, completed, onNavigate }: StepListProps) {
  return (
    <ol className="space-y-0.5">
      {steps.map((step, index) => {
        const Icon = stepIcon(step)
        const done = completed.has(step.id)
        const active = index === current
        return (
          <li key={step.id}>
            <Link
              to={`/ovas/${ovaId}/paso/${index + 1}`}
              onClick={onNavigate}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-subhead transition-colors',
                active ? 'bg-accent-soft font-semibold text-accent' : 'text-label hover:bg-surface-2',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full',
                  done ? 'bg-success text-white dark:text-black' : active ? 'bg-accent text-on-accent' : 'bg-surface-2 text-label-2',
                )}
              >
                {done ? <Check className="size-4" aria-label="Completado" /> : <Icon className="size-4" aria-hidden />}
              </span>
              <span className="line-clamp-2">{step.title}</span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
