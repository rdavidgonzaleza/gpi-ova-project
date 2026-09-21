import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/auth'
import { Button } from '../../components/Button'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const data = await authApi.login({ email, password })
      login(data.token, data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-full max-w-sm bg-white dark:bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-[var(--color-border)]">
        <h1 className="text-2xl font-semibold tracking-tight text-center mb-8">Iniciar Sesión</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-content-secondary)]">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)] transition-shadow"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-content-secondary)]">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)] transition-shadow"
              required
            />
          </div>

          {error && <div className="text-sm text-red-500 font-medium px-1">{error}</div>}

          <Button type="submit" disabled={isLoading} className="mt-2 w-full">
            {isLoading ? 'Iniciando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
