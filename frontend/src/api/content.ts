import { localContent } from './local/content'
import { pick } from './source'
import { ApiError, http } from './client'
import type { CreateOVARequest, MediaUpload, OVA, OVAVersion, UUID } from '../types/domain'

// content-service — spec 5.2
export type UpdateOVARequest = Partial<CreateOVARequest> & { change_notes?: string }

export interface ContentApi {
  list(): Promise<OVA[]>
  get(id: UUID): Promise<OVA>
  create(request: CreateOVARequest): Promise<OVA>
  update(id: UUID, request: UpdateOVARequest): Promise<OVA>
  publish(id: UUID): Promise<OVA>
  versions(id: UUID): Promise<OVAVersion[]>
  /** Presigned URL to upload an image or video straight to the bucket. */
  requestUpload(id: UUID, file: { file_name: string; content_type: string }): Promise<MediaUpload>
}

const remote: ContentApi = {
  list: () => http('/api/ovas'),
  get: (id) => http(`/api/ovas/${id}`),
  create: (request) => http('/api/ovas', { method: 'POST', body: request }),
  update: (id, request) => http(`/api/ovas/${id}`, { method: 'PATCH', body: request }),
  publish: (id) => http(`/api/ovas/${id}/publish`, { method: 'POST' }),
  versions: (id) => http(`/api/ovas/${id}/versions`),
  requestUpload: (id, file) => http(`/api/ovas/${id}/media`, { method: 'POST', body: file }),
}

export const contentApi = pick('content', { remote, local: localContent })

/**
 * Uploads a file for an OVA: asks content-service for a presigned URL and
 * PUTs the file directly to the S3-compatible bucket (Backblaze B2). Returns
 * the public URL to store in the block as `url|descripción`.
 */
export async function uploadOVAMedia(ovaId: UUID, file: File, onProgress?: (fraction: number) => void): Promise<string> {
  const upload = await contentApi.requestUpload(ovaId, { file_name: file.name, content_type: file.type })
  await putWithProgress(upload.upload_url, file, upload.content_type, onProgress)
  return upload.public_url
}

function putWithProgress(url: string, file: File, contentType: string, onProgress?: (fraction: number) => void) {
  // XMLHttpRequest instead of fetch: fetch cannot report upload progress.
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('PUT', url)
    request.setRequestHeader('Content-Type', contentType)
    request.upload.onprogress = (event) => event.lengthComputable && onProgress?.(event.loaded / event.total)
    request.onload = () =>
      request.status >= 200 && request.status < 300
        ? resolve()
        : reject(new ApiError(request.status, 'UPLOAD_FAILED', 'El almacenamiento rechazó el archivo. Inténtalo de nuevo.'))
    request.onerror = () =>
      reject(new ApiError(0, 'UPLOAD_FAILED', 'No fue posible subir el archivo. Revisa tu conexión y la configuración CORS del bucket.'))
    request.send(file)
  })
}
