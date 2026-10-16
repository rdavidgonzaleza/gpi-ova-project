import { http } from './client'
import { localContent } from './local/content'
import { pick } from './source'
import type { CreateOVARequest, OVA, OVAVersion, UUID } from '../types/domain'

// content-service — spec 5.2
export type UpdateOVARequest = Partial<CreateOVARequest> & { change_notes?: string }

export interface ContentApi {
  list(): Promise<OVA[]>
  get(id: UUID): Promise<OVA>
  create(request: CreateOVARequest): Promise<OVA>
  update(id: UUID, request: UpdateOVARequest): Promise<OVA>
  publish(id: UUID): Promise<OVA>
  versions(id: UUID): Promise<OVAVersion[]>
}

const remote: ContentApi = {
  list: () => http('/api/ovas'),
  get: (id) => http(`/api/ovas/${id}`),
  create: (request) => http('/api/ovas', { method: 'POST', body: request }),
  update: (id, request) => http(`/api/ovas/${id}`, { method: 'PATCH', body: request }),
  publish: (id) => http(`/api/ovas/${id}/publish`, { method: 'POST' }),
  versions: (id) => http(`/api/ovas/${id}/versions`),
}

export const contentApi = pick('content', { remote, local: localContent })
