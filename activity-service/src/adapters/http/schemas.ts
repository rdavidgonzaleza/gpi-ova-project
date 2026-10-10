import { z } from "zod";

const requiredText = z.string().trim().min(1);

const optionSchema = z.object({
  id: requiredText,
  text: requiredText,
}).strict();

const quizConfigSchema = z.object({
  questions: z.array(z.object({
    id: requiredText,
    prompt: requiredText,
    options: z.array(optionSchema).min(2),
    correct_option_id: requiredText,
  }).strict()).min(1),
}).strict().superRefine((config, context) => {
  const questionIds = new Set<string>();
  config.questions.forEach((question, questionIndex) => {
    if (questionIds.has(question.id)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["questions", questionIndex, "id"], message: "ID de pregunta duplicado" });
    }
    questionIds.add(question.id);
    const optionIds = new Set(question.options.map((option) => option.id));
    if (optionIds.size !== question.options.length) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["questions", questionIndex, "options"], message: "IDs de opción duplicados" });
    }
    if (!optionIds.has(question.correct_option_id)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["questions", questionIndex, "correct_option_id"], message: "La opción correcta debe existir en options" });
    }
  });
});

const caseStudyConfigSchema = z.object({
  scenario: requiredText,
  tasks: z.array(z.object({ id: requiredText, prompt: requiredText }).strict()).min(1),
}).strict();

const simulationConfigSchema = z.object({
  scenario: requiredText,
  steps: z.array(z.object({ id: requiredText, prompt: requiredText }).strict()).min(1),
}).strict();

const collaborativeConfigSchema = z.object({
  instructions: requiredText,
  deliverables: z.array(requiredText).min(1),
}).strict();

const common = {
  ova_id: z.string().uuid(),
  title: requiredText.max(255),
};

export const createActivitySchema = z.discriminatedUnion("type", [
  z.object({ ...common, type: z.literal("quiz"), config: quizConfigSchema }).strict(),
  z.object({ ...common, type: z.literal("caso_estudio"), config: caseStudyConfigSchema }).strict(),
  z.object({ ...common, type: z.literal("simulacion"), config: simulationConfigSchema }).strict(),
  z.object({ ...common, type: z.literal("colaborativa"), config: collaborativeConfigSchema }).strict(),
]);

export const createActivityAttemptSchema = z.object({
  student_id: z.string().uuid(),
  answers: z.record(z.string(), z.unknown()),
}).strict();
