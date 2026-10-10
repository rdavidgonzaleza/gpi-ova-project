import { randomUUID } from "node:crypto";
import type { ActivityAttempt } from "../domain/activityAttempt.js";
import type { ActivityRepository } from "../ports/activityRepository.js";

export class ActivityNotFoundError extends Error {}

export type RegisterActivityAttemptInput = {
  activity_id: string;
  student_id: string;
  answers: Record<string, unknown>;
};

export class RegisterActivityAttempt {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(input: RegisterActivityAttemptInput): Promise<ActivityAttempt> {
    const attempt = await this.activities.createAttempt({ id: randomUUID(), ...input });
    if (!attempt) throw new ActivityNotFoundError();
    return attempt;
  }
}
