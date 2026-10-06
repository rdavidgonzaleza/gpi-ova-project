import type { Pool } from "pg";
import type { Evaluation, EvaluationConfig } from "../../domain/evaluation.js";
import type { EvaluationAttempt } from "../../domain/evaluationAttempt.js";
import type { EvaluationRepository } from "../../ports/evaluationRepository.js";
import { evaluationConfigSchema } from "../http/schemas.js";

export class PostgresEvaluationRepository implements EvaluationRepository {
  constructor(private readonly pool: Pool) {}

  async findEvaluation(id: string): Promise<Evaluation | null> {
    const result = await this.pool.query(
      "SELECT id, ova_id, type, config FROM evaluations WHERE id = $1",
      [id],
    );
    if (result.rowCount === 0) return null;
    const row = result.rows[0];
    const config = evaluationConfigSchema.parse(row.config);
    return { id: row.id, ova_id: row.ova_id, type: row.type, config } satisfies Evaluation & { config: EvaluationConfig };
  }

  async listEvaluationsByOva(ovaId: string): Promise<Evaluation[]> {
    const result = await this.pool.query(
      "SELECT id, ova_id, type, config FROM evaluations WHERE ova_id = $1",
      [ovaId],
    );
    return result.rows.map(row => {
      const config = evaluationConfigSchema.parse(row.config);
      return { id: row.id, ova_id: row.ova_id, type: row.type, config };
    });
  }

  async saveAttempt(attempt: EvaluationAttempt): Promise<void> {
    await this.pool.query(
      `INSERT INTO evaluation_attempts
        (id, evaluation_id, student_id, answers, score, feedback, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        attempt.id,
        attempt.evaluation_id,
        attempt.student_id,
        JSON.stringify(attempt.answers),
        attempt.score,
        attempt.feedback,
        attempt.submitted_at,
      ],
    );
  }

  async listAttempts(studentId: string): Promise<EvaluationAttempt[]> {
    const result = await this.pool.query(
      `SELECT id, evaluation_id, student_id, answers, score, feedback, submitted_at
       FROM evaluation_attempts
       WHERE student_id = $1
       ORDER BY submitted_at DESC`,
      [studentId],
    );
    return result.rows.map((row) => ({
      ...row,
      score: Number(row.score),
      submitted_at: new Date(row.submitted_at).toISOString(),
    }));
  }
}
