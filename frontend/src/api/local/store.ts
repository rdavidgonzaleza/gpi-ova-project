import { ApiError } from '../client'
import { decodeClaims, getToken, type Claims } from '../session'
import type { Role } from '../../types/domain'
import { SEED_VERSION, seedTables } from './seed'

// Browser-persisted tables used by the local adapters. Every table is a JSON
// array under its own localStorage key, mirroring one table of spec section 7.

const PREFIX = 'gpi.'
const memory = new Map<string, string>()

function read(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key)
  } catch {
    return memory.get(key) ?? null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(PREFIX + key, value)
  } catch {
    memory.set(key, value)
  }
}

let seeded = false
function ensureSeeded() {
  if (seeded) return
  seeded = true
  if (read('seed_version') === String(SEED_VERSION)) return
  for (const [name, rows] of Object.entries(seedTables())) {
    // Keep rows the person created; replace only the seeded ones.
    const existing = parse<{ id: string }>(read(name)).filter((row) => !rows.some((s) => s.id === row.id))
    write(name, JSON.stringify([...rows, ...existing]))
  }
  write('seed_version', String(SEED_VERSION))
}

function parse<T>(raw: string | null): T[] {
  if (!raw) return []
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

export interface Table<T extends { id: string }> {
  all(): T[]
  find(predicate: (row: T) => boolean): T | undefined
  filter(predicate: (row: T) => boolean): T[]
  get(id: string): T | undefined
  insert(row: T): T
  update(id: string, patch: Partial<T>): T | undefined
  save(rows: T[]): void
}

export function table<T extends { id: string }>(name: string): Table<T> {
  const all = () => {
    ensureSeeded()
    return parse<T>(read(name))
  }
  const save = (rows: T[]) => write(name, JSON.stringify(rows))
  return {
    all,
    save,
    find: (predicate) => all().find(predicate),
    filter: (predicate) => all().filter(predicate),
    get: (id) => all().find((row) => row.id === id),
    insert(row) {
      save([...all(), row])
      return row
    },
    update(id, patch) {
      const rows = all()
      const index = rows.findIndex((row) => row.id === id)
      if (index === -1) return undefined
      rows[index] = { ...rows[index], ...patch }
      save(rows)
      return rows[index]
    },
  }
}

export const uuid = () => crypto.randomUUID()
export const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

/** Network-like delay so loading states behave the same as with the services. */
export function respond<T>(value: T | (() => T), ms = 180 + Math.random() * 220): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(typeof value === 'function' ? (value as () => T)() : value)
      } catch (error) {
        reject(error)
      }
    }, ms)
  })
}

export function fail(status: number, code: string, message: string): never {
  throw new ApiError(status, code, message)
}

/** Same rule the services apply: writes need a valid token, optionally with a role. */
export function requireAuth(roles?: Role[]): Claims {
  const claims = decodeClaims(getToken())
  if (!claims) fail(401, 'UNAUTHORIZED', 'Tu sesión expiró. Inicia sesión de nuevo.')
  if (roles && !roles.includes(claims.role)) fail(403, 'FORBIDDEN', 'Tu rol no tiene permiso para esta acción.')
  return claims
}
