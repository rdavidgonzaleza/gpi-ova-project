// Types mirroring the entities of PROJECT_SPEC section 7. JSON keys stay in
// snake_case, exactly as the microservices expose them (spec 3.2).

export type UUID = string
export type ISODate = string

// 7.1 identity-service
export type Role = 'estudiante' | 'docente' | 'administrador' | 'validador'

export interface User {
  id: UUID
  email: string
  full_name: string
  role: Role
}

export interface RegisterRequest {
  email: string
  full_name: string
  password: string
  role: Role
}

export interface LoginResponse {
  token: string
  user: User
}

// 7.2 content-service
export type OVAStatus = 'borrador' | 'publicado'
export type BlockType = 'texto' | 'imagen' | 'video'

export interface ContentBlock {
  id: UUID
  ova_id: UUID
  type: BlockType
  position: number
  content: string
}

export interface OVAActivitySummary {
  id: UUID
  ova_id: UUID
  title: string
  description: string
  is_ai: boolean
}

export interface OVA {
  id: UUID
  title: string
  description: string
  learning_outcome: string
  status: OVAStatus
  created_by: UUID | null
  created_at: ISODate
  blocks?: ContentBlock[]
  activities?: OVAActivitySummary[]
}

export interface CreateOVARequest {
  title: string
  description: string
  learning_outcome: string
  blocks: Array<Pick<ContentBlock, 'type' | 'position' | 'content'>>
  activities: Array<Pick<OVAActivitySummary, 'title' | 'description' | 'is_ai'>>
}

export interface OVAVersion {
  id: UUID
  ova_id: UUID
  version_number: number
  change_notes: string | null
  created_at: ISODate
}

// 7.3 activity-service
export type ActivityType = 'quiz' | 'caso_estudio' | 'simulacion' | 'colaborativa'

export interface Activity<C = Record<string, unknown>> {
  id: UUID
  ova_id: UUID
  type: ActivityType
  title: string
  description: string | null
  config: C
  created_at: ISODate
}

export interface CreateActivityRequest {
  ova_id: UUID
  type: ActivityType
  title: string
  config: Record<string, unknown>
}

export interface ActivityAttempt {
  id: UUID
  activity_id: UUID
  student_id: UUID
  answers: Record<string, unknown>
  submitted_at: ISODate
}

// 7.4 ai-service
export interface AIActivity {
  id: UUID
  activity_id: UUID
  prompt_template: string
  provider: string
  created_at: ISODate
}

export interface AIRunResponse {
  interaction_id: UUID
  ai_output: string
}

export interface AIInteraction {
  id: UUID
  ai_activity_id: UUID
  student_id: UUID
  input: string
  ai_output: string
  validated: boolean
  validation_notes: string | null
  created_at: ISODate
}

// 7.5 evaluation-service
export type EvaluationType = 'autoevaluacion' | 'transferencia'
export type AnswerValue = string | number | boolean | null

export interface EvaluationQuestion {
  id: string
  correct_answer: AnswerValue
  feedback_correct?: string
  feedback_incorrect?: string
}

export interface Evaluation {
  id: UUID
  ova_id: UUID
  type: EvaluationType
  config: { questions: EvaluationQuestion[] }
}

export interface EvaluationResult {
  score: number
  feedback: string
}

export interface EvaluationAttempt {
  id: UUID
  evaluation_id: UUID
  student_id: UUID
  answers: Record<string, AnswerValue>
  score: number
  feedback: string | null
  submitted_at: ISODate
}

// 7.6 tracking-service
export type ProgressStatus = 'no_iniciado' | 'en_progreso' | 'completado'

export interface Progress {
  id: UUID
  student_id: UUID
  ova_id: UUID
  status: ProgressStatus
  percent_complete: number
  last_accessed_at: ISODate
}

export interface UpsertProgressRequest {
  student_id: UUID
  ova_id: UUID
  status: ProgressStatus
  percent_complete: number
}

export interface UsageReportRow {
  ova_id: UUID
  students_started: number
  students_completed: number
  average_percent: number
}

export interface UsageReport {
  group_id: string
  generated_at: ISODate
  total_students: number
  rows: UsageReportRow[]
}
