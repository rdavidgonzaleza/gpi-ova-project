import { randomUUID } from "node:crypto";
import type { EvaluationRepository } from "../ports/evaluationRepository.js";
import { gradeAnswers } from "../domain/evaluationAttempt.js";

export class EvaluationNotFoundError extends Error {}

export class RegisterAttempt {
  constructor(private readonly evaluations: EvaluationRepository) {}

  async execute(
    evaluationId: string,
    studentId: string,
    answers: Record<string, unknown>,
  ): Promise<{ score: number; feedback: string }> {
    const evaluation = await this.evaluations.findEvaluation(evaluationId);
    if (!evaluation) throw new EvaluationNotFoundError();

    const result = gradeAnswers(evaluation.config, answers);
    await this.evaluations.saveAttempt({
      id: randomUUID(),
      evaluation_id: evaluationId,
      student_id: studentId,
      answers,
      score: result.score,
      feedback: result.feedback,
      submitted_at: new Date().toISOString(),
    });
    return result;
  }
}
