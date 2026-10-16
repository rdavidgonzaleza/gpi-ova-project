import type { ActivitiesApi } from '../activities'
import type { Activity, ActivityAttempt, ActivityType } from '../../types/domain'
import { fail, now, requireAuth, respond, table, uuid } from './store'

const TYPES: ActivityType[] = ['quiz', 'caso_estudio', 'simulacion', 'colaborativa']
const activities = () => table<Activity>('activities')
const attempts = () => table<ActivityAttempt>('activity_attempts')

export function localActivities(): ActivitiesApi {
  return {
    listByOva: (ovaId) => respond(() => activities().filter((activity) => activity.ova_id === ovaId)),

    get: (id) =>
      respond(() => {
        const activity = activities().get(id)
        if (!activity) fail(404, 'NOT_FOUND', 'Actividad no encontrada')
        return activity
      }),

    create: (request) =>
      respond(() => {
        requireAuth(['docente', 'administrador'])
        if (!TYPES.includes(request.type) || !request.title.trim()) {
          fail(400, 'INVALID_BODY', 'Tipo o título de actividad inválidos.')
        }
        if (!table('ovas').get(request.ova_id)) fail(404, 'NOT_FOUND', 'El OVA indicado no existe.')
        return activities().insert({ ...request, id: uuid(), description: null, created_at: now() })
      }),

    registerAttempt: (id, studentId, answers) =>
      respond(() => {
        const claims = requireAuth()
        if (claims.sub !== studentId) fail(403, 'FORBIDDEN', 'student_id no corresponde al token')
        if (!activities().get(id)) fail(404, 'NOT_FOUND', 'Actividad no encontrada')
        return attempts().insert({ id: uuid(), activity_id: id, student_id: studentId, answers, submitted_at: now() })
      }),
  }
}
