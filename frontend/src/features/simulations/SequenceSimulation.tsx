import { ArrowDown, ArrowUp, Check, X } from 'lucide-react'
import { activitiesApi } from '../../api/activities'
import { Button } from '../../components/Button'
import { cn } from '../../lib/cn'
import { usePersistentState } from '../../lib/usePersistentState'
import type { SimulationConfig } from '../../types/activities'
import type { SimulationReviewData } from '../ai-activity/SimulationReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import { SimulationAIReview } from './SimulationAIReview'

/** `params` of a `secuencia` simulation: `steps` in the correct order (spec 5.3.1). */
export interface SequenceParams {
  steps: Array<{ id: string; text: string; why: string }>
}

interface Props {
  activityId: string
  config: SimulationConfig
  onComplete: (result: Record<string, unknown>) => void
}

/** Same scrambled order for everyone, never the solved one. */
function scramble(ids: string[]): string[] {
  const out = [...ids].sort((a, b) => (a.charCodeAt(a.length - 1) * 7) % 11 - (b.charCodeAt(b.length - 1) * 7) % 11)
  return out.every((id, i) => id === ids[i]) ? [...ids].reverse() : out
}

/** Put the steps of a process in order (closing checklist, change control…). */
export function SequenceSimulation({ activityId, config, onComplete }: Props) {
  const params = config.params as unknown as SequenceParams
  const solution = params.steps.map((s) => s.id)
  const { user } = useAuth()
  const scope = `${user?.id}.${activityId}`
  const [order, setOrder] = usePersistentState<string[]>(`sequence.${scope}`, scramble(solution))
  const [checked, setChecked] = usePersistentState<boolean>(`sequence.${scope}.checked`, false)
  const review = useAIRun<SimulationReviewData>(config.review_ai_activity_id, `${scope}.review`, { json: true })

  const step = (id: string) => params.steps.find((s) => s.id === id)!
  const correct = order.filter((id, i) => solution[i] === id).length

  function move(index: number, delta: number) {
    setOrder((current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(index + delta, 0, item)
      return next
    })
  }

  function check() {
    setChecked(true)
    onComplete({ tipo: 'simulacion_secuencia', aciertos: correct, total: solution.length })
    if (user?.role === 'estudiante') activitiesApi.registerAttempt(activityId, user.id, { orden: order }).catch(() => undefined)
  }

  function reset() {
    setOrder(scramble(solution))
    setChecked(false)
    review.clear()
  }

  function requestReview() {
    review.run({
      orden_del_estudiante: order.map((id) => step(id).text),
      orden_correcto: solution.map((id) => step(id).text),
      pasos_fuera_de_lugar: order.flatMap((id, i) =>
        solution[i] === id ? [] : [{ paso: step(id).text, puesto_en: i + 1, va_en: solution.indexOf(id) + 1, motivo: step(id).why }],
      ),
    })
  }

  return (
    <div className="space-y-5">
      <ol className="space-y-2">
        {order.map((id, index) => {
          const state = checked ? (solution[index] === id ? 'ok' : 'bad') : null
          return (
            <li
              key={id}
              className={cn(
                'flex items-start gap-3 rounded-2xl border bg-surface p-3',
                state === 'ok' ? 'border-success bg-success-soft' : state === 'bad' ? 'border-danger bg-danger-soft' : 'border-separator-strong',
              )}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-subhead font-semibold tabular-nums">{index + 1}</span>
              <div className="min-w-0 flex-1 pt-1">
                <p className="flex items-start gap-1.5 text-subhead font-medium">
                  {state === 'ok' && <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />}
                  {state === 'bad' && <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />}
                  {step(id).text}
                </p>
                {state === 'bad' && (
                  <p className="mt-1 text-caption text-label-2">
                    Va en el paso {solution.indexOf(id) + 1}. {step(id).why}
                  </p>
                )}
              </div>
              {!checked && (
                <div className="flex shrink-0 flex-col">
                  <button type="button" aria-label={`Subir: ${step(id).text}`} disabled={index === 0} onClick={() => move(index, -1)} className="grid size-9 place-items-center rounded-full text-label-2 hover:bg-surface-2 disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" aria-label={`Bajar: ${step(id).text}`} disabled={index === order.length - 1} onClick={() => move(index, 1)} className="grid size-9 place-items-center rounded-full text-label-2 hover:bg-surface-2 disabled:opacity-30">
                    <ArrowDown className="size-4" />
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <p className="text-headline" role="status">
              {correct} de {solution.length} pasos en su lugar
            </p>
            <Button variant="secondary" onClick={reset}>
              Ordenar de nuevo
            </Button>
            {user && config.review_ai_activity_id && (
              <SimulationAIReview
                review={review}
                onRequest={requestReview}
                buttonLabel="Analizar mi secuencia con IA"
                title="Análisis de tu secuencia"
                pendingLabel="Revisando la lógica del orden que elegiste…"
              />
            )}
          </>
        ) : (
          <Button onClick={check}>Comprobar el orden</Button>
        )}
      </div>
    </div>
  )
}
