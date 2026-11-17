import { useMemo } from 'react'
import { Lightbulb } from 'lucide-react'
import { activitiesApi } from '../../../api/activities'
import { Button } from '../../../components/Button'
import { renderInline } from '../../../lib/markdown'
import { usePersistentState } from '../../../lib/usePersistentState'
import type { QuizConfig, QuizQuestion } from '../../../types/activities'
import { AIPanel, AISignInPrompt } from '../../ai-activity/AIPanel'
import { useAIRun } from '../../ai-activity/useAIRun'
import { useAuth } from '../../auth/useAuth'
import { ActivityShell, type ActivityProps } from '../ActivityShell'
import { ChoiceList } from './ChoiceList'

interface QuizState {
  answers: Record<string, string>
  checked: boolean
}

export function QuizActivity({ id, title, description, config, done, onComplete }: ActivityProps<QuizConfig>) {
  const { user } = useAuth()
  const [state, setState] = usePersistentState<QuizState>(`quiz.${user?.id}.${id}`, { answers: {}, checked: false })
  const total = config.questions.length
  const answered = Object.keys(state.answers).length
  const correct = config.questions.filter((q) => state.answers[q.id] === q.answer).length

  function check() {
    setState((previous) => ({ ...previous, checked: true }))
    onComplete({ tipo: 'quiz', aciertos: correct, total })
    if (user?.role === 'estudiante') {
      // Spec 5.3: every attempt is registered in activity-service.
      activitiesApi.registerAttempt(id, user.id, { ...state.answers, aciertos: correct }).catch(() => undefined)
    }
  }

  return (
    <ActivityShell
      kind="quiz"
      title={title}
      description={description}
      instructions={config.instructions}
      usesAI={Boolean(config.hints_ai_activity_id)}
      done={done}
    >
      <ol className="space-y-5">
        {config.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            activityId={id}
            index={index}
            question={question}
            hintsActivityId={config.hints_ai_activity_id}
            value={state.answers[question.id]}
            checked={state.checked}
            onChange={(value) => setState((previous) => ({ ...previous, answers: { ...previous.answers, [question.id]: value } }))}
          />
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-4">
        {state.checked ? (
          <>
            <p className="text-headline" role="status">
              {correct === total ? '¡Todas correctas!' : `${correct} de ${total} correctas`}
            </p>
            <Button variant="secondary" onClick={() => setState({ answers: {}, checked: false })}>
              Intentar de nuevo
            </Button>
          </>
        ) : (
          <Button onClick={check} disabled={answered < total}>
            Comprobar respuestas
          </Button>
        )}
      </div>
    </ActivityShell>
  )
}

interface QuestionCardProps {
  activityId: string
  index: number
  question: QuizQuestion
  hintsActivityId?: string
  value?: string
  checked: boolean
  onChange: (value: string) => void
}

function QuestionCard({ activityId, index, question, hintsActivityId, value, checked, onChange }: QuestionCardProps) {
  const { user } = useAuth()
  const prompt = useMemo(() => renderInline(question.prompt), [question.prompt])
  const [level, setLevel] = usePersistentState<number>(`hint-level.${user?.id}.${activityId}.${question.id}`, 0)
  const hint = useAIRun(hintsActivityId, `${user?.id}.${activityId}.${question.id}.hint`)
  const isCorrect = value === question.answer

  function askHint(sameLevel = false) {
    const next = sameLevel ? Math.max(level, 1) : Math.min(level + 1, 3)
    setLevel(next)
    hint.run({
      pregunta: question.prompt,
      opciones: question.options.map((option) => option.text),
      opcion_marcada: question.options.find((option) => option.id === value)?.text ?? null,
      nivel: next,
    })
  }

  return (
    <li className="card space-y-4 p-5 sm:p-6">
      <p className="text-headline">
        <span className="mr-2 text-label-3 tabular">{index + 1}.</span>
        <span dangerouslySetInnerHTML={{ __html: prompt }} />
      </p>
      <ChoiceList
        name={`${activityId}-${question.id}`}
        options={question.options}
        value={value}
        onChange={onChange}
        disabled={checked}
        correct={checked ? question.answer : undefined}
      />

      {checked && question.explanation && (
        <p className={isCorrect ? 'text-subhead text-success' : 'text-subhead text-label'}>
          <strong className="font-semibold">{isCorrect ? 'Correcto. ' : 'Revisa esta idea. '}</strong>
          {question.explanation}
        </p>
      )}

      {!checked && hintsActivityId && (
        <div className="space-y-3">
          {!user ? (
            <AISignInPrompt action="pedir pistas a la IA" />
          ) : (
            (hint.result || hint.pending || hint.error) && (
              <AIPanel
                title={`Pista ${level} de 3`}
                pendingLabel="Buscando una pista que no revele la respuesta…"
                pending={hint.pending}
                error={hint.error}
                onRetry={hint.error ? () => askHint(true) : level < 3 ? () => askHint() : undefined}
                retryLabel="Una pista más clara"
              >
                {hint.result && <p className="text-subhead text-label">{hint.result.raw}</p>}
              </AIPanel>
            )
          )}
          {user && !hint.result && !hint.pending && !hint.error && (
            <Button variant="plain" size="sm" icon={<Lightbulb className="size-4" aria-hidden />} onClick={() => askHint()}>
              Pedir una pista
            </Button>
          )}
        </div>
      )}
    </li>
  )
}
