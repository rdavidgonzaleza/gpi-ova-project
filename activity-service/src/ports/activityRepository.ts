import type { Activity, NewActivity } from "../domain/activity.js";
import type { ActivityAttempt, NewActivityAttempt } from "../domain/activityAttempt.js";

export interface ActivityRepository {
  create(activity: NewActivity): Promise<Activity>;
  listByOvaId(ovaId: string): Promise<Activity[]>;
  findById(id: string): Promise<Activity | null>;
  createAttempt(attempt: NewActivityAttempt): Promise<ActivityAttempt | null>;
}
