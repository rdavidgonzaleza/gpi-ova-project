import { BookOpen } from 'lucide-react'
import { ButtonLink } from '../../components/Button'
import { ErrorView, Skeleton, StateView } from '../../components/StateView'
import { firstName } from '../../lib/roles'
import { useAuth } from '../auth/useAuth'
import { OVACard } from './OVACard'
import { useCatalog } from './useCatalog'

export function OVAList() {
  const { user } = useAuth()
  const { ovas, progress } = useCatalog()
  const isStudent = user?.role === 'estudiante'

  const completed = progress ? [...progress.values()].filter((row) => row.status === 'completado').length : 0
  const total = ovas.data?.length ?? 0

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pt-14">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-subhead font-medium text-label-2">
            {user ? `Hola, ${firstName(user.full_name)}` : 'Gestión de Proyectos Informáticos'}
          </p>
          <h1 className="mt-1 text-title-1 font-bold tracking-tight sm:text-large-title">Ruta de aprendizaje</h1>
          <p className="mt-3 max-w-2xl text-body text-label-2">
            Cada OVA recorre un área de la gestión de proyectos con lecturas cortas, simulaciones y retroalimentación de
            inteligencia artificial.
          </p>
        </div>
        {isStudent && total > 0 && (
          <div className="card flex items-center gap-4 px-5 py-4" aria-label="Resumen de tu avance">
            <span className="text-title-1 font-semibold tabular">
              {completed}
              <span className="text-title-3 text-label-3">/{total}</span>
            </span>
            <span className="text-footnote leading-tight text-label-2">
              unidades
              <br />
              completadas
            </span>
          </div>
        )}
        {!user && (
          <ButtonLink to="/login" variant="primary" className="self-start md:self-auto">
            Inicia sesión para guardar tu avance
          </ButtonLink>
        )}
      </header>

      {ovas.isPending ? (
        <div className="grid gap-5 sm:grid-cols-2" aria-busy>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-card" />
          ))}
        </div>
      ) : ovas.isError ? (
        <ErrorView error={ovas.error} onRetry={() => ovas.refetch()} />
      ) : ovas.data.length === 0 ? (
        <StateView
          icon={<BookOpen />}
          title="Todavía no hay OVA publicados"
          message="Cuando el docente publique la primera unidad aparecerá aquí."
        />
      ) : (
        <ol className="grid gap-5 sm:grid-cols-2">
          {ovas.data.map((ova, index) => (
            <li key={ova.id} className="flex">
              <OVACard
                ova={ova}
                index={index}
                progress={progress?.get(ova.id)}
                showProgress={isStudent}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
