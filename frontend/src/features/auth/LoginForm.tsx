import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ApiError } from '../../api/client'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { AuthShell } from './AuthShell'
import { PasswordField } from './PasswordField'
import { homeFor } from './homeFor'
import { useAuth } from './useAuth'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { from?: string; forbidden?: boolean } | null
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(
    state?.forbidden ? 'Tu cuenta no tiene acceso a esa sección. Inicia sesión con otra cuenta.' : null,
  )
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await login(email, password)
      navigate(state?.from && !state.forbidden ? state.from : homeFor(user.role), { replace: true })
    } catch (cause) {
      setError(
        cause instanceof ApiError && cause.status === 401
          ? 'El correo o la contraseña no son correctos.'
          : cause instanceof ApiError
            ? cause.message
            : 'No fue posible iniciar sesión. Inténtalo de nuevo.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Inicia sesión" subtitle="Usa tu correo institucional para continuar donde lo dejaste.">
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <TextField
          label="Correo institucional"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="nombre@unicartagena.edu.co"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoFocus
        />
        <PasswordField
          label="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && (
          <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-subhead text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" loading={submitting} disabled={!email || !password}>
          Iniciar sesión
        </Button>
        <p className="text-center text-subhead text-label-2">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-accent hover:underline">
            Crea una
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
