import { toPublicEvaluation, type PublicEvaluation } from "../domain/evaluation.js";
import type { EvaluationRepository } from "../ports/evaluationRepository.js";

export class ListEvaluations {
  constructor(private readonly evaluations: EvaluationRepository) {}

  async execute(ovaId: string): Promise<PublicEvaluation[]> {
    const evaluations = await this.evaluations.listEvaluationsByOva(ovaId);
    return evaluations.map(toPublicEvaluation);
  }
}
