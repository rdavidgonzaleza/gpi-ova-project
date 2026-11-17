import type { Progress } from "./progress.js";

export type UsageReportRow = {
  ova_id: string;
  students_started: number;
  students_completed: number;
  average_percent: number;
};

export type UsageReport = {
  group_id: string;
  generated_at: string;
  total_students: number;
  rows: UsageReportRow[];
};

/**
 * Agrega el progreso por OVA (spec 5.6): una fila por OVA con al menos un
 * registro; `average_percent` es el promedio entero de `percent_complete`.
 */
export function buildUsageReport(groupId: string, progress: Progress[], now: Date): UsageReport {
  const byOva = new Map<string, Progress[]>();
  for (const row of progress) byOva.set(row.ova_id, [...(byOva.get(row.ova_id) ?? []), row]);
  return {
    group_id: groupId,
    generated_at: now.toISOString(),
    total_students: new Set(progress.map((row) => row.student_id)).size,
    rows: [...byOva].map(([ovaId, rows]) => ({
      ova_id: ovaId,
      students_started: rows.filter((row) => row.status !== "no_iniciado").length,
      students_completed: rows.filter((row) => row.status === "completado").length,
      average_percent: Math.round(rows.reduce((sum, row) => sum + row.percent_complete, 0) / rows.length),
    })),
  };
}
