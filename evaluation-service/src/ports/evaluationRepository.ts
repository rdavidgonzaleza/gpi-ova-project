import type { Evaluation } from "../domain/evaluation.js";
import type { EvaluationAttempt } from "../domain/evaluationAttempt.js";

export interface EvaluationRepository {
  findEvaluation(id: string): Promise<Evaluation | null>;
  listEvaluationsByOva(ovaId: string): Promise<Evaluation[]>;
  saveAttempt(attempt: EvaluationAttempt): Promise<void>;
  listAttempts(studentId: string): Promise<EvaluationAttempt[]>;
}
