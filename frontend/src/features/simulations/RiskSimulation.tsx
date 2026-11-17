import { RotateCcw } from 'lucide-react'
import { activitiesApi } from '../../api/activities'
import { Button } from '../../components/Button'
import { usePersistentState } from '../../lib/usePersistentState'
import type { SimulationConfig } from '../../types/activities'
import type { SimulationReviewData } from '../ai-activity/SimulationReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import { RiskCard } from './RiskCard'
import { RiskMatrix } from './RiskMatrix'
import { LEVELS, grade, zone, type Risk, type RiskAnswer } from './risk'
import { SimulationAIReview } from './SimulationAIReview'

interface Props {
  activityId: string
  config: SimulationConfig
  onComplete: (result: Record<string, unknown>) => void
}

const levelName = (value?: number) => LEVELS.find((l) => l.value === value)?.label.toLowerCase()

export function RiskSimulation({ activityId, config, onComplete }: Props) {
  const risks = (config.params as unknown as { risks: Risk[] }).risks
  const { user } = useAuth()
  const scope = `${user?.id}.${activityId}`
  const [answers, setAnswers] = usePersistentState<Record<string, RiskAnswer>>(`riesgos.${scope}`, {})
  const [checked, setChecked] = usePersistentState<boolean>(`riesgos.${scope}.checked`, false)
  const review = useAIRun<SimulationReviewData>(config.review_ai_activity_id, `${scope}.review`, { json: true })

  const complete = risks.every((r) => answers[r.id]?.p && answers[r.id]?.i && answers[r.id]?.r)
  const correct = risks.filter((r) => grade(r, answers[r.id]).ok).length

  function check() {
    setChecked(true)
    onComplete({ tipo: 'simulacion_matriz_riesgos', aciertos: correct, total: risks.length })
    if (user?.role === 'estudiante') activitiesApi.registerAttempt(activityId, user.id, answers).catch(() => undefined)
  }

  function reset() {
    setAnswers({})
    setChecked(false)
    review.clear()
  }

  function requestReview() {
    review.run({
      registro_del_estudiante: risks.map((r, index) => {
        const a = answers[r.id] ?? {}
        const result = grade(r, a)
        return {
          riesgo: `R${index + 1}: ${r.text}`,
          tipo: r.type,
          probabilidad: levelName(a.p),
          impacto: levelName(a.i),
          prioridad: a.p && a.i ? zone(a.p, a.i) : null,
          respuesta: a.r,
          prioridad_esperada: zone(r.probability, r.impact),
          respuestas_aceptadas: r.responses,
          correcto: result.ok,
        }
      }),
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ol className="space-y-3">
          {risks.map((risk, index) => (
            <RiskCard
              key={risk.id}
              index={index}
              risk={risk}
              answer={answers[risk.id]}
              onChange={(answer) => setAnswers((previous) => ({ ...previous, [risk.id]: answer }))}
              checked={checked}
            />
          ))}
        </ol>
        <aside className="card space-y-3 p-4 lg:sticky lg:top-20" aria-label="Matriz de probabilidad e impacto">
          <h4 className="text-headline">Tu matriz</h4>
          <RiskMatrix risks={risks} answers={answers} />
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <p className="text-headline" role="status">
              {correct} de {risks.length} riesgos bien priorizados y con la respuesta adecuada
            </p>
            <Button variant="secondary" onClick={reset} icon={<RotateCcw className="size-4" aria-hidden />}>
              Intentar de nuevo
            </Button>
          </>
        ) : (
          <Button onClick={check} disabled={!complete}>
            Comprobar registro
          </Button>
        )}
      </div>

      {checked && user && config.review_ai_activity_id && (
        <SimulationAIReview
          review={review}
          onRequest={requestReview}
          buttonLabel="Analizar mi registro con IA"
          title="Análisis de tu registro de riesgos"
          pendingLabel="Revisando la priorización de cada riesgo y las respuestas que elegiste…"
        />
      )}
    </div>
  )
}
