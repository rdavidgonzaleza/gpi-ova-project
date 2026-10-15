import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { cn } from '../../lib/cn'

interface AIPanelProps {
  title: string
  /** What the model is doing, said specifically (HIG generative-ai.md › Outputs). */
  pendingLabel: string
  pending: boolean
  error: string | null
  children?: ReactNode
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

/**
 * Frame for every AI output. It always carries the critical-validation notice
 * required by RF-09 and offers a way to regenerate (keep people in control).
 */
export function AIPanel({ title, pendingLabel, pending, error, children, onRetry, retryLabel, className }: AIPanelProps) {
  return (
    <section
      aria-live="polite"
      aria-busy={pending}
      className={cn('animate-rise overflow-hidden rounded-card border border-ai/25 bg-ai-soft', className)}
    >
      <header className="flex items-center gap-2 px-5 pt-4 text-footnote font-semibold text-ai">
        <Sparkles className="size-4" aria-hidden />
        {title}
      </header>
      <div className="px-5 pt-2 pb-4">
        {pending ? (
          <p className="flex items-center gap-3 py-3 text-subhead text-label-2">
            <Spinner className="size-4 text-ai" />
            {pendingLabel}
          </p>
        ) : error ? (
          <div className="flex flex-col items-start gap-2 py-1">
            <p role="alert" className="text-subhead text-label">
              {error}
            </p>
            {onRetry && (
              <Button variant="plain" size="sm" icon={<RotateCcw className="size-4" aria-hidden />} onClick={onRetry} className="-ml-4">
                Reintentar
              </Button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
      {!pending && !error && children && (
        <footer className="flex flex-col gap-3 border-t border-ai/15 bg-surface/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-footnote text-label-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              Generado con IA: puede contener errores. Contrástalo con el material del OVA antes de darlo por cierto. Un
              validador del curso revisa estas respuestas.
            </span>
          </p>
          {onRetry && (
            <Button variant="plain" size="sm" icon={<RotateCcw className="size-4" aria-hidden />} onClick={onRetry} className="shrink-0">
              {retryLabel ?? 'Generar de nuevo'}
            </Button>
          )}
        </footer>
      )}
    </section>
  )
}

/** Shown instead of an AI action to visitors without a session. */
export function AISignInPrompt({ action }: { action: string }) {
  const location = useLocation()
  return (
    <p className="flex flex-wrap items-center gap-2 rounded-control bg-ai-soft px-4 py-3 text-subhead text-label-2">
      <Sparkles className="size-4 text-ai" aria-hidden />
      <span>
        <Link to="/login" state={{ from: location.pathname }} className="font-semibold text-ai hover:underline">
          Inicia sesión
        </Link>{' '}
        para {action}.
      </span>
    </p>
  )
}
