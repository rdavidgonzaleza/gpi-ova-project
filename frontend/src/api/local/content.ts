import type { ContentApi } from '../content'
import type { ContentBlock, OVA, OVAActivitySummary, OVAVersion } from '../../types/domain'
import { fail, now, requireAuth, respond, table, uuid } from './store'

type OVARow = Omit<OVA, 'blocks' | 'activities'>

const ovas = () => table<OVARow>('ovas')
const blocks = () => table<ContentBlock>('content_blocks')
const activities = () => table<OVAActivitySummary>('ova_activities')
const versions = () => table<OVAVersion>('ova_versions')

const EDITORS = ['docente', 'administrador'] as const

function withDetail(row: OVARow): OVA {
  return {
    ...row,
    blocks: blocks()
      .filter((block) => block.ova_id === row.id)
      .sort((a, b) => a.position - b.position),
    activities: activities().filter((activity) => activity.ova_id === row.id),
  }
}

function recordVersion(ovaId: string, notes: string | null) {
  const count = versions().filter((version) => version.ova_id === ovaId).length
  versions().insert({ id: uuid(), ova_id: ovaId, version_number: count + 1, change_notes: notes, created_at: now() })
}

export function localContent(): ContentApi {
  return {
    list: () => respond(() => ovas().all()),

    get: (id) =>
      respond(() => {
        const row = ovas().get(id)
        if (!row) fail(404, 'NOT_FOUND', 'OVA no encontrado')
        return withDetail(row)
      }),

    create: (request) =>
      respond(() => {
        const claims = requireAuth([...EDITORS])
        if (!request.title.trim() || !request.description.trim() || !request.learning_outcome.trim()) {
          fail(400, 'INVALID_BODY', 'Título, descripción y resultado de aprendizaje son obligatorios.')
        }
        const row: OVARow = {
          id: uuid(),
          title: request.title.trim(),
          description: request.description.trim(),
          learning_outcome: request.learning_outcome.trim(),
          status: 'borrador',
          created_by: claims.sub,
          created_at: now(),
        }
        ovas().insert(row)
        request.blocks.forEach((block) => blocks().insert({ ...block, id: uuid(), ova_id: row.id }))
        request.activities.forEach((activity) => activities().insert({ ...activity, id: uuid(), ova_id: row.id }))
        recordVersion(row.id, 'Versión inicial')
        return withDetail(row)
      }),

    update: (id, request) =>
      respond(() => {
        requireAuth([...EDITORS])
        const { blocks: newBlocks, activities: newActivities, change_notes, ...fields } = request
        const row = ovas().update(id, fields)
        if (!row) fail(404, 'NOT_FOUND', 'OVA no encontrado')
        if (newBlocks) {
          blocks().save([
            ...blocks().filter((block) => block.ova_id !== id),
            ...newBlocks.map((block) => ({ ...block, id: uuid(), ova_id: id })),
          ])
        }
        if (newActivities) {
          activities().save([
            ...activities().filter((activity) => activity.ova_id !== id),
            ...newActivities.map((activity) => ({ ...activity, id: uuid(), ova_id: id })),
          ])
        }
        recordVersion(id, change_notes ?? null)
        return withDetail(row)
      }),

    publish: (id) =>
      respond(() => {
        requireAuth([...EDITORS])
        const row = ovas().update(id, { status: 'publicado' })
        if (!row) fail(404, 'NOT_FOUND', 'OVA no encontrado')
        return withDetail(row)
      }),

    versions: (id) =>
      respond(() =>
        versions()
          .filter((version) => version.ova_id === id)
          .sort((a, b) => b.version_number - a.version_number),
      ),
  }
}
