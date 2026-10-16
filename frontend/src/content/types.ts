import type { ActivityConfigByType } from '../types/activities'
import type { ActivityType, BlockType, Evaluation, UUID } from '../types/domain'

export interface UnitBlock {
  id: UUID
  type: BlockType
  position: number
  content: string
}

export type UnitActivity = {
  [T in ActivityType]: { id: UUID; type: T; title: string; description: string; config: ActivityConfigByType[T] }
}[ActivityType]

/** One OVA with everything each service stores about it. */
export interface CourseUnit {
  ovaId: UUID
  blocks: UnitBlock[]
  activities: UnitActivity[]
  evaluation: Evaluation
}
