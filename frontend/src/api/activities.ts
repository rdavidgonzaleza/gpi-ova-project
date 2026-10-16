import { http } from './client'
import { localActivities } from './local/activities'
import { pick } from './source'
import type { Activity, ActivityAttempt, CreateActivityRequest, UUID } from '../types/domain'

// activity-service — spec 5.3
export interface ActivitiesApi {
  listByOva(ovaId: UUID): Promise<Activity[]>
  get(id: UUID): Promise<Activity>
  create(request: CreateActivityRequest): Promise<Activity>
  registerAttempt(id: UUID, studentId: UUID, answers: Record<string, unknown>): Promise<ActivityAttempt>
}

const remote: ActivitiesApi = {
  listByOva: (ovaId) => http('/api/activities', { query: { ova_id: ovaId } }),
  get: (id) => http(`/api/activities/${id}`),
  create: (request) => http('/api/activities', { method: 'POST', body: request }),
  registerAttempt: (id, studentId, answers) =>
    http(`/api/activities/${id}/attempts`, { method: 'POST', body: { student_id: studentId, answers } }),
}

export const activitiesApi = pick('activity', { remote, local: localActivities })
