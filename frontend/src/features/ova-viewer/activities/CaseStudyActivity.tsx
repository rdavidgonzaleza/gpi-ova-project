import { useMemo } from 'react'
import { Shuffle, Sparkles, Undo2 } from 'lucide-react'
import { activitiesApi } from '../../../api/activities'
import { Button } from '../../../components/Button'
import { TextArea } from '../../../components/TextArea'
import { renderMarkdown } from '../../../lib/markdown'
import { usePersistentState } from '../../../lib/usePersistentState'
import type { CaseStudyConfig } from '../../../types/activities'
import { AIPanel, AISignInPrompt } from '../../ai-activity/AIPanel'
import { RubricReview, type RubricReviewData } from '../../ai-activity/RubricReview'
import { useAIRun } from '../../ai-activity/useAIRun'
import { useAuth } from '../../auth/useAuth'
import { ActivityShell, type ActivityProps } from '../ActivityShell'

const MIN_ANSWER = 40

interface Variant {
  titulo: string
  escenario: string
}

export function CaseStudyActivity({ id, title, description, config, done, onComplete }: ActivityProps<CaseStudyConfig>) {
  const { user } = useAuth()
  const scope = `${user?.id}.${id}`
  const [answers, setAnswers] = usePersistentState<Record<string, string>>(`case.${scope}`, {})
  const review = useAIRun<RubricReviewData>(config.review_ai_activity_id, `${scope}.review`, { json: true })
  const variant = useAIRun<Variant>(config.variant_ai_activity_id, `${scope}.variant`, { json: true })

  const scenario = variant.result?.data?.escenario ?? config.scenario
  const scenarioHtml = useMemo(() => renderMarkdown(scenario), [scenario])
  const ready = config.questions.every((q) => (answers[q.id] ?? '').trim().length >= MIN_ANSWER)

  async function requestReview() {
    const result = await review.run({
      escenario: scenario,
      respuestas: config.questions.map((q) => ({ pregunta: q.prompt, respuesta: answers[q.id] ?? '' })),
    })
    if (!result) return
    const levels = Object.fromEntries((result.data?.criterios ?? []).map((c) => [c.id, c.nivel]))
    onComplete({ tipo: 'caso_estudio', niveles_rubrica: levels })
    if (user?.role === 'estudiante') {
      activitiesApi.registerAttempt(id, user.id, { ...answers, interaction_id: result.interactionId }).catch(() => undefined)
    }
  }

  function newVariant() {
    review.clear()
    setAnswers({})
    variant.run({ preferencias: 'Ninguna en particular' })
  }

  function backToOriginal() {
    variant.clear()
    review.clear()
    setAnswers({})
  }

  return (
    <ActivityShell kind="caso_estudio" title={title} description={description} usesAI done={done}>
      <article className="card overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-separator px-5 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-footnote font-semibold text-label-2">
            {variant.result?.data ? (
              <>
                <Sparkles className="size-4 text-ai" aria-hidden />
                Variante generada con IA · {variant.result.data.titulo}
              </>
            ) : (
              'Caso'
            )}
          </p>
          {user && config.variant_ai_activity_id && (
            <div className="flex gap-1">
              {variant.result?.data && (
                <Button variant="plain" size="sm" icon={<Undo2 className="size-4" aria-hidden />} onClick={backToOriginal}>
                  Caso original
                </Button>
              )}
              <Button
                variant="plain"
                size="sm"
                icon={<Shuffle className="size-4" aria-hidden />}
                onClick={newVariant}
                loading={variant.pending}
              >
                Practicar con otra variante
              </Button>
            </div>
          )}
        </header>
        <div className="prose-ova px-5 py-5 sm:px-6" dangerouslySetInnerHTML={{ __html: scenarioHtml }} />
        {variant.error && <p className="px-6 pb-4 text-footnote text-danger">{variant.error}</p>}
      </article>

      <div className="space-y-5">
        {config.questions.map((question, index) => (
          <TextArea
            key={question.id}
            label={`${index + 1}. ${question.prompt}`}
            placeholder={question.placeholder}
            value={answers[question.id] ?? ''}
            onChange={(event) => setAnswers((previous) => ({ ...previous, [question.id]: event.target.value }))}
            hint={`Mínimo ${MIN_ANSWER} caracteres.`}
            rows={4}
          />
        ))}
      </div>

      <details className="card group px-5 py-4 sm:px-6">
        <summary className="cursor-pointer text-subhead font-semibold text-label marker:text-accent">
          Criterios con los que se revisará tu respuesta
        </summary>
        <ul className="mt-3 space-y-2">
          {config.rubric.map((criterion) => (
            <li key={criterion.id} className="text-subhead text-label-2">
              <strong className="font-semibold text-label">{criterion.name}.</strong> {criterion.description}
            </li>
          ))}
        </ul>
      </details>

      {user ? (
        <Button variant="ai" onClick={requestReview} disabled={!ready} loading={review.pending} icon={<Sparkles className="size-4" aria-hidden />}>
          {review.result ? 'Revisar de nuevo' : 'Recibir retroalimentación'}
        </Button>
      ) : (
        <AISignInPrompt action="recibir retroalimentación con IA" />
      )}

      {(review.pending || review.error || review.result) && (
        <AIPanel
          title="Retroalimentación según la rúbrica"
          pendingLabel="Comparando tus respuestas con cada criterio de la rúbrica…"
          pending={review.pending}
          error={review.error}
          onRetry={ready ? requestReview : undefined}
        >
          {review.result && <RubricReview result={review.result} rubric={config.rubric} />}
        </AIPanel>
      )}
    </ActivityShell>
  )
}
