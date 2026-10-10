import type { Pool } from "pg";
import type { Activity, NewActivity } from "../../domain/activity.js";
import type { ActivityRepository } from "../../ports/activityRepository.js";

export class PostgresActivityRepository implements ActivityRepository {
  constructor(private readonly pool: Pool) {}

  async create(activity: NewActivity): Promise<Activity> {
    const result = await this.pool.query(
      `INSERT INTO activities (id, ova_id, type, title, description, config)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, ova_id, type, title, description, config, created_at`,
      [
        activity.id,
        activity.ova_id,
        activity.type,
        activity.title,
        activity.description ?? null,
        JSON.stringify(activity.config),
      ],
    );
    return mapActivity(result.rows[0]);
  }

  async listByOvaId(ovaId: string): Promise<Activity[]> {
    const result = await this.pool.query(
      `SELECT id, ova_id, type, title, description, config, created_at
       FROM activities WHERE ova_id = $1
       ORDER BY created_at, id`,
      [ovaId],
    );
    return result.rows.map(mapActivity);
  }
}

function mapActivity(row: Record<string, unknown>): Activity {
  return {
    id: String(row.id),
    ova_id: String(row.ova_id),
    type: row.type as Activity["type"],
    title: String(row.title),
    description: row.description === null ? null : String(row.description),
    config: row.config as Record<string, unknown>,
    created_at: new Date(row.created_at as Date | string).toISOString(),
  };
}
