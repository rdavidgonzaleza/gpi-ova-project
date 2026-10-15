import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { ChevronLeft, Target } from 'lucide-react'
import { contentApi } from '../../api/content'
import { ApiError } from '../../api/client'
import { ButtonLink } from '../../components/Button'
import { ErrorView, Skeleton, StateView } from '../../components/StateView'
import { topicIcon } from '../ova-catalog/topics'

export function OVAViewer() {
  const { id = '' } = useParams()
  const ova = useQuery({ queryKey: ['ova', id], queryFn: () => contentApi.get(id) })

  if (ova.isPending) {
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

  const Icon = topicIcon(ova.data.title)
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
      </header>
      <section className="card mt-8 flex gap-4 p-6 animate-rise" aria-labelledby="resultado">
        <Target className="mt-0.5 size-6 shrink-0 text-accent" strokeWidth={1.8} aria-hidden />
        <div>
          <h2 id="resultado" className="text-headline">
            Resultado de aprendizaje
          </h2>
          <p className="mt-1 text-subhead text-label-2">{ova.data.learning_outcome}</p>
        </div>
      </section>
    </article>
  )
}
