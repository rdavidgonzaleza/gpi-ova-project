import type { EvaluationRepository } from "../ports/evaluationRepository.js";

export class ListEvaluations {
  constructor(private readonly evaluations: EvaluationRepository) {}

  execute(ovaId: string) {
    return this.evaluations.listEvaluationsByOva(ovaId);
  }
}
