// Schemas of `activities.config` per activity type (spec 5.3 left these as a
// design task; documented in PROJECT_SPEC section 5.3.1). Every config has a
// `position` that places the activity among the OVA content blocks.

import type { UUID } from './domain'

interface BaseConfig {
  /** Order among content blocks (same scale as content_blocks.position). */
  position: number
  /** Short instruction shown above the activity. */
  instructions?: string
}

export interface ChoiceOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: ChoiceOption[]
  /** Correct option id (quiz) — omitted when an evaluation grades it. */
  answer?: string
  explanation?: string
}

export interface QuizConfig extends BaseConfig {
  questions: QuizQuestion[]
  /** ai-service activity that gives graded hints (level 1–3). */
  hints_ai_activity_id?: UUID
  /**
   * When set, this quiz is the presentation of an evaluation-service
   * evaluation: answers are graded server side and never shipped here.
   */
  evaluation_id?: UUID
  /** ai-service activity that explains the mistakes after grading. */
  explain_ai_activity_id?: UUID
}

export interface CaseQuestion {
  id: string
  prompt: string
  placeholder?: string
}

export interface RubricCriterion {
  id: string
  name: string
  description: string
}

export interface CaseStudyConfig extends BaseConfig {
  /** Markdown with the case narrative. */
  scenario: string
  questions: CaseQuestion[]
  rubric: RubricCriterion[]
  /** ai-service activity that reviews the answers against the rubric. */
  review_ai_activity_id: UUID
  /** ai-service activity that writes a new variant of the scenario. */
  variant_ai_activity_id?: UUID
}

export type SimulationKind = 'triple_restriccion' | 'edt' | 'cpm' | 'evm' | 'riesgos'

export interface SimulationConfig extends BaseConfig {
  kind: SimulationKind
  /** Kind-specific parameters (see features/simulations). */
  params: Record<string, unknown>
  /** ai-service activity that reviews the learner's result or deliverable. */
  review_ai_activity_id?: UUID
}

export interface TeamContribution {
  author: string
  role: string
  text: string
}

export interface CollaborativeConfig extends BaseConfig {
  /** Situation the team discusses. */
  prompt: string
  /** Role the learner plays in the team. */
  role: string
  /** Contributions already posted by teammates. */
  contributions: TeamContribution[]
  /** ai-service activity that synthesises the team's position. */
  synthesis_ai_activity_id?: UUID
}

export type ActivityConfigByType = {
  quiz: QuizConfig
  caso_estudio: CaseStudyConfig
  simulacion: SimulationConfig
  colaborativa: CollaborativeConfig
}
