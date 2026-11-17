import type { Pool } from "pg";
import type { Progress, ProgressUpdate } from "../../domain/progress.js";
import type { ProgressRepository } from "../../ports/progressRepository.js";

const COLUMNS = "id, student_id, ova_id, status, percent_complete, last_accessed_at";

export class PostgresProgressRepository implements ProgressRepository {
  constructor(private readonly pool: Pool) {}

  async upsert(update: ProgressUpdate & { id: string }): Promise<Progress> {
    const result = await this.pool.query(
      `INSERT INTO progress (id, student_id, ova_id, status, percent_complete, last_accessed_at)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (student_id, ova_id) DO UPDATE
         SET status = EXCLUDED.status, percent_complete = EXCLUDED.percent_complete, last_accessed_at = now()
       RETURNING ${COLUMNS}`,
      [update.id, update.student_id, update.ova_id, update.status, update.percent_complete],
    );
    return map(result.rows[0]);
  }

  async listByStudent(studentId: string): Promise<Progress[]> {
    const result = await this.pool.query(
      `SELECT ${COLUMNS} FROM progress WHERE student_id = $1 ORDER BY last_accessed_at DESC`,
      [studentId],
    );
    return result.rows.map(map);
  }

  async listAll(): Promise<Progress[]> {
    const result = await this.pool.query(`SELECT ${COLUMNS} FROM progress ORDER BY ova_id, student_id`);
    return result.rows.map(map);
  }
}

function map(row: Record<string, unknown>): Progress {
  return {
    id: String(row.id),
    student_id: String(row.student_id),
    ova_id: String(row.ova_id),
    status: row.status as Progress["status"],
    percent_complete: Number(row.percent_complete),
    last_accessed_at: new Date(row.last_accessed_at as Date).toISOString(),
  };
}
