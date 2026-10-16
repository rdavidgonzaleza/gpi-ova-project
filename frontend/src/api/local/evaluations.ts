import type { EvaluationsApi } from '../evaluations'
import type { AnswerValue, Evaluation, EvaluationAttempt } from '../../types/domain'
import { fail, now, requireAuth, respond, table, uuid } from './store'

const evaluations = () => table<Evaluation>('evaluations')
const attempts = () => table<EvaluationAttempt>('evaluation_attempts')

// Same grading rule as evaluation-service (domain/evaluationAttempt.ts):
// percentage of correct answers with two decimals; omitted answers are wrong.
function grade(evaluation: Evaluation, answers: Record<string, AnswerValue>) {
  const { questions } = evaluation.config
  const messages: string[] = []
  let correct = 0
  for (const question of questions) {
    const ok = Object.hasOwn(answers, question.id) && answers[question.id] === question.correct_answer
    if (ok) correct += 1
    const message = ok ? question.feedback_correct : question.feedback_incorrect
    if (message) messages.push(message)
  }
  return {
    score: Math.round((correct / questions.length) * 10000) / 100,
    feedback: [`Respuestas correctas: ${correct} de ${questions.length}.`, ...messages].join(' '),
  }
}

export function localEvaluations(): EvaluationsApi {
  return {
    listByOva: (ovaId) => respond(() => evaluations().filter((evaluation) => evaluation.ova_id === ovaId)),

    submitAttempt: (id, studentId, answers) =>
      respond(() => {
        const claims = requireAuth(['estudiante'])
        if (claims.sub !== studentId) fail(403, 'FORBIDDEN', 'student_id no corresponde al token')
        const evaluation = evaluations().get(id)
        if (!evaluation) fail(404, 'NOT_FOUND', 'evaluación no encontrada')
        const result = grade(evaluation, answers)
        attempts().insert({ id: uuid(), evaluation_id: id, student_id: studentId, answers, ...result, submitted_at: now() })
        return result
      }),

    history: (studentId) =>
      respond(() => {
        const claims = requireAuth()
        if (claims.role === 'estudiante' && claims.sub !== studentId) {
          fail(403, 'FORBIDDEN', 'solo puedes consultar tu propio historial')
        }
        if (claims.role === 'validador') fail(403, 'FORBIDDEN', 'rol sin acceso al historial')
        return attempts()
          .filter((attempt) => attempt.student_id === studentId)
          .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))
      }),
  }
}
