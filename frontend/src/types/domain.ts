export type Role = 'estudiante' | 'docente' | 'administrador' | 'validador'

export interface User {
  id: string
  email: string
  full_name: string
  role: Role
  created_at: string
}

export type OVAStatus = 'borrador' | 'publicado'

export interface OVA {
  id: string
  title: string
  description: string
  learning_outcome: string
  status: OVAStatus
  created_by: string
  created_at: string
  blocks?: ContentBlock[]
  activities?: Activity[]
}

export type BlockType = 'texto' | 'imagen' | 'video'

export interface ContentBlock {
  id: string
  ova_id: string
  type: BlockType
  position: number
  content: string
}

export type ActivityType = 'quiz' | 'caso_estudio' | 'simulacion' | 'colaborativa'

export interface Activity {
  id: string
  ova_id: string
  type?: ActivityType
  title: string
  description: string
  is_ai: boolean
  config?: Record<string, unknown>
  created_at?: string
}

export interface AuthResponse {
  token: string
  user: User
}
