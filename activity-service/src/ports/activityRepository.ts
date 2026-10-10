import type { Activity, NewActivity } from "../domain/activity.js";

export interface ActivityRepository {
  create(activity: NewActivity): Promise<Activity>;
  listByOvaId(ovaId: string): Promise<Activity[]>;
}
