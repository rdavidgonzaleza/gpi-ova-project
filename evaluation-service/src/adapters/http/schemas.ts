import { z } from "zod";

const answerValue = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const registerAttemptSchema = z.object({
  student_id: z.string().uuid(),
  answers: z.record(answerValue),
}).strict();

export const evaluationConfigSchema = z.object({
  questions: z.array(z.object({
    id: z.string().min(1),
    correct_answer: answerValue,
    feedback_correct: z.string().optional(),
    feedback_incorrect: z.string().optional(),
  }).strict()).min(1),
}).strict().refine(
  (config) => new Set(config.questions.map((question) => question.id)).size === config.questions.length,
  { message: "los IDs de pregunta deben ser únicos" },
);
