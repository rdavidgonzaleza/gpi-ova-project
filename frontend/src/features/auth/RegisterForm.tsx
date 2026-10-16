import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ApiError } from '../../api/client'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { AuthShell } from './AuthShell'
import { PasswordField } from './PasswordField'
import { useAuth } from './useAuth'

type Field = 'full_name' | 'email' | 'password'

function validate(values: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (values.full_name.trim().split(/\s+/).length < 2) errors.full_name = 'Escribe tu nombre y apellido.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Escribe un correo válido.'
  if (values.password.length < 8) errors.password = 'Usa al menos 8 caracteres.'
  return errors
}

export function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState<Record<Field, string>>({ full_name: '', email: '', password: '' })
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const errors = validate(values)
  const showError = (field: Field) => (touched[field] ? errors[field] : undefined)

  const bind = (field: Field) => ({
    value: values[field],
    onChange: (event: { target: { value: string } }) => setValues((prev) => ({ ...prev, [field]: event.target.value })),
    onBlur: () => setTouched((prev) => ({ ...prev, [field]: true })),
    error: showError(field),
  })

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched({ full_name: true, email: true, password: true })
    if (Object.keys(errors).length > 0) return
    setError(null)
    setSubmitting(true)
    try {
      await register({ ...values, email: values.email.trim(), role: 'estudiante' })
      navigate('/', { replace: true })
    } catch (cause) {
      setError(
        cause instanceof ApiError && cause.code === 'EMAIL_TAKEN'
          ? 'Ya existe una cuenta con ese correo. Inicia sesión.'
          : cause instanceof ApiError
            ? cause.message
            : 'No fue posible crear la cuenta. Inténtalo de nuevo.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Guarda tu progreso en cada OVA y recibe retroalimentación personalizada.">
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <TextField label="Nombre completo" autoComplete="name" autoFocus {...bind('full_name')} />
        <TextField
          label="Correo institucional"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@unicartagena.edu.co"
          {...bind('email')}
        />
        <PasswordField label="Contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres." {...bind('password')} />
        {error && (
          <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-subhead text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" loading={submitting}>
          Crear cuenta
        </Button>
        <p className="text-center text-subhead text-label-2">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
