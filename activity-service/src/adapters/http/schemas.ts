import { z } from "zod";

// Schemas de `config` por tipo: spec 5.3.1. Los objetos aceptan campos extra
// (passthrough) para que el contrato pueda crecer sin romper el servicio,
// pero los campos documentados se validan.

const text = z.string().trim().min(1);
const uuid = z.string().uuid();

const base = {
  position: z.number().int().min(0),
  instructions: z.string().optional(),
};

const option = z.object({ id: text, text: text }).passthrough();

const quizConfig = z.object({
  ...base,
  questions: z.array(z.object({
    id: text,
    prompt: text,
    options: z.array(option).min(2),
    answer: text.optional(),
    explanation: z.string().optional(),
  }).passthrough()).min(1),
  hints_ai_activity_id: uuid.optional(),
  evaluation_id: uuid.optional(),
  explain_ai_activity_id: uuid.optional(),
}).passthrough().superRefine((config, ctx) => {
  const seen = new Set<string>();
  config.questions.forEach((question, i) => {
    if (seen.has(question.id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["questions", i, "id"], message: "ID de pregunta duplicado" });
    }
    seen.add(question.id);
    const optionIds = new Set(question.options.map((o) => o.id));
    if (optionIds.size !== question.options.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["questions", i, "options"], message: "IDs de opción duplicados" });
    }
    if (question.answer !== undefined && !optionIds.has(question.answer)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["questions", i, "answer"], message: "La respuesta debe ser una de las opciones" });
    }
    // Una evaluación de evaluation-service nunca expone la clave aquí (5.3.1).
    if (config.evaluation_id && question.answer !== undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["questions", i, "answer"], message: "Un quiz de evaluación no incluye respuestas" });
    }
  });
});

const caseStudyConfig = z.object({
  ...base,
  scenario: text,
  questions: z.array(z.object({ id: text, prompt: text, placeholder: z.string().optional() }).passthrough()).min(1),
  rubric: z.array(z.object({ id: text, name: text, description: text }).passthrough()).min(1),
  review_ai_activity_id: uuid,
  variant_ai_activity_id: uuid.optional(),
}).passthrough();

const simulationConfig = z.object({
  ...base,
  kind: z.enum(["triple_restriccion", "edt", "cpm", "evm", "riesgos"]),
  params: z.record(z.string(), z.unknown()),
  review_ai_activity_id: uuid.optional(),
}).passthrough();

const collaborativeConfig = z.object({
  ...base,
  prompt: text,
  role: text,
  contributions: z.array(z.object({ author: text, role: text, text: text }).passthrough()),
  synthesis_ai_activity_id: uuid.optional(),
}).passthrough();

const common = {
  ova_id: uuid,
  title: text.max(255),
  description: z.string().trim().max(2000).nullable().optional(),
};

export const createActivitySchema = z.discriminatedUnion("type", [
  z.object({ ...common, type: z.literal("quiz"), config: quizConfig }).strict(),
  z.object({ ...common, type: z.literal("caso_estudio"), config: caseStudyConfig }).strict(),
  z.object({ ...common, type: z.literal("simulacion"), config: simulationConfig }).strict(),
  z.object({ ...common, type: z.literal("colaborativa"), config: collaborativeConfig }).strict(),
]);

export const createActivityAttemptSchema = z.object({
  student_id: uuid,
  answers: z.record(z.string(), z.unknown()),
}).strict();
