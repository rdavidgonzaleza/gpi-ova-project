import { getToken } from './session'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

/** Error with the standard shape of spec 3.3: `{ error: { code, message } }`. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  method?: Method
  body?: unknown
  query?: Record<string, string | undefined>
  signal?: AbortSignal
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal } = options
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value)
  }

  const headers = new Headers({ Accept: 'application/json' })
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError(0, 'NETWORK_ERROR', 'No hay conexión con el servidor. Revisa tu red e inténtalo de nuevo.')
  }

  if (!response.ok) throw await toApiError(response)
  if (response.status === 204) return undefined as T

  const type = response.headers.get('Content-Type') ?? ''
  return (type.includes('application/json') ? response.json() : response.text()) as Promise<T>
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json()
    if (data?.error?.code) return new ApiError(response.status, data.error.code, data.error.message)
  } catch {
    // Body is not JSON; fall through to a generic message.
  }
  if (response.status >= 500 || response.status === 404) {
    return new ApiError(response.status, 'SERVICE_UNAVAILABLE', 'El servicio no está disponible en este momento.')
  }
  return new ApiError(response.status, 'HTTP_ERROR', `La solicitud falló (${response.status}).`)
}
