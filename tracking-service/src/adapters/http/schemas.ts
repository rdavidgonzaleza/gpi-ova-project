import { z } from "zod";
import { PROGRESS_STATUSES } from "../../domain/progress.js";

export const upsertProgressSchema = z.object({
  student_id: z.string().uuid(),
  ova_id: z.string().uuid(),
  status: z.enum(PROGRESS_STATUSES as [string, ...string[]]),
  percent_complete: z.number().min(0).max(100).transform(Math.round),
}).strict();

export const studentQuerySchema = z.string().uuid();
export const groupQuerySchema = z.string().trim().min(1).max(100);
