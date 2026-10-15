import type { TrackingApi } from '../tracking'
import type { Progress, ProgressStatus } from '../../types/domain'
import { fail, now, requireAuth, respond, table, uuid } from './store'

const STATUSES: ProgressStatus[] = ['no_iniciado', 'en_progreso', 'completado']
const progress = () => table<Progress>('progress')

export function localTracking(): TrackingApi {
  return {
    progress: (studentId) =>
      respond(() => {
        const claims = requireAuth()
        if (claims.role === 'estudiante' && claims.sub !== studentId) {
          fail(403, 'FORBIDDEN', 'solo puedes consultar tu propio progreso')
        }
        return progress().filter((row) => row.student_id === studentId)
      }),

    upsert: (request) =>
      respond(() => {
        requireAuth()
        const percent = Math.round(request.percent_complete)
        if (!STATUSES.includes(request.status) || percent < 0 || percent > 100) {
          fail(400, 'INVALID_BODY', 'status o percent_complete inválidos')
        }
        const existing = progress().find(
          (row) => row.student_id === request.student_id && row.ova_id === request.ova_id,
        )
        const fields = { status: request.status, percent_complete: percent, last_accessed_at: now() }
        if (existing) return progress().update(existing.id, fields)!
        return progress().insert({ id: uuid(), student_id: request.student_id, ova_id: request.ova_id, ...fields })
      }, 60),

    usageReport: (groupId) =>
      respond(() => {
        requireAuth(['docente', 'administrador'])
        const rows = progress().all()
        const byOva = new Map<string, Progress[]>()
        rows.forEach((row) => byOva.set(row.ova_id, [...(byOva.get(row.ova_id) ?? []), row]))
        return {
          group_id: groupId,
          generated_at: now(),
          total_students: new Set(rows.map((row) => row.student_id)).size,
          rows: [...byOva].map(([ovaId, items]) => ({
            ova_id: ovaId,
            students_started: items.filter((row) => row.status !== 'no_iniciado').length,
            students_completed: items.filter((row) => row.status === 'completado').length,
            average_percent: Math.round(items.reduce((sum, row) => sum + row.percent_complete, 0) / items.length),
          })),
        }
      }),
  }
}
