import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { ApiError } from '../api/client'
import { cn } from '../lib/cn'
import { Button } from './Button'

interface StateViewProps {
  icon?: ReactNode
  title: string
  message?: string
  action?: ReactNode
  className?: string
}

/** Empty and error states: say what happened and invite the next action. */
export function StateView({ icon, title, message, action, className }: StateViewProps) {
  return (
    <div className={cn('mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-16 text-center', className)}>
      {icon && <div className="mb-1 text-label-3 [&>svg]:size-10 [&>svg]:stroke-[1.5]">{icon}</div>}
      <h2 className="text-title-3 font-semibold">{title}</h2>
      {message && <p className="text-subhead text-label-2">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function ErrorView({ error, onRetry, title }: { error: unknown; onRetry?: () => void; title?: string }) {
  const message =
    error instanceof ApiError ? error.message : 'Ocurrió un problema inesperado. Vuelve a intentarlo en unos segundos.'
  return (
    <StateView
      icon={<AlertCircle />}
      title={title ?? 'No se pudo cargar esta sección'}
      message={message}
      action={
        onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Reintentar
          </Button>
        )
      }
    />
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-control', className)} aria-hidden />
}
