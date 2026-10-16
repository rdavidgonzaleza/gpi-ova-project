import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react'
import { Button, ButtonLink } from '../../components/Button'
import { MilestoneProgress } from '../../components/MilestoneProgress'
import { ErrorView, Skeleton } from '../../components/StateView'
import { EvaluationForm } from '../evaluation/EvaluationForm'
import { ActivityCard } from './ActivityCard'
import { ContentBlock } from './ContentBlock'
import { RecapStep } from './RecapStep'
import { StepList } from './StepList'
import { useOVAJourney, type Step } from './useOVAJourney'

export function OVAPlayer() {
  const { id = '', paso = '1' } = useParams()
  const navigate = useNavigate()
  const journey = useOVAJourney(id)
  const { steps, completed, complete } = journey
  const index = Math.max(0, Number.parseInt(paso, 10) - 1)
  const step: Step | undefined = steps[index]

  useEffect(() => {
    journey.markStarted()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Reading a block counts as completing it.
  useEffect(() => {
    if (step?.kind === 'block') complete(step.id)
  }, [step, complete])

  useEffect(() => {
    if (!step) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable]') || event.altKey || event.metaKey) return
      if (event.key === 'ArrowRight' && index < steps.length - 1) navigate(`/ovas/${id}/paso/${index + 2}`)
      if (event.key === 'ArrowLeft' && index > 0) navigate(`/ovas/${id}/paso/${index}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, index, steps.length, id, navigate])

  if (journey.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6" aria-busy>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }
  if (journey.error || !journey.ova.data) return <ErrorView error={journey.error} onRetry={() => journey.ova.refetch()} />
  if (!step) return <Navigate to={`/ovas/${id}`} replace />

  const ova = journey.ova.data
  const prev = index > 0 ? `/ovas/${id}/paso/${index}` : null
  const next = index < steps.length - 1 ? `/ovas/${id}/paso/${index + 2}` : null

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:pt-10">
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-5">
          <Link to={`/ovas/${id}`} className="flex items-center gap-1 text-footnote font-medium text-accent hover:underline">
            <ChevronLeft className="size-4" aria-hidden />
            Resumen del OVA
          </Link>
          <div className="space-y-2">
            <p className="text-headline">{ova.title}</p>
            <MilestoneProgress value={journey.percent} milestones={[25, 50, 75, 100]} label="Tu avance en este OVA" />
            <p className="text-footnote text-label-2 tabular">{journey.percent}% completado</p>
          </div>
          <nav aria-label="Pasos del OVA" className="max-h-[calc(100dvh-14rem)] overflow-y-auto pr-1">
            <StepList ovaId={id} steps={steps} current={index} completed={completed} />
          </nav>
        </div>
      </aside>

      <div className="min-w-0">
        <details className="card group mb-6 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
            <ListOrdered className="size-5 text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-subhead font-semibold">{ova.title}</span>
              <span className="block text-footnote text-label-2 tabular">
                Paso {index + 1} de {steps.length} · {journey.percent}%
              </span>
            </span>
            <ChevronRight className="size-5 text-label-3 transition-transform group-open:rotate-90" aria-hidden />
          </summary>
          <nav aria-label="Pasos del OVA" className="border-t border-separator p-2">
            <StepList ovaId={id} steps={steps} current={index} completed={completed} />
          </nav>
        </details>

        <article key={step.id} className="animate-rise">
          <StepView step={step} journey={journey} />
        </article>

        <nav aria-label="Navegación entre pasos" className="mt-12 flex items-center justify-between gap-3 border-t border-separator pt-6">
          {prev ? (
            <ButtonLink to={prev} variant="secondary" icon={<ChevronLeft className="size-4" aria-hidden />}>
              Anterior
            </ButtonLink>
          ) : (
            <span />
          )}
          <span className="hidden text-footnote text-label-2 sm:block tabular">
            {index + 1} / {steps.length}
          </span>
          {next ? (
            <ButtonLink to={next}>
              Siguiente
              <ChevronRight className="size-4" aria-hidden />
            </ButtonLink>
          ) : (
            <Button onClick={() => navigate('/')}>Volver a la ruta</Button>
          )}
        </nav>
      </div>
    </div>
  )
}

function StepView({ step, journey }: { step: Step; journey: ReturnType<typeof useOVAJourney> }) {
  const ova = journey.ova.data!
  const done = journey.completed.has(step.id)
  const onComplete = (result: Record<string, unknown>) => journey.complete(step.id, result)
  switch (step.kind) {
    case 'block':
      return <ContentBlock block={step.block} />
    case 'activity':
      return <ActivityCard activity={step.activity} done={done} onComplete={onComplete} />
    case 'evaluation':
      return (
        <EvaluationForm
          ovaTitle={ova.title}
          title={step.title}
          description={step.activity.description}
          config={step.activity.config}
          evaluation={step.evaluation}
          done={done}
          onComplete={onComplete}
        />
      )
    case 'recap':
      return <RecapStep ova={ova} journey={journey} />
  }
}
