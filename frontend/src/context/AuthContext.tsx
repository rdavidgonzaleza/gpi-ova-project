import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth'
import { ApiError } from '../api/client'
import { clearToken, decodeClaims, getToken, setToken } from '../api/session'
import type { RegisterRequest, User } from '../types/domain'

type Status = 'checking' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  user: User | null
  status: Status
  login(email: string, password: string): Promise<User>
  register(request: RegisterRequest): Promise<User>
  logout(): void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const USER_KEY = 'user'

function cachedUser(): User | null {
  if (!decodeClaims(getToken())) return null
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(cachedUser)
  const [status, setStatus] = useState<Status>(() => (getToken() ? 'checking' : 'anonymous'))

  const remember = useCallback((next: User | null) => {
    setUser(next)
    setStatus(next ? 'authenticated' : 'anonymous')
    if (next) localStorage.setItem(USER_KEY, JSON.stringify(next))
    else localStorage.removeItem(USER_KEY)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    remember(null)
    queryClient.clear()
  }, [queryClient, remember])

  // Revalidate a stored session against GET /api/auth/me on start.
  useEffect(() => {
    if (!getToken()) return
    if (!decodeClaims(getToken())) {
      logout()
      return
    }
    authApi
      .me()
      .then(remember)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) logout()
        else setStatus(cachedUser() ? 'authenticated' : 'anonymous')
      })
  }, [logout, remember])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login(email, password)
      setToken(response.token)
      queryClient.clear()
      remember(response.user)
      return response.user
    },
    [queryClient, remember],
  )

  const register = useCallback(
    async (request: RegisterRequest) => {
      await authApi.register(request)
      return login(request.email, request.password)
    },
    [login],
  )

  const value = useMemo(() => ({ user, status, login, register, logout }), [user, status, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
