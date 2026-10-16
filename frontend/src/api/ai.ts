import { http } from './client'
import type { AIActivity, AIInteraction, AIRunResponse, UUID } from '../types/domain'

// ai-service — spec 5.4. Always remote: the responses come from a real
// generative model behind the service, never from the browser.
export const aiApi = {
  createActivity: (request: { activity_id: UUID; prompt_template: string; provider: string }) =>
    http<AIActivity>('/api/ai-activities', { method: 'POST', body: request }),

  run: (aiActivityId: UUID, studentId: UUID, input: string, signal?: AbortSignal) =>
    http<AIRunResponse>(`/api/ai-activities/${aiActivityId}/run`, {
      method: 'POST',
      body: { student_id: studentId, input },
      signal,
    }),

  /** Validator panel (RF-10): pending interactions with validated=false. */
  listInteractions: (validated?: boolean) =>
    http<AIInteraction[]>('/api/ai-interactions', {
      query: { validated: validated === undefined ? undefined : String(validated) },
    }),

  validate: (interactionId: UUID, validated: boolean, notes: string) =>
    http<AIInteraction>(`/api/ai-interactions/${interactionId}/validate`, {
      method: 'POST',
      body: { validated, notes },
    }),
}
