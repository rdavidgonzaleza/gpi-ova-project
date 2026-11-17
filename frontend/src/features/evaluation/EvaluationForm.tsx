import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { History, Sparkles } from 'lucide-react'
import { ApiError } from '../../api/client'
import { evaluationsApi } from '../../api/evaluations'
import { Button } from '../../components/Button'
import { cn } from '../../lib/cn'
import { renderInline } from '../../lib/markdown'
import { usePersistentState } from '../../lib/usePersistentState'
import type { QuizConfig } from '../../types/activities'
import type { Evaluation, EvaluationResult } from '../../types/domain'
import { AIPanel } from '../ai-activity/AIPanel'
import { FeedbackList } from '../ai-activity/RubricReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import { ActivityShell } from '../ova-viewer/ActivityShell'
import { ChoiceList } from '../ova-viewer/activities/ChoiceList'

interface Props {
  ovaTitle: string
  title: string
  description: string | null
  config: QuizConfig
  evaluation: Evaluation | undefined
  done: boolean
  onComplete: (result: Record<string, unknown>) => void
}

interface Explanation {
  explicaciones: Array<{ pregunta: string; explicacion: string; concepto: string }>
  siguiente_paso: string
}

/** UC-11: answer a self-assessment graded by evaluation-service (RF-12, RF-13). */
export function EvaluationForm({ ovaTitle, title, description, config, evaluation, done, onComplete }: Props) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const scope = `${user?.id}.${evaluation?.id}`
  const [answers, setAnswers] = usePersistentState<Record<string, string>>(`eval.${scope}.answers`, {})
  const [result, setResult] = usePersistentState<EvaluationResult | null>(`eval.${scope}.result`, null)
  const explain = useAIRun<Explanation>(config.explain_ai_activity_id, `${scope}.explain`, { json: true })
  const isStudent = user?.role === 'estudiante'

  const history = useQuery({
    queryKey: ['evaluation-history', user?.id],
    queryFn: () => evaluationsApi.history(user!.id),
    enabled: isStudent,
    select: (rows) => rows.filter((row) => row.evaluation_id === evaluation?.id),
  })

  const submit = useMutation({
    mutationFn: () => evaluationsApi.submitAttempt(evaluation!.id, user!.id, answers),
    onSuccess: (response) => {
      setResult(response)
      explain.clear()
      onComplete({ tipo: 'autoevaluacion', puntaje: response.score })
      queryClient.invalidateQueries({ queryKey: ['evaluation-history', user?.id] })
    },
  })

  const answered = config.questions.every((q) => answers[q.id])

  function retry() {
    setAnswers({})
    setResult(null)
    explain.clear()
  }

  function requestExplanation() {
    if (!result) return
    explain.run({
      ova: ovaTitle,
      puntaje: result.score,
      retroalimentacion_oficial: result.feedback,
      preguntas: config.questions.map((q) => ({
        pregunta: q.prompt,
        opciones: q.options.map((o) => o.text),
        respuesta_del_estudiante: q.options.find((o) => o.id === answers[q.id])?.text ?? null,
      })),
    })
  }

  return (
    <ActivityShell kind="evaluacion" title={title} description={description} usesAI={Boolean(config.explain_ai_activity_id)} done={done}>
      {!evaluation ? (
        <p className="card px-5 py-4 text-subhead text-label-2">
          La autoevaluación de este OVA no está disponible en este momento. Puedes continuar y volver más tarde.
        </p>
      ) : (
        <>
          <ol className="space-y-5">
            {config.questions.map((question, index) => (
              <li key={question.id} className="card space-y-4 p-5 sm:p-6">
                <p className="text-headline">
                  <span className="mr-2 text-label-3 tabular">{index + 1}.</span>
                  <span dangerouslySetInnerHTML={{ __html: renderInline(question.prompt) }} />
                </p>
                <ChoiceList
                  name={`eval-${question.id}`}
                  options={question.options}
                  value={answers[question.id]}
                  onChange={(value) => setAnswers((previous) => ({ ...previous, [question.id]: value }))}
                  disabled={Boolean(result) || submit.isPending}
                />
              </li>
            ))}
          </ol>

          {result ? (
            <ScoreCard result={result} onRetry={retry} />
          ) : isStudent ? (
            <div className="space-y-3">
              <Button onClick={() => submit.mutate()} disabled={!answered} loading={submit.isPending}>
                Enviar autoevaluación
              </Button>
              {submit.error && (
                <p role="alert" className="text-subhead text-danger">
                  {submit.error instanceof ApiError ? submit.error.message : 'No fue posible enviar tus respuestas.'}
                </p>
              )}
            </div>
          ) : (
            <p className="rounded-control bg-surface-2 px-4 py-3 text-subhead text-label-2">
              {user
                ? 'Vista previa: solo las cuentas de estudiante registran intentos de autoevaluación.'
                : 'Inicia sesión como estudiante para registrar tu autoevaluación.'}
            </p>
          )}

          {result && result.score < 100 && config.explain_ai_activity_id && !explain.result && !explain.pending && (
            <Button variant="ai" onClick={requestExplanation} icon={<Sparkles className="size-4" aria-hidden />}>
              Explicar mis errores
            </Button>
          )}

          {(explain.pending || explain.error || explain.result) && (
            <AIPanel
              title="Explicación de tus errores"
              pendingLabel="Analizando qué conceptos se cruzaron en tus respuestas…"
              pending={explain.pending}
              error={explain.error}
              onRetry={requestExplanation}
            >
              {explain.result &&
                (explain.result.data ? (
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {explain.result.data.explicaciones.map((item) => (
                        <li key={item.pregunta} className="rounded-control bg-surface px-4 py-3">
                          <p className="text-subhead font-semibold text-label">{item.pregunta}</p>
                          <p className="mt-1 text-subhead text-label">{item.explicacion}</p>
                          <p className="mt-2 text-footnote text-ai">Repasa: {item.concepto}</p>
                        </li>
                      ))}
                    </ul>
                    <FeedbackList title="Siguiente paso" items={[explain.result.data.siguiente_paso]} />
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-subhead">{explain.result.raw}</p>
                ))}
            </AIPanel>
          )}

          {isStudent && (history.data?.length ?? 0) > 0 && (
            <section className="card p-5 sm:p-6" aria-labelledby="historial">
              <h3 id="historial" className="flex items-center gap-2 text-headline">
                <History className="size-5 text-label-2" aria-hidden />
                Tus intentos
              </h3>
              <ul className="mt-3 divide-y divide-separator">
                {history.data!.map((attempt) => (
                  <li key={attempt.id} className="flex items-center justify-between py-2.5 text-subhead">
                    <span className="text-label-2">
                      {new Date(attempt.submitted_at).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="font-semibold tabular">{Number(attempt.score).toFixed(0)} %</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </ActivityShell>
  )
}

function ScoreCard({ result, onRetry }: { result: EvaluationResult; onRetry: () => void }) {
  const score = Number(result.score)
  const tone = score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-danger'
  const [summary, ...details] = result.feedback.split(/(?<=\.)\s+/)
  return (
    <section className="card animate-rise flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6" role="status">
      <div className="relative grid size-24 shrink-0 place-items-center">
        <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--surface-3)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 97.4} 97.4`}
            className={cn(tone, 'transition-[stroke-dasharray] duration-700')}
          />
        </svg>
        <span className="text-title-2 font-bold tabular">{score.toFixed(0)}%</span>
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-headline">{summary}</p>
        {details.length > 0 && <p className="text-subhead text-label-2">{details.join(' ')}</p>}
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Intentar de nuevo
        </Button>
      </div>
    </section>
  )
}
