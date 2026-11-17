import { randomUUID } from "node:crypto";
import { canWriteStudent, type Progress, type ProgressUpdate, type Requester } from "../domain/progress.js";
import type { ProgressRepository } from "../ports/progressRepository.js";
import { ForbiddenError } from "./errors.js";

/** US-7.1: guarda o actualiza el avance de un estudiante en un OVA. */
export class UpsertProgress {
  constructor(private readonly progress: ProgressRepository) {}

  execute(requester: Requester, update: ProgressUpdate): Promise<Progress> {
    if (!canWriteStudent(requester, update.student_id)) throw new ForbiddenError("solo puedes registrar tu propio progreso");
    return this.progress.upsert({ id: randomUUID(), ...update });
  }
}
