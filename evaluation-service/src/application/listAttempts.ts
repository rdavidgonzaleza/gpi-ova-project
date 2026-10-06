import type { EvaluationRepository } from "../ports/evaluationRepository.js";

export class ListAttempts {
  constructor(private readonly evaluations: EvaluationRepository) {}

  execute(studentId: string) {
    return this.evaluations.listAttempts(studentId);
  }
}
