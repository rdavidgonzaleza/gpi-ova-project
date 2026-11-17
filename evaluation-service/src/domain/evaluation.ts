export type EvaluationQuestion = {
  id: string;
  correct_answer: string | number | boolean | null;
  feedback_correct?: string;
  feedback_incorrect?: string;
};

export type EvaluationConfig = {
  questions: EvaluationQuestion[];
};

export type Evaluation = {
  id: string;
  ova_id: string;
  type: "autoevaluacion" | "transferencia";
  config: EvaluationConfig;
};

/** Vista pública de una evaluación: cada pregunta solo con su `id`. */
export type PublicEvaluation = Omit<Evaluation, "config"> & {
  config: { questions: Array<Pick<EvaluationQuestion, "id">> };
};

/**
 * Quita la clave de respuestas y la retroalimentación (spec 5.5): solo el
 * servidor las lee al calificar un intento.
 */
export function toPublicEvaluation(evaluation: Evaluation): PublicEvaluation {
  return {
    id: evaluation.id,
    ova_id: evaluation.ova_id,
    type: evaluation.type,
    config: { questions: evaluation.config.questions.map((question) => ({ id: question.id })) },
  };
}
