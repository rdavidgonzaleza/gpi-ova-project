import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { TextField } from '../../components/TextField'

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false)
  return (
    <TextField
      ref={ref}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          className="grid size-10 place-items-center rounded-full text-label-2 hover:bg-surface-2 hover:text-label"
        >
          {visible ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
        </button>
      }
      {...props}
    />
  )
})
