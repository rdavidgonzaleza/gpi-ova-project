import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'gpi.state.'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

/**
 * useState that survives navigation and reloads, scoped by key. Used for work
 * in progress inside activities (drafts, answers, last AI feedback).
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial))

  // Re-read when the key changes (e.g. moving to another activity).
  useEffect(() => setValue(read(key, initial)), [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(resolved))
        } catch {
          // Storage unavailable: keep the in-memory value.
        }
        return resolved
      })
    },
    [key],
  )

  return [value, update] as const
}
