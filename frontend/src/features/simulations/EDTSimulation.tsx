import { useState, type DragEvent } from 'react'
import { Check, Sparkles, Trash2, X } from 'lucide-react'
import { activitiesApi } from '../../api/activities'
import { Button } from '../../components/Button'
import { MilestoneGlyph } from '../../components/BrandMark'
import { cn } from '../../lib/cn'
import { usePersistentState } from '../../lib/usePersistentState'
import type { SimulationConfig } from '../../types/activities'
import { AIPanel } from '../ai-activity/AIPanel'
import { SimulationReview, type SimulationReviewData } from '../ai-activity/SimulationReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'

interface EDTParams {
  branches: Array<{ id: string; name: string }>
  items: Array<{ id: string; text: string; branch: string | null; reason?: string }>
}

const DISCARD = '__descartes'
type Placement = Record<string, string> // item id → branch id | DISCARD

interface Props {
  activityId: string
  config: SimulationConfig
  onComplete: (result: Record<string, unknown>) => void
}

export function EDTSimulation({ activityId, config, onComplete }: Props) {
  const params = config.params as unknown as EDTParams
  const { user } = useAuth()
  const scope = `${user?.id}.${activityId}`
  const [placement, setPlacement] = usePersistentState<Placement>(`edt.${scope}`, {})
  const [checked, setChecked] = usePersistentState<boolean>(`edt.${scope}.checked`, false)
  const [selected, setSelected] = useState<string | null>(null)
  const review = useAIRun<SimulationReviewData>(config.review_ai_activity_id, `${scope}.review`, { json: true })

  const unplaced = params.items.filter((item) => !placement[item.id])
  const isCorrect = (item: EDTParams['items'][number]) => placement[item.id] === (item.branch ?? DISCARD)
  const correct = params.items.filter(isCorrect).length

  function place(itemId: string, target: string) {
    if (checked) return
    setPlacement((previous) => ({ ...previous, [itemId]: target }))
    setSelected(null)
  }

  function unplace(itemId: string) {
    if (checked) return
    setPlacement(({ [itemId]: _removed, ...rest }) => rest)
  }

  function check() {
    setChecked(true)
    onComplete({ tipo: 'simulacion_edt', aciertos: correct, total: params.items.length })
    if (user?.role === 'estudiante') activitiesApi.registerAttempt(activityId, user.id, placement).catch(() => undefined)
  }

  function reset() {
    setPlacement({})
    setChecked(false)
    review.clear()
  }

  function requestReview() {
    const nameOf = (id: string) => (id === DISCARD ? 'Descartado' : params.branches.find((b) => b.id === id)?.name ?? id)
    review.run({
      edt_del_estudiante: params.branches.map((branch) => ({
        rama: branch.name,
        elementos: params.items.filter((item) => placement[item.id] === branch.id).map((item) => item.text),
      })),
      descartados: params.items.filter((item) => placement[item.id] === DISCARD).map((item) => item.text),
      errores_detectados: params.items
        .filter((item) => !isCorrect(item))
        .map((item) => ({
          elemento: item.text,
          ubicado_en: nameOf(placement[item.id]),
          ubicacion_correcta: item.branch ? nameOf(item.branch) : `Fuera de la EDT (${item.reason})`,
        })),
    })
  }

  const dropProps = (target: string) => ({
    onDragOver: (event: DragEvent) => event.preventDefault(),
    onDrop: (event: DragEvent) => {
      event.preventDefault()
      const itemId = event.dataTransfer.getData('text/plain')
      if (!itemId) return
      if (target) place(itemId, target)
      else unplace(itemId)
    },
  })

  const chip = (item: EDTParams['items'][number], where: 'tray' | 'placed') => {
    const state = checked ? (isCorrect(item) ? 'ok' : 'bad') : null
    return (
      <li key={item.id}>
        <button
          type="button"
          draggable={!checked}
          onDragStart={(event) => event.dataTransfer.setData('text/plain', item.id)}
          onClick={() => (where === 'tray' ? setSelected(selected === item.id ? null : item.id) : unplace(item.id))}
          aria-pressed={where === 'tray' ? selected === item.id : undefined}
          aria-label={where === 'placed' && !checked ? `${item.text}. Quitar de esta rama` : item.text}
          disabled={checked}
          className={cn(
            'flex min-h-10 w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-footnote font-medium hyphens-auto transition-colors [overflow-wrap:anywhere]',
            !checked && 'cursor-grab active:cursor-grabbing',
            selected === item.id ? 'border-accent bg-accent text-on-accent' : 'border-separator-strong bg-surface hover:bg-surface-2',
            state === 'ok' && 'border-success bg-success-soft text-label',
            state === 'bad' && 'border-danger bg-danger-soft text-label',
          )}
        >
          {state === 'ok' && <Check className="size-4 shrink-0 text-success" aria-hidden />}
          {state === 'bad' && <X className="size-4 shrink-0 text-danger" aria-hidden />}
          <span>{item.text}</span>
        </button>
        {state === 'bad' && (
          <p className="mt-1 px-1 text-caption text-label-2">
            {item.branch ? `Va en ${params.branches.find((b) => b.id === item.branch)?.name}.` : item.reason}
          </p>
        )}
      </li>
    )
  }

  return (
    <div className="space-y-5">
      {!checked && (
        <div className="card space-y-3 p-4 sm:p-5" {...dropProps('')}>
          <p className="text-footnote font-semibold text-label-2">
            {unplaced.length > 0
              ? `Elementos por ubicar (${unplaced.length}) · arrástralos o tócalos y luego toca la rama`
              : 'Ubicaste todos los elementos. Comprueba tu EDT.'}
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">{unplaced.map((item) => chip(item, 'tray'))}</ul>
        </div>
      )}

      <div className="rounded-card bg-surface-2 p-3 sm:p-4">
        <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-xl bg-accent px-4 py-2 text-subhead font-semibold text-on-accent">
          <MilestoneGlyph className="size-3" />
          RutaCaribe
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {params.branches.map((branch) => (
            <Drop
              key={branch.id}
              title={branch.name}
              active={Boolean(selected)}
              onSelect={() => selected && place(selected, branch.id)}
              {...dropProps(branch.id)}
            >
              <ul className="space-y-2">
                {params.items.filter((item) => placement[item.id] === branch.id).map((item) => chip(item, 'placed'))}
              </ul>
            </Drop>
          ))}
        </div>
        <Drop
          title="Descartes · no pertenece a la EDT"
          icon={<Trash2 className="size-4" aria-hidden />}
          active={Boolean(selected)}
          onSelect={() => selected && place(selected, DISCARD)}
          className="mt-3"
          {...dropProps(DISCARD)}
        >
          <ul className="grid gap-2 sm:grid-cols-3">
            {params.items.filter((item) => placement[item.id] === DISCARD).map((item) => chip(item, 'placed'))}
          </ul>
        </Drop>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <p className="text-headline" role="status">
              {correct} de {params.items.length} elementos bien ubicados
            </p>
            <Button variant="secondary" onClick={reset}>
              Armar de nuevo
            </Button>
            {user && config.review_ai_activity_id && !review.result && (
              <Button variant="ai" onClick={requestReview} loading={review.pending} icon={<Sparkles className="size-4" aria-hidden />}>
                Analizar mi EDT con IA
              </Button>
            )}
          </>
        ) : (
          <Button onClick={check} disabled={unplaced.length > 0}>
            Comprobar EDT
          </Button>
        )}
      </div>

      {(review.pending || review.error || review.result) && (
        <AIPanel
          title="Análisis de tu EDT"
          pendingLabel="Revisando la regla del 100 % y la orientación a entregables de tu EDT…"
          pending={review.pending}
          error={review.error}
          onRetry={requestReview}
        >
          {review.result && <SimulationReview result={review.result} />}
        </AIPanel>
      )}
    </div>
  )
}

interface DropProps {
  title: string
  icon?: React.ReactNode
  active: boolean
  onSelect: () => void
  className?: string
  children: React.ReactNode
  onDragOver: (event: DragEvent) => void
  onDrop: (event: DragEvent) => void
}

function Drop({ title, icon, active, onSelect, className, children, ...drag }: DropProps) {
  return (
    <section
      {...drag}
      className={cn(
        'min-h-28 rounded-2xl border border-dashed bg-surface p-3 transition-colors',
        active ? 'border-accent bg-accent-soft' : 'border-separator-strong',
        className,
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!active}
        className="mb-2 flex w-full items-center gap-1.5 rounded-lg text-left text-footnote font-semibold text-label disabled:cursor-default"
      >
        {icon}
        {title}
        {active && <span className="ml-auto text-caption font-medium text-accent">Mover aquí</span>}
      </button>
      {children}
    </section>
  )
}
