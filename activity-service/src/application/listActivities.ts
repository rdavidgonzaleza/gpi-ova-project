import type { ActivityRepository } from "../ports/activityRepository.js";

export class ListActivities {
  constructor(private readonly activities: ActivityRepository) {}

  execute(ovaId: string) {
    return this.activities.listByOvaId(ovaId);
  }
}
