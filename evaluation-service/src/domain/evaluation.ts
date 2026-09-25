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
  config: EvaluationConfig;
};
