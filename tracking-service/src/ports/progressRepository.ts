import type { Progress, ProgressUpdate } from "../domain/progress.js";

export interface ProgressRepository {
  upsert(update: ProgressUpdate & { id: string }): Promise<Progress>;
  listByStudent(studentId: string): Promise<Progress[]>;
  listAll(): Promise<Progress[]>;
}
