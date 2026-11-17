export type ProgressStatus = "no_iniciado" | "en_progreso" | "completado";

export const PROGRESS_STATUSES: readonly ProgressStatus[] = ["no_iniciado", "en_progreso", "completado"];

export type Progress = {
  id: string;
  student_id: string;
  ova_id: string;
  status: ProgressStatus;
  percent_complete: number;
  last_accessed_at: string;
};

export type ProgressUpdate = Pick<Progress, "student_id" | "ova_id" | "status" | "percent_complete">;

export type Role = "estudiante" | "docente" | "administrador" | "validador";

export type Requester = { sub: string; role: Role };

/** Docentes y administradores consultan a cualquier estudiante (spec 5.6). */
export function canReadStudent(requester: Requester, studentId: string): boolean {
  return requester.role === "docente" || requester.role === "administrador" || requester.sub === studentId;
}

/** Un estudiante solo registra su propio avance; docentes y administradores pueden corregirlo. */
export const canWriteStudent = canReadStudent;

export function canReadReports(requester: Requester): boolean {
  return requester.role === "docente" || requester.role === "administrador";
}
