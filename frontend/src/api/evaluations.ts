import { http } from './client'
import { localEvaluations } from './local/evaluations'
import { pick } from './source'
import type { AnswerValue, Evaluation, EvaluationAttempt, EvaluationResult, UUID } from '../types/domain'

// evaluation-service — spec 5.5
export interface EvaluationsApi {
  listByOva(ovaId: UUID): Promise<Evaluation[]>
  submitAttempt(id: UUID, studentId: UUID, answers: Record<string, AnswerValue>): Promise<EvaluationResult>
  history(studentId: UUID): Promise<EvaluationAttempt[]>
}

const remote: EvaluationsApi = {
  listByOva: (ovaId) => http('/api/evaluations', { query: { ova_id: ovaId } }),
  submitAttempt: (id, studentId, answers) =>
    http(`/api/evaluations/${id}/attempts`, { method: 'POST', body: { student_id: studentId, answers } }),
  history: (studentId) => http('/api/evaluations/attempts', { query: { student_id: studentId } }),
}

export const evaluationsApi = pick('evaluation', { remote, local: localEvaluations })
