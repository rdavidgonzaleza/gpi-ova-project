import { http } from './client'
import { localIdentity } from './local/identity'
import { pick } from './source'
import type { LoginResponse, RegisterRequest, Role, User } from '../types/domain'

// identity-service — spec 5.1
export interface AuthApi {
  register(request: RegisterRequest): Promise<User>
  login(email: string, password: string): Promise<LoginResponse>
  me(): Promise<User>
  /** Requires a docente/administrador token. */
  listUsers(role?: Role): Promise<User[]>
}

const remote: AuthApi = {
  register: (request) => http('/api/auth/register', { method: 'POST', body: request }),
  login: (email, password) => http('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => http('/api/auth/me'),
  listUsers: (role) => http('/api/auth/users', { query: { role } }),
}

export const authApi = pick('identity', { remote, local: localIdentity })
