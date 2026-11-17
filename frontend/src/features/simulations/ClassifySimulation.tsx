import { useState, type DragEvent } from 'react'
import { Check, X } from 'lucide-react'
import { activitiesApi } from '../../api/activities'
import { Button } from '../../components/Button'
import { cn } from '../../lib/cn'
import { usePersistentState } from '../../lib/usePersistentState'
import type { SimulationConfig } from '../../types/activities'
import type { SimulationReviewData } from '../ai-activity/SimulationReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import { SimulationAIReview } from './SimulationAIReview'

/** `params` of a `clasificacion` simulation (spec 5.3.1). */
export interface ClassifyParams {
  categories: Array<{ id: string; name: string; hint?: string }>
  items: Array<{ id: string; text: string; category: string; reason: string }>
}

interface Props {
  activityId: string
  config: SimulationConfig
  onComplete: (result: Record<string, unknown>) => void
}

/** Sort situations into categories (stakeholder grid, team stages, request types…). */
export function ClassifySimulation({ activityId, config, onComplete }: Props) {
  const params = config.params as unknown as ClassifyParams
  const { user } = useAuth()
  const scope = `${user?.id}.${activityId}`
  const [placement, setPlacement] = usePersistentState<Record<string, string>>(`classify.${scope}`, {})
  const [checked, setChecked] = usePersistentState<boolean>(`classify.${scope}.checked`, false)
  const [selected, setSelected] = useState<string | null>(null)
  const review = useAIRun<SimulationReviewData>(config.review_ai_activity_id, `${scope}.review`, { json: true })

  const nameOf = (id: string) => params.categories.find((c) => c.id === id)?.name ?? id
  const unplaced = params.items.filter((item) => !placement[item.id])
  const isCorrect = (item: ClassifyParams['items'][number]) => placement[item.id] === item.category
  const correct = params.items.filter(isCorrect).length

  function place(itemId: string, category: string) {
    if (checked) return
    setPlacement((previous) => ({ ...previous, [itemId]: category }))
    setSelected(null)
  }

  function unplace(itemId: string) {
    if (!checked) setPlacement(({ [itemId]: _removed, ...rest }) => rest)
  }

  function check() {
    setChecked(true)
    onComplete({ tipo: 'simulacion_clasificacion', aciertos: correct, total: params.items.length })
    if (user?.role === 'estudiante') activitiesApi.registerAttempt(activityId, user.id, placement).catch(() => undefined)
  }

  function reset() {
    setPlacement({})
    setChecked(false)
    review.clear()
  }

  function requestReview() {
    review.run({
      clasificacion_del_estudiante: params.categories.map((c) => ({
        categoria: c.name,
        elementos: params.items.filter((item) => placement[item.id] === c.id).map((item) => item.text),
      })),
      errores_detectados: params.items
        .filter((item) => !isCorrect(item))
        .map((item) => ({ elemento: item.text, ubicado_en: nameOf(placement[item.id]), correcto: nameOf(item.category), motivo: item.reason })),
    })
  }

  const drop = (category: string) => ({
    onDragOver: (event: DragEvent) => event.preventDefault(),
    onDrop: (event: DragEvent) => {
      event.preventDefault()
      const itemId = event.dataTransfer.getData('text/plain')
      if (itemId) (category ? place(itemId, category) : unplace(itemId))
    },
  })

  const chip = (item: ClassifyParams['items'][number], where: 'tray' | 'placed') => {
    const state = checked ? (isCorrect(item) ? 'ok' : 'bad') : null
    return (
      <li key={item.id}>
        <button
          type="button"
          draggable={!checked}
          disabled={checked}
          onDragStart={(event) => event.dataTransfer.setData('text/plain', item.id)}
          onClick={() => (where === 'tray' ? setSelected(selected === item.id ? null : item.id) : unplace(item.id))}
          aria-pressed={where === 'tray' ? selected === item.id : undefined}
          className={cn(
            'flex min-h-10 w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-footnote font-medium transition-colors',
            !checked && 'cursor-grab active:cursor-grabbing',
            selected === item.id ? 'border-accent bg-accent text-on-accent' : 'border-separator-strong bg-surface hover:bg-surface-2',
            state === 'ok' && 'border-success bg-success-soft text-label',
            state === 'bad' && 'border-danger bg-danger-soft text-label',
          )}
        >
          {state === 'ok' && <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />}
          {state === 'bad' && <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />}
          <span>{item.text}</span>
        </button>
        {state === 'bad' && <p className="mt-1 px-1 text-caption text-label-2">Va en {nameOf(item.category)}. {item.reason}</p>}
      </li>
    )
  }

  return (
    <div className="space-y-5">
      {!checked && (
        <div className="card space-y-3 p-4 sm:p-5" {...drop('')}>
          <p className="text-footnote font-semibold text-label-2">
            {unplaced.length > 0
              ? `Situaciones por clasificar (${unplaced.length}) · arrástralas o tócalas y luego toca la categoría`
              : 'Clasificaste todo. Comprueba tu resultado.'}
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">{unplaced.map((item) => chip(item, 'tray'))}</ul>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {params.categories.map((category) => (
          <section
            key={category.id}
            {...drop(category.id)}
            className={cn(
              'min-h-32 rounded-2xl border border-dashed bg-surface p-3 transition-colors',
              selected ? 'border-accent bg-accent-soft' : 'border-separator-strong',
            )}
          >
            <button
              type="button"
              disabled={!selected}
              onClick={() => selected && place(selected, category.id)}
              className="mb-2 w-full rounded-lg text-left disabled:cursor-default"
            >
              <span className="flex items-center text-footnote font-semibold text-label">
                {category.name}
                {selected && <span className="ml-auto text-caption font-medium text-accent">Mover aquí</span>}
              </span>
              {category.hint && <span className="mt-0.5 block text-caption text-label-2">{category.hint}</span>}
            </button>
            <ul className="space-y-2">
              {params.items.filter((item) => placement[item.id] === category.id).map((item) => chip(item, 'placed'))}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <p className="text-headline" role="status">
              {correct} de {params.items.length} bien clasificadas
            </p>
            <Button variant="secondary" onClick={reset}>
              Intentar de nuevo
            </Button>
            {user && config.review_ai_activity_id && (
              <SimulationAIReview
                review={review}
                onRequest={requestReview}
                buttonLabel="Analizar mi clasificación con IA"
                title="Análisis de tu clasificación"
                pendingLabel="Revisando el criterio detrás de cada decisión…"
              />
            )}
          </>
        ) : (
          <Button onClick={check} disabled={unplaced.length > 0}>
            Comprobar
          </Button>
        )}
      </div>
    </div>
  )
}
