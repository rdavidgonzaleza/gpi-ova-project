import { canReadStudent, type Progress, type Requester } from "../domain/progress.js";
import type { ProgressRepository } from "../ports/progressRepository.js";
import { ForbiddenError } from "./errors.js";

/** US-7.1: progreso de un estudiante en todos sus OVA. */
export class ListProgress {
  constructor(private readonly progress: ProgressRepository) {}

  execute(requester: Requester, studentId: string): Promise<Progress[]> {
    if (!canReadStudent(requester, studentId)) throw new ForbiddenError("solo puedes consultar tu propio progreso");
    return this.progress.listByStudent(studentId);
  }
}
