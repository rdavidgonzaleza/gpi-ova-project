import { Link } from 'react-router'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { MilestoneProgress } from '../../components/MilestoneProgress'
import { cn } from '../../lib/cn'
import type { OVA, Progress } from '../../types/domain'
import { topicIcon } from './topics'

interface OVACardProps {
  ova: OVA
  index: number
  progress?: Progress
  showProgress: boolean
}

function progressLabel(progress?: Progress) {
  if (!progress || progress.status === 'no_iniciado') return 'Sin empezar'
  if (progress.status === 'completado') return 'Completado'
  return `${progress.percent_complete}% completado`
}

export function OVACard({ ova, index, progress, showProgress }: OVACardProps) {
  const Icon = topicIcon(ova.title)
  const completed = progress?.status === 'completado'
  const percent = progress?.percent_complete ?? 0

  return (
    <Link
      to={`/ovas/${ova.id}`}
      className={cn(
        'card group animate-rise flex w-full flex-col gap-5 p-6 transition-[transform,box-shadow] duration-300',
        'hover:-translate-y-0.5 hover:shadow-raised focus-visible:-translate-y-0.5',
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Icon className="size-6" strokeWidth={1.8} aria-hidden />
        </span>
        <span className="text-footnote font-medium text-label-2 tabular">Unidad {index + 1}</span>
      </div>

      <div className="flex-1">
        <h2 className="text-title-3 font-semibold">
          {ova.title}
          {ova.status === 'borrador' && (
            <span className="ml-2 inline-block rounded-full bg-warning-soft px-2 py-0.5 align-middle text-caption font-semibold text-warning">
              Borrador
            </span>
          )}
        </h2>
        <p className="mt-2 text-subhead text-label-2">{ova.description}</p>
      </div>

      {showProgress ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-footnote">
            <span className={cn('flex items-center gap-1.5 font-medium', completed ? 'text-success' : 'text-label-2')}>
              {completed && <CheckCircle2 className="size-4" aria-hidden />}
              {progressLabel(progress)}
            </span>
            <span className="flex items-center gap-1 font-semibold text-accent">
              {percent > 0 && !completed ? 'Continuar' : completed ? 'Repasar' : 'Empezar'}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
          <MilestoneProgress value={percent} milestones={[25, 50, 75, 100]} label={`Progreso en ${ova.title}`} />
        </div>
      ) : (
        <span className="flex items-center gap-1 text-footnote font-semibold text-accent">
          Explorar
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      )}
    </Link>
  )
}
