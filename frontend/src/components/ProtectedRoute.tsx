import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../features/auth/useAuth'
import type { Role } from '../types/domain'
import { Spinner } from './Spinner'

interface ProtectedRouteProps {
  role?: Role | Role[]
  children: ReactNode
}

/** Spec 8.2: redirects to /login when there is no session or the role does not match. */
export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'checking' && !user) {
    return (
      <div className="grid min-h-[50dvh] place-items-center text-label-3">
        <Spinner label="Verificando tu sesión" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  const allowed = role === undefined || (Array.isArray(role) ? role.includes(user.role) : user.role === role)
  if (!allowed) return <Navigate to="/login" replace state={{ from: location.pathname, forbidden: true }} />

  return <>{children}</>
}
