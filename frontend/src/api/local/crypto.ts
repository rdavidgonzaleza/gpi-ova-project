import type { Role, UUID } from '../../types/domain'

// Token and password primitives for the local identity adapter. Tokens use the
// same format as identity-service: base64url(payload) + "." + base64url(HMAC-SHA256).

const encoder = new TextEncoder()
const KEY_STORAGE = 'gpi.signing_key'
const TOKEN_TTL_SECONDS = 24 * 60 * 60
const PBKDF2_ITERATIONS = 100_000

function base64url(bytes: Uint8Array | string): string {
  const binary = typeof bytes === 'string' ? bytes : String.fromCharCode(...bytes)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function signingSecret(): string {
  let secret = localStorage.getItem(KEY_STORAGE)
  if (!secret) {
    secret = base64url(crypto.getRandomValues(new Uint8Array(32)))
    localStorage.setItem(KEY_STORAGE, secret)
  }
  return secret
}

async function hmacKey() {
  return crypto.subtle.importKey('raw', encoder.encode(signingSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ])
}

export async function issueToken(sub: UUID, role: Role): Promise<string> {
  const payload = base64url(JSON.stringify({ sub, role, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS }))
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(payload))
  return `${payload}.${base64url(new Uint8Array(signature))}`
}

export async function verifyToken(token: string): Promise<{ sub: UUID; role: Role } | null> {
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra !== undefined) return null
  const valid = await crypto.subtle.verify(
    'HMAC',
    await hmacKey(),
    fromBase64(signature) as Uint8Array<ArrayBuffer>,
    encoder.encode(payload),
  )
  if (!valid) return null
  const claims = JSON.parse(new TextDecoder().decode(fromBase64(payload)))
  return claims.exp * 1000 > Date.now() ? { sub: claims.sub, role: claims.role } : null
}

// Password hash format: pbkdf2-sha256$<iterations>$<salt>$<hash> (base64url).
export async function hashPassword(password: string, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const hash = await derive(password, salt, PBKDF2_ITERATIONS)
  return `pbkdf2-sha256$${PBKDF2_ITERATIONS}$${base64url(salt)}$${base64url(hash)}`
}

export async function checkPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterations, salt, hash] = stored.split('$')
  if (scheme !== 'pbkdf2-sha256' || !salt || !hash) return false
  const derived = await derive(password, fromBase64(salt), Number(iterations))
  return base64url(derived) === hash
}

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as Uint8Array<ArrayBuffer>, iterations },
    key,
    256,
  )
  return new Uint8Array(bits)
}
