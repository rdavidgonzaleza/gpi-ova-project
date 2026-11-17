import { http } from './client'
import { localTracking } from './local/tracking'
import { pick } from './source'
import type { Progress, UpsertProgressRequest, UsageReport, UUID } from '../types/domain'

// tracking-service — spec 5.6
export interface TrackingApi {
  progress(studentId: UUID): Promise<Progress[]>
  upsert(request: UpsertProgressRequest): Promise<Progress>
  usageReport(groupId: string): Promise<UsageReport>
}

const remote: TrackingApi = {
  progress: (studentId) => http('/api/progress', { query: { student_id: studentId } }),
  upsert: (request) => http('/api/progress', { method: 'PUT', body: request }),
  usageReport: (groupId) => http('/api/reports/usage', { query: { group_id: groupId } }),
}

export const trackingApi = pick('tracking', { remote, local: localTracking })
