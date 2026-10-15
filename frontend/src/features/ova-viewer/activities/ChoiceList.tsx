import { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { renderInline } from '../../../lib/markdown'
import type { ChoiceOption } from '../../../types/activities'

interface ChoiceListProps {
  name: string
  options: ChoiceOption[]
  value: string | undefined
  onChange: (value: string) => void
  disabled?: boolean
  /** After checking: the correct option id, when known. */
  correct?: string
}

/** Single-choice list built on native radios (keyboard and screen reader friendly). */
export function ChoiceList({ name, options, value, onChange, disabled, correct }: ChoiceListProps) {
  return (
    <div role="radiogroup" className="grid gap-2.5">
      {options.map((option, index) => {
        const selected = value === option.id
        const state =
          correct === undefined ? null : option.id === correct ? 'correct' : selected ? 'wrong' : 'idle'
        return (
          <label
            key={option.id}
            className={cn(
              'flex min-h-12 cursor-pointer items-center gap-3 rounded-control border px-4 py-3 transition-[background-color,border-color] duration-150',
              'has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(--focus-ring)',
              disabled && 'cursor-default',
              state === 'correct' && 'border-success bg-success-soft',
              state === 'wrong' && 'border-danger bg-danger-soft',
              state === 'idle' && 'border-separator opacity-60',
              state === null && (selected ? 'border-accent bg-accent-soft' : 'border-separator-strong hover:bg-surface-2'),
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border text-footnote font-semibold',
                selected && state === null ? 'border-accent bg-accent text-on-accent' : 'border-separator-strong text-label-2',
                state === 'correct' && 'border-success bg-success text-white dark:text-black',
                state === 'wrong' && 'border-danger bg-danger text-white dark:text-black',
              )}
            >
              {state === 'correct' ? <Check className="size-4" /> : state === 'wrong' ? <X className="size-4" /> : String.fromCharCode(65 + index)}
            </span>
            <OptionText text={option.text} />
          </label>
        )
      })}
    </div>
  )
}

function OptionText({ text }: { text: string }) {
  const html = useMemo(() => renderInline(text), [text])
  return <span className="text-subhead text-label" dangerouslySetInnerHTML={{ __html: html }} />
}
