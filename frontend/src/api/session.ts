import type { Role, UUID } from '../types/domain'

// Spec 8.2: the token lives in localStorage under the key "token".
const TOKEN_KEY = 'token'

export interface Claims {
  sub: UUID
  role: Role
  exp: number
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Reads the claims of a token without verifying it (verification is the
 * services' job). identity-service issues `payload.signature`, both base64url.
 */
export function decodeClaims(token: string | null): Claims | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const claims = JSON.parse(json) as Claims
    if (!claims.sub || !claims.role || !claims.exp) return null
    return claims.exp * 1000 > Date.now() ? claims : null
  } catch {
    return null
  }
}
