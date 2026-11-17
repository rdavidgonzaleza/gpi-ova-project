import type { Activity } from "../domain/activity.js";
import type { ActivityRepository } from "../ports/activityRepository.js";

export class ActivityNotFoundError extends Error {}

export class GetActivity {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(id: string): Promise<Activity> {
    const activity = await this.activities.findById(id);
    if (!activity) throw new ActivityNotFoundError();
    return activity;
  }
}
