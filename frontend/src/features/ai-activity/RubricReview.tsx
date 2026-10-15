import { cn } from '../../lib/cn'
import type { RubricCriterion } from '../../types/activities'
import type { AIResult } from './useAIRun'

export type RubricLevel = 'logrado' | 'parcial' | 'por_mejorar'

export interface RubricReviewData {
  criterios: Array<{ id: string; nivel: RubricLevel; comentario: string }>
  fortalezas: string[]
  mejoras: string[]
  pregunta_reflexion?: string
}

const LEVEL: Record<RubricLevel, { label: string; className: string }> = {
  logrado: { label: 'Logrado', className: 'bg-success-soft text-success' },
  parcial: { label: 'Parcial', className: 'bg-warning-soft text-warning' },
  por_mejorar: { label: 'Por mejorar', className: 'bg-danger-soft text-danger' },
}

export function RubricReview({ result, rubric }: { result: AIResult<RubricReviewData>; rubric: RubricCriterion[] }) {
  const data = result.data
  if (!data?.criterios) return <p className="whitespace-pre-line text-subhead text-label">{result.raw}</p>

  return (
    <div className="space-y-5">
      <ul className="divide-y divide-separator overflow-hidden rounded-control bg-surface">
        {data.criterios.map((item) => {
          const criterion = rubric.find((c) => c.id === item.id)
          const level = LEVEL[item.nivel] ?? LEVEL.parcial
          return (
            <li key={item.id} className="space-y-1.5 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-subhead font-semibold text-label">{criterion?.name ?? item.id}</span>
                <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-caption font-semibold', level.className)}>
                  {level.label}
                </span>
              </div>
              <p className="text-subhead text-label-2">{item.comentario}</p>
            </li>
          )
        })}
      </ul>
      <FeedbackList title="Lo que hiciste bien" items={data.fortalezas} />
      <FeedbackList title="Para fortalecer tu respuesta" items={data.mejoras} />
      {data.pregunta_reflexion && (
        <p className="rounded-control bg-surface px-4 py-3 text-subhead text-label">
          <strong className="font-semibold">Para pensar: </strong>
          {data.pregunta_reflexion}
        </p>
      )}
    </div>
  )
}

export function FeedbackList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <div>
      <h4 className="text-footnote font-semibold tracking-wide text-label-2 uppercase">{title}</h4>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-subhead text-label marker:text-ai">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
