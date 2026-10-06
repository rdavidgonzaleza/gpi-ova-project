import type { EvaluationConfig } from "./evaluation.js";

export type EvaluationAttempt = {
  id: string;
  evaluation_id: string;
  student_id: string;
  answers: Record<string, unknown>;
  score: number;
  feedback: string;
  submitted_at: string;
};

export function gradeAnswers(
  config: EvaluationConfig,
  answers: Record<string, unknown>,
): { score: number; feedback: string } {
  const questionFeedback: string[] = [];
  let correctCount = 0;

  for (const question of config.questions) {
    const correct = Object.hasOwn(answers, question.id)
      && answers[question.id] === question.correct_answer;

    if (correct) correctCount += 1;
    const message = correct
      ? question.feedback_correct
      : question.feedback_incorrect;
    if (message) questionFeedback.push(message);
  }

  const score = Math.round((correctCount / config.questions.length) * 10000) / 100;
  const summary = `Respuestas correctas: ${correctCount} de ${config.questions.length}.`;
  return {
    score,
    feedback: [summary, ...questionFeedback].join(" "),
  };
}
