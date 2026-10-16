// Each microservice can be consumed from its real HTTP endpoint ("remote") or
// from an in-browser adapter that honours the same contract ("local"). The
// choice is per service so each one can switch to "remote" as soon as it is
// deployed, without touching any component.

export type Service = 'identity' | 'content' | 'activity' | 'evaluation' | 'tracking'
export type Source = 'remote' | 'local'

const env: Record<Service, string | undefined> = {
  identity: import.meta.env.VITE_SOURCE_IDENTITY,
  content: import.meta.env.VITE_SOURCE_CONTENT,
  activity: import.meta.env.VITE_SOURCE_ACTIVITY,
  evaluation: import.meta.env.VITE_SOURCE_EVALUATION,
  tracking: import.meta.env.VITE_SOURCE_TRACKING,
}

export function sourceOf(service: Service): Source {
  return env[service] === 'remote' ? 'remote' : 'local'
}

/** Picks the adapter for a service once, at module load. */
export function pick<T>(service: Service, adapters: { remote: T; local: () => T }): T {
  return sourceOf(service) === 'remote' ? adapters.remote : adapters.local()
}
