import { Link, useParams } from 'react-router'
import { ChevronLeft, Sparkles, Target } from 'lucide-react'
import { ApiError } from '../../api/client'
import { ButtonLink } from '../../components/Button'
import { MilestoneProgress } from '../../components/MilestoneProgress'
import { ErrorView, Skeleton, StateView } from '../../components/StateView'
import { useAuth } from '../auth/useAuth'
import { topicIcon } from '../ova-catalog/topics'
import { StepList } from './StepList'
import { useOVAJourney } from './useOVAJourney'

/** OVA overview: outcome, contents and where to continue. */
export function OVAViewer() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const journey = useOVAJourney(id)
  const { ova, steps, completed } = journey

  if (journey.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14 sm:px-6" aria-busy>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }
  if (ova.isError) {
    if (ova.error instanceof ApiError && ova.error.status === 404) {
      return (
        <StateView
          title="Este OVA no existe"
          message="Puede que el enlace esté incompleto o que el OVA ya no esté disponible."
          action={<ButtonLink to="/">Volver a la ruta de aprendizaje</ButtonLink>}
        />
      )
    }
    return <ErrorView error={ova.error} onRetry={() => ova.refetch()} />
  }
  if (!ova.data) return null

  const Icon = topicIcon(ova.data.title)
  const nextIndex = steps.findIndex((step) => step.kind !== 'recap' && !completed.has(step.id))
  const started = completed.size > 0
  const target = nextIndex === -1 ? steps.length : nextIndex + 1

  return (
    <article className="mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6 md:pt-12">
      <Link
        to="/"
        className="-ml-2 inline-flex h-11 items-center gap-1 rounded-full pr-3 pl-1 text-subhead font-medium text-accent hover:bg-accent-soft"
      >
        <ChevronLeft className="size-5" aria-hidden />
        Ruta de aprendizaje
      </Link>

      <header className="mt-6 animate-rise">
        <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Icon className="size-7" strokeWidth={1.8} aria-hidden />
        </span>
        <h1 className="mt-5 text-title-1 font-bold tracking-tight sm:text-large-title">{ova.data.title}</h1>
        <p className="mt-3 text-body text-label-2">{ova.data.description}</p>
        {steps.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <ButtonLink to={`/ovas/${id}/paso/${target}`} size="lg">
              {nextIndex === -1 ? 'Repasar' : started ? 'Continuar' : 'Empezar'}
            </ButtonLink>
            {user?.role === 'estudiante' && started && (
              <div className="w-48 space-y-1.5">
                <MilestoneProgress value={journey.percent} milestones={[25, 50, 75, 100]} label="Tu avance en este OVA" />
                <p className="text-footnote text-label-2 tabular">{journey.percent}% completado</p>
              </div>
            )}
          </div>
        )}
      </header>

      <section className="card mt-10 flex gap-4 p-6 animate-rise" aria-labelledby="resultado">
        <Target className="mt-0.5 size-6 shrink-0 text-accent" strokeWidth={1.8} aria-hidden />
        <div>
          <h2 id="resultado" className="text-headline">
            Resultado de aprendizaje
          </h2>
          <p className="mt-1 text-subhead text-label-2">{ova.data.learning_outcome}</p>
        </div>
      </section>

      {steps.length > 0 && (
        <>
          <section className="mt-8 animate-rise" aria-labelledby="contenido-ova">
            <h2 id="contenido-ova" className="mb-3 px-1 text-title-3 font-semibold">
              Contenido · {steps.length} pasos
            </h2>
            <nav className="card p-2" aria-label="Pasos del OVA">
              <StepList ovaId={id} steps={steps} completed={completed} />
            </nav>
          </section>

          <section className="mt-6 flex gap-3 rounded-card bg-ai-soft p-5 animate-rise" aria-labelledby="uso-ia">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-ai" aria-hidden />
            <div className="text-subhead">
              <h2 id="uso-ia" className="font-semibold text-label">
                Cómo se usa la IA en este OVA
              </h2>
              <p className="mt-1 text-label-2">
                Un modelo de IA generativa te da pistas sin revelar respuestas, revisa tus casos con una rúbrica, sintetiza
                las discusiones del equipo, explica tus errores y arma tu repaso final. Lo que escribes se envía al
                servicio de IA del curso solo cuando tú lo pides. Sus respuestas pueden equivocarse: un validador del
                curso las revisa y siempre debes contrastarlas con el material.
              </p>
            </div>
          </section>
        </>
      )}
    </article>
  )
}
