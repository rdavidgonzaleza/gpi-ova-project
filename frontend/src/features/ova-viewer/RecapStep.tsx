import { CheckCircle2, Circle, Sparkles } from 'lucide-react'
import { Button } from '../../components/Button'
import type { OVA } from '../../types/domain'
import { AIPanel, AISignInPrompt } from '../ai-activity/AIPanel'
import { FeedbackList } from '../ai-activity/RubricReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import { SHARED_AI } from '../../content/ids'
import type { Journey } from './useOVAJourney'

interface Recap {
  resumen: string
  fortalezas: string[]
  a_reforzar: Array<{ tema: string; accion: string }>
  siguiente_paso: string
}

export function RecapStep({ ova, journey }: { ova: OVA; journey: Journey }) {
  const { user } = useAuth()
  const recap = useAIRun<Recap>(SHARED_AI.recap, `${user?.id}.${ova.id}.recap`, { json: true })
  const activitySteps = journey.steps.filter((step) => step.kind === 'activity' || step.kind === 'evaluation')
  const finished = activitySteps.filter((step) => journey.completed.has(step.id)).length

  function generate() {
    journey.complete('repaso')
    recap.run({
      ova: ova.title,
      resultado_de_aprendizaje: ova.learning_outcome,
      desempeno: activitySteps.map((step) => ({
        actividad: step.title,
        completada: journey.completed.has(step.id),
        resultado: journey.results[step.id] ?? null,
      })),
    })
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ai-soft px-3 py-1 text-footnote font-semibold text-ai">
          <Sparkles className="size-3.5" aria-hidden />
          Con apoyo de IA
        </span>
        <h2 className="text-title-1 font-bold tracking-tight">Tu repaso personalizado</h2>
        <p className="text-body text-label-2">
          La IA lee cómo te fue en cada actividad de este OVA y te propone qué reforzar antes de pasar a la siguiente
          unidad.
        </p>
      </header>

      <section className="card p-5 sm:p-6" aria-labelledby="actividades">
        <h3 id="actividades" className="text-headline">
          Actividades completadas · {finished} de {activitySteps.length}
        </h3>
        <ul className="mt-3 space-y-2">
          {activitySteps.map((step) => {
            const doneStep = journey.completed.has(step.id)
            return (
              <li key={step.id} className="flex items-center gap-2.5 text-subhead">
                {doneStep ? (
                  <CheckCircle2 className="size-5 text-success" aria-label="Completada" />
                ) : (
                  <Circle className="size-5 text-label-3" aria-label="Pendiente" />
                )}
                <span className={doneStep ? 'text-label' : 'text-label-2'}>{step.title}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {!user ? (
        <AISignInPrompt action="recibir tu repaso personalizado" />
      ) : (
        !recap.result &&
        !recap.pending && (
          <Button variant="ai" onClick={generate} disabled={finished === 0} icon={<Sparkles className="size-4" aria-hidden />}>
            Generar mi repaso
          </Button>
        )
      )}

      {(recap.pending || recap.error || recap.result) && (
        <AIPanel
          title="Repaso de la unidad"
          pendingLabel="Revisando tus resultados para encontrar qué reforzar…"
          pending={recap.pending}
          error={recap.error}
          onRetry={generate}
          retryLabel="Actualizar repaso"
        >
          {recap.result &&
            (recap.result.data ? (
              <div className="space-y-5">
                <p className="text-subhead text-label">{recap.result.data.resumen}</p>
                <FeedbackList title="Fortalezas" items={recap.result.data.fortalezas} />
                {recap.result.data.a_reforzar?.length > 0 && (
                  <div>
                    <h4 className="text-footnote font-semibold tracking-wide text-label-2 uppercase">Para reforzar</h4>
                    <ul className="mt-2 space-y-2">
                      {recap.result.data.a_reforzar.map((item) => (
                        <li key={item.tema} className="rounded-control bg-surface px-4 py-3 text-subhead">
                          <strong className="font-semibold">{item.tema}. </strong>
                          {item.accion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-subhead">
                  <strong className="font-semibold">Siguiente paso: </strong>
                  {recap.result.data.siguiente_paso}
                </p>
              </div>
            ) : (
              <p className="whitespace-pre-line text-subhead">{recap.result.raw}</p>
            ))}
        </AIPanel>
      )}
    </div>
  )
}
