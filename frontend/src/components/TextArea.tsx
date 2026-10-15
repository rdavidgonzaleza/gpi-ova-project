import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-subhead font-semibold text-label">
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'min-h-28 w-full resize-y rounded-control border bg-surface px-4 py-3 text-body text-label',
          'placeholder:text-label-3 transition-[border-color,box-shadow] duration-150',
          'focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-soft)] focus:outline-none',
          error ? 'border-danger' : 'border-separator-strong',
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-footnote text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="text-footnote text-label-2">
            {hint}
          </p>
        )
      )}
    </div>
  )
})
