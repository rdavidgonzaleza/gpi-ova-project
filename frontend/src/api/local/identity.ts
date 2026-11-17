import type { AuthApi } from '../auth'
import { getToken } from '../session'
import type { Role, User } from '../../types/domain'
import { checkPassword, hashPassword, issueToken, verifyToken } from './crypto'
import { fail, now, requireAuth, respond, table, uuid } from './store'

interface UserRow extends User {
  password_hash: string
  created_at: string
}

const ROLES: Role[] = ['estudiante', 'docente', 'administrador', 'validador']
const users = () => table<UserRow>('users')
const publicUser = ({ id, email, full_name, role }: UserRow): User => ({ id, email, full_name, role })

export function localIdentity(): AuthApi {
  return {
    async register(request) {
      const email = request.email.trim().toLowerCase()
      if (!email.includes('@') || request.full_name.trim().length < 3 || request.password.length < 8) {
        fail(400, 'INVALID_BODY', 'Revisa los datos del formulario.')
      }
      if (!ROLES.includes(request.role)) fail(400, 'INVALID_BODY', 'Rol no válido.')
      if (users().find((row) => row.email === email)) fail(409, 'EMAIL_TAKEN', 'El correo ya está registrado')
      const row: UserRow = {
        id: uuid(),
        email,
        full_name: request.full_name.trim(),
        role: request.role,
        password_hash: await hashPassword(request.password),
        created_at: now(),
      }
      users().insert(row)
      return respond(publicUser(row))
    },

    async login(email, password) {
      const row = users().find((candidate) => candidate.email === email.trim().toLowerCase())
      const valid = row ? await checkPassword(password, row.password_hash) : false
      if (!row || !valid) return respond(() => fail(401, 'INVALID_CREDENTIALS', 'credenciales inválidas'))
      return respond({ token: await issueToken(row.id, row.role), user: publicUser(row) })
    },

    async me() {
      const token = getToken()
      const claims = token ? await verifyToken(token) : null
      const row = claims ? users().get(claims.sub) : undefined
      if (!row) return respond(() => fail(401, 'UNAUTHORIZED', 'token inválido o expirado'), 80)
      return respond(publicUser(row), 80)
    },

    listUsers: (role) =>
      respond(() => {
        requireAuth(['docente', 'administrador'])
        if (role && !ROLES.includes(role)) fail(400, 'INVALID_QUERY', 'rol inválido')
        return users()
          .filter((row) => !role || row.role === role)
          .map(publicUser)
          .sort((a, b) => a.full_name.localeCompare(b.full_name, 'es'))
      }),
  }
}
