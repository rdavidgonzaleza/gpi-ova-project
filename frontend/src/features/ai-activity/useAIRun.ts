import { useCallback, useRef, useState } from 'react'
import { aiApi } from '../../api/ai'
import { ApiError } from '../../api/client'
import { usePersistentState } from '../../lib/usePersistentState'
import type { UUID } from '../../types/domain'
import { useAuth } from '../auth/useAuth'

export interface AIResult<T> {
  interactionId: UUID
  raw: string
  data: T | null
  at: string
}

/** Extracts JSON from a model answer, tolerating code fences or stray text. */
export function parseAIJson<T>(raw: string): T | null {
  const text = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
  for (const candidate of [text, text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)]) {
    try {
      return JSON.parse(candidate) as T
    } catch {
      // try the next candidate
    }
  }
  return null
}

export function aiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'No fue posible obtener la retroalimentación. Inténtalo de nuevo.'
  switch (error.code) {
    case 'AI_RATE_LIMITED':
      return 'La IA recibió muchas solicitudes seguidas. Espera unos segundos e inténtalo de nuevo.'
    case 'AI_NOT_CONFIGURED':
    case 'SERVICE_UNAVAILABLE':
    case 'NETWORK_ERROR':
      return 'La retroalimentación con IA no está disponible en este momento. Puedes continuar con el OVA y volver más tarde.'
    case 'UNAUTHORIZED':
      return 'Tu sesión expiró. Inicia sesión de nuevo para usar la IA.'
    default:
      return error.message
  }
}

/**
 * Runs an ai-service activity (POST /api/ai-activities/{id}/run) for the
 * current learner. The last result is kept per `storageKey`.
 */
export function useAIRun<T = unknown>(aiActivityId: UUID | undefined, storageKey: string, options?: { json?: boolean }) {
  const { user } = useAuth()
  const [result, setResult] = usePersistentState<AIResult<T> | null>(`ai.${storageKey}`, null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const controller = useRef<AbortController | null>(null)

  const run = useCallback(
    async (input: unknown) => {
      if (!aiActivityId || !user) return null
      controller.current?.abort()
      controller.current = new AbortController()
      setPending(true)
      setError(null)
      try {
        const text = typeof input === 'string' ? input : JSON.stringify(input, null, 2)
        const response = await aiApi.run(aiActivityId, user.id, text, controller.current.signal)
        const next: AIResult<T> = {
          interactionId: response.interaction_id,
          raw: response.ai_output,
          data: options?.json ? parseAIJson<T>(response.ai_output) : null,
          at: new Date().toISOString(),
        }
        setResult(next)
        return next
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return null
        setError(aiErrorMessage(cause))
        return null
      } finally {
        setPending(false)
      }
    },
    [aiActivityId, user, options?.json, setResult],
  )

  const clear = useCallback(() => {
    controller.current?.abort()
    setResult(null)
    setError(null)
  }, [setResult])

  return { run, result, pending, error, clear, canRun: Boolean(user && aiActivityId) }
}
