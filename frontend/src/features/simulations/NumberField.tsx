import { useId } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '../../lib/cn'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  hint?: string
  /** After checking: whether the answer was right, and the expected value. */
  result?: { ok: boolean; expected: string }
  disabled?: boolean
}

/** Parses "0,84" or "0.84"; returns null for empty or invalid input. */
export function parseNumber(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.')
  if (!normalized) return null
  const number = Number(normalized)
  return Number.isFinite(number) ? number : null
}

export function NumberField({ label, value, onChange, suffix, hint, result, disabled }: Props) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-subhead font-medium text-label">
        {label}
      </label>
      {hint && <p className="text-footnote text-label-2">{hint}</p>}
      <div className="flex items-center gap-2">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={result ? !result.ok : undefined}
          className={cn(
            'h-11 w-32 rounded-control border bg-surface px-3 text-body tabular focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-100',
            result ? (result.ok ? 'border-success' : 'border-danger') : 'border-separator-strong',
          )}
        />
        {suffix && <span className="text-subhead text-label-2">{suffix}</span>}
        {result &&
          (result.ok ? (
            <Check className="size-5 text-success" aria-label="Correcto" />
          ) : (
            <X className="size-5 text-danger" aria-label="Incorrecto" />
          ))}
      </div>
      {result && !result.ok && <p className="text-footnote text-label-2">Respuesta esperada: {result.expected}</p>}
    </div>
  )
}
