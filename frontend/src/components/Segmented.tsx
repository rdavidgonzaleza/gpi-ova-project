import { useId } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '../lib/cn'

interface Option {
  value: string
  label: string
}

interface Props {
  legend: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  /** After checking: whether the choice was right and the expected label. */
  result?: { ok: boolean; expected: string }
  /** Visually hide the legend (it is still read by screen readers). */
  hideLegend?: boolean
  size?: 'sm' | 'md'
}

/** Single-choice segmented control built on native radio buttons. */
export function Segmented({ legend, options, value, onChange, disabled, result, hideLegend, size = 'md' }: Props) {
  const name = useId()
  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className={cn('mb-2 flex items-center gap-2 text-subhead font-medium', hideLegend && 'sr-only')}>
        {legend}
        {result &&
          (result.ok ? <Check className="size-5 text-success" aria-label="Correcto" /> : <X className="size-5 text-danger" aria-label="Incorrecto" />)}
      </legend>
      <div className="inline-flex flex-wrap gap-1 rounded-control bg-surface-2 p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center rounded-[0.6rem] font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent',
              size === 'sm' ? 'h-9 px-3 text-footnote' : 'h-10 px-4 text-subhead',
              value === option.value ? 'bg-surface text-label shadow-card' : 'text-label-2 hover:text-label',
              disabled && 'cursor-default',
            )}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {result && !result.ok && <p className="text-footnote text-label-2">Respuesta esperada: {result.expected}</p>}
    </fieldset>
  )
}
