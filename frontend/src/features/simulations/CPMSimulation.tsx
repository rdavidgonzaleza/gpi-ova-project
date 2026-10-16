import { RotateCcw } from 'lucide-react'
import { activitiesApi } from '../../api/activities'
import { Button } from '../../components/Button'
import { cn } from '../../lib/cn'
import { usePersistentState } from '../../lib/usePersistentState'
import type { SimulationConfig } from '../../types/activities'
import type { SimulationReviewData } from '../ai-activity/SimulationReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import { schedule, type NetworkActivity } from './cpm'
import { DelayExplorer } from './DelayExplorer'
import { NetworkTable } from './NetworkTable'
import { NumberField, parseNumber } from './NumberField'
import { SimulationAIReview } from './SimulationAIReview'

interface CPMParams {
  unit: string
  activities: NetworkActivity[]
  slack_question: string
  delay: { activity: string; amount: number }
}

interface Answers {
  duration: string
  critical: string[]
  slack: string
  delayed: string
}

const EMPTY: Answers = { duration: '', critical: [], slack: '', delayed: '' }

interface Props {
  activityId: string
  config: SimulationConfig
  onComplete: (result: Record<string, unknown>) => void
}

export function CPMSimulation({ activityId, config, onComplete }: Props) {
  const params = config.params as unknown as CPMParams
  const { user } = useAuth()
  const scope = `${user?.id}.${activityId}`
  const [answers, setAnswers] = usePersistentState<Answers>(`cpm.${scope}`, EMPTY)
  const [checked, setChecked] = usePersistentState<boolean>(`cpm.${scope}.checked`, false)
  const review = useAIRun<SimulationReviewData>(config.review_ai_activity_id, `${scope}.review`, { json: true })

  const base = schedule(params.activities)
  const delayed = schedule(params.activities, { [params.delay.activity]: params.delay.amount })
  const slackTarget = base.activities.find((a) => a.id === params.slack_question)!
  const delayTarget = base.activities.find((a) => a.id === params.delay.activity)!
  const unit = params.unit

  const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((id) => b.includes(id))
  const results = {
    duration: parseNumber(answers.duration) === base.duration,
    critical: sameSet(answers.critical, base.criticalPath),
    slack: parseNumber(answers.slack) === slackTarget.slack,
    delayed: parseNumber(answers.delayed) === delayed.duration,
  }
  const correct = Object.values(results).filter(Boolean).length
  const complete = answers.duration && answers.slack && answers.delayed && answers.critical.length > 0

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((previous) => ({ ...previous, [key]: value }))
  const toggle = (id: string) =>
    set('critical', answers.critical.includes(id) ? answers.critical.filter((x) => x !== id) : [...answers.critical, id])

  function check() {
    setChecked(true)
    onComplete({ tipo: 'simulacion_ruta_critica', aciertos: correct, total: 4 })
    if (user?.role === 'estudiante') activitiesApi.registerAttempt(activityId, user.id, { ...answers }).catch(() => undefined)
  }

  function reset() {
    setAnswers(EMPTY)
    setChecked(false)
    review.clear()
  }

  function requestReview() {
    review.run({
      red: params.activities.map((a) => ({ actividad: `${a.id} ${a.name}`, duracion: a.duration, predecesoras: a.predecessors })),
      respuestas_del_estudiante: {
        duracion_proyecto: answers.duration,
        ruta_critica: answers.critical.join(' → '),
        [`holgura_de_${params.slack_question}`]: answers.slack,
        [`duracion_si_${params.delay.activity}_se_retrasa_${params.delay.amount}`]: answers.delayed,
      },
      solucion: {
        duracion_proyecto: base.duration,
        ruta_critica: base.criticalPath.join(' → '),
        holguras: Object.fromEntries(base.activities.map((a) => [a.id, a.slack])),
        duracion_con_retraso: delayed.duration,
      },
      errores_detectados: Object.entries(results)
        .filter(([, ok]) => !ok)
        .map(([key]) => key),
    })
  }

  const result = (ok: boolean, expected: string) => (checked ? { ok, expected } : undefined)

  return (
    <div className="space-y-6">
      <NetworkTable activities={params.activities} unit={unit} />

      <div className="grid gap-6 sm:grid-cols-2">
        <NumberField
          label="1. ¿Cuánto dura el proyecto?"
          suffix={unit}
          value={answers.duration}
          onChange={(v) => set('duration', v)}
          disabled={checked}
          result={result(results.duration, `${base.duration} ${unit}`)}
        />
        <NumberField
          label={`2. ¿Cuál es la holgura total de ${slackTarget.id} (${slackTarget.name})?`}
          suffix={unit}
          value={answers.slack}
          onChange={(v) => set('slack', v)}
          disabled={checked}
          result={result(results.slack, `${slackTarget.slack} ${unit}`)}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-subhead font-medium">3. Marca las actividades de la ruta crítica</legend>
        <div className="flex flex-wrap gap-2">
          {params.activities.map((a) => {
            const on = answers.critical.includes(a.id)
            const state = checked ? (on === base.criticalPath.includes(a.id) ? 'ok' : 'bad') : null
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={on}
                disabled={checked}
                onClick={() => toggle(a.id)}
                title={a.name}
                className={cn(
                  'h-11 min-w-11 rounded-full border px-4 text-subhead font-semibold transition-colors disabled:cursor-default',
                  on ? 'border-accent bg-accent text-on-accent' : 'border-separator-strong bg-surface hover:bg-surface-2',
                  state === 'bad' && 'ring-2 ring-danger ring-offset-2 ring-offset-surface',
                )}
              >
                {a.id}
              </button>
            )
          })}
        </div>
        {checked && !results.critical && (
          <p className="text-footnote text-label-2">Ruta crítica esperada: {base.criticalPath.join(' → ')}. Las marcadas en rojo están mal clasificadas.</p>
        )}
      </fieldset>

      <NumberField
        label={`4. Si ${delayTarget.id} (${delayTarget.name}) se retrasa ${params.delay.amount} ${unit}, ¿cuánto dura el proyecto?`}
        suffix={unit}
        value={answers.delayed}
        onChange={(v) => set('delayed', v)}
        disabled={checked}
        result={result(results.delayed, `${delayed.duration} ${unit}`)}
      />

      <div className="flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <p className="text-headline" role="status">
              {correct} de 4 respuestas correctas
            </p>
            <Button variant="secondary" onClick={reset} icon={<RotateCcw className="size-4" aria-hidden />}>
              Intentar de nuevo
            </Button>
          </>
        ) : (
          <Button onClick={check} disabled={!complete}>
            Comprobar
          </Button>
        )}
      </div>

      {checked && (
        <>
          <DelayExplorer network={params.activities} unit={unit} />
          {user && config.review_ai_activity_id && (
            <SimulationAIReview
              review={review}
              onRequest={requestReview}
              buttonLabel="Analizar mi cálculo con IA"
              title="Análisis de tu ruta crítica"
              pendingLabel="Revisando tu pasada hacia adelante y hacia atrás, y el efecto del retraso…"
            />
          )}
        </>
      )}
    </div>
  )
}
