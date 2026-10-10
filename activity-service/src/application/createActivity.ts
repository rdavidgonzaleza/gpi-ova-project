import { randomUUID } from "node:crypto";
import type { ActivityType } from "../domain/activity.js";
import type { ActivityRepository } from "../ports/activityRepository.js";
import type { OvaCatalog } from "../ports/ovaCatalog.js";

export class OvaNotFoundError extends Error {}

export type CreateActivityInput = {
  ova_id: string;
  type: ActivityType;
  title: string;
  config: Record<string, unknown>;
};

export class CreateActivity {
  constructor(
    private readonly activities: ActivityRepository,
    private readonly ovas: OvaCatalog,
  ) {}

  async execute(input: CreateActivityInput) {
    if (!await this.ovas.exists(input.ova_id)) throw new OvaNotFoundError();
    return this.activities.create({
      id: randomUUID(),
      ...input,
    });
  }
}
