import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowDownUp, Download, Search, Users } from 'lucide-react'
import { Button } from '../../components/Button'
import { ErrorView, Skeleton, StateView } from '../../components/StateView'
import { cn } from '../../lib/cn'
import { initials } from '../../lib/roles'
import { topicIcon } from '../ova-catalog/topics'
import { GROUP_ID, toCSV, useClassProgress, type StudentRow } from './useClassProgress'

type Sort = 'name' | 'progress' | 'access'
const AT_RISK = 30

const shortTitle = (title: string) => {
  const short = title.replace(/^Gestión (del|de la|de) /, '')
  return short.charAt(0).toUpperCase() + short.slice(1)
}

function relative(iso: string | null) {
  if (!iso) return 'Sin actividad'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  return `Hace ${days} días`
}

export function ProgressTable() {
  const { rows, ovas, report, isLoading, error, refetch } = useClassProgress()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('progress')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = rows.filter(
      (row) => !term || row.student.full_name.toLowerCase().includes(term) || row.student.email.includes(term),
    )
    const by: Record<Sort, (a: StudentRow, b: StudentRow) => number> = {
      name: (a, b) => a.student.full_name.localeCompare(b.student.full_name, 'es'),
      progress: (a, b) => b.average - a.average,
      access: (a, b) => (b.lastAccess ?? '').localeCompare(a.lastAccess ?? ''),
    }
    return [...filtered].sort(by[sort])
  }, [rows, query, sort])

  const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.average, 0) / rows.length) : 0
  const atRisk = rows.filter((row) => row.average < AT_RISK).length
  const completedUnits = report?.rows.reduce((sum, row) => sum + row.students_completed, 0) ?? 0

  function exportCSV() {
    const blob = new Blob([toCSV(visible, ovas)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = Object.assign(document.createElement('a'), {
      href: url,
      download: `progreso-${GROUP_ID}-${new Date().toISOString().slice(0, 10)}.csv`,
    })
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pt-14">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-subhead font-medium text-label-2">Grupo {GROUP_ID.toUpperCase()}</p>
          <h1 className="mt-1 text-title-1 font-bold tracking-tight sm:text-large-title">Progreso del grupo</h1>
        </div>
        <Button variant="secondary" icon={<Download className="size-4" aria-hidden />} onClick={exportCSV} disabled={!rows.length}>
          Exportar reporte (CSV)
        </Button>
      </header>

      {error ? (
        <ErrorView error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-4" aria-busy>
          <div className="grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-24 rounded-card" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-card" />
        </div>
      ) : rows.length === 0 ? (
        <StateView icon={<Users />} title="Aún no hay estudiantes en el grupo" message="Cuando se registren aparecerán aquí." />
      ) : (
        <>
          <dl className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Metric label="Estudiantes" value={rows.length} />
            <Metric label="Avance promedio" value={`${average}%`} />
            <Metric label="Unidades completadas" value={completedUnits} />
            <Metric label={`Avance menor al ${AT_RISK}%`} value={atRisk} tone={atRisk > 0 ? 'warning' : undefined} />
          </dl>

          {report && report.rows.length > 0 && (
            <section className="mb-8" aria-labelledby="por-ova">
              <h2 id="por-ova" className="mb-3 text-title-3 font-semibold">
                Uso por OVA
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ovas.map((ova) => {
                  const item = report.rows.find((row) => row.ova_id === ova.id)
                  const Icon = topicIcon(ova.title)
                  const started = item?.students_started ?? 0
                  const completed = item?.students_completed ?? 0
                  return (
                    <li key={ova.id} className="card space-y-3 p-5">
                      <p className="flex items-center gap-2 text-subhead font-semibold">
                        <Icon className="size-5 text-accent" aria-hidden />
                        {ova.title}
                      </p>
                      <div
                        className="flex h-2 overflow-hidden rounded-full bg-surface-3"
                        role="img"
                        aria-label={`${completed} completaron y ${started - completed} están en progreso de ${rows.length}`}
                      >
                        <span className="bg-accent" style={{ width: `${(completed / rows.length) * 100}%` }} />
                        <span className="bg-accent/35" style={{ width: `${((started - completed) / rows.length) * 100}%` }} />
                      </div>
                      <p className="text-footnote text-label-2 tabular">
                        {completed} completaron · {started - completed} en progreso · promedio {item?.average_percent ?? 0}%
                      </p>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          <section className="card overflow-hidden" aria-labelledby="estudiantes">
            <div className="flex flex-col gap-3 border-b border-separator p-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="estudiantes" className="text-headline">
                Estudiantes
              </h2>
              <div className="flex flex-wrap gap-2">
                <label className="relative">
                  <span className="sr-only">Buscar estudiante</span>
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-label-3" aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar"
                    className="h-9 w-52 rounded-full bg-surface-2 pr-3 pl-9 text-subhead placeholder:text-label-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </label>
                <label className="relative flex items-center">
                  <span className="sr-only">Ordenar por</span>
                  <ArrowDownUp className="pointer-events-none absolute left-3 size-4 text-label-2" aria-hidden />
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as Sort)}
                    className="h-9 appearance-none rounded-full bg-surface-2 pr-4 pl-9 text-subhead focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="progress">Mayor avance</option>
                    <option value="name">Nombre</option>
                    <option value="access">Actividad reciente</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-left text-subhead">
                <thead className="bg-surface-2 text-footnote text-label-2">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-semibold">
                      Estudiante
                    </th>
                    {ovas.map((ova) => (
                      <th key={ova.id} scope="col" className="px-3 py-2.5 font-semibold">
                        {shortTitle(ova.title)}
                      </th>
                    ))}
                    <th scope="col" className="px-3 py-2.5 font-semibold">
                      Promedio
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-semibold">
                      Último acceso
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator">
                  {visible.map((row) => (
                    <tr key={row.student.id}>
                      <th scope="row" className="px-4 py-3 font-normal">
                        <span className="flex items-center gap-3">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-caption font-semibold text-label-2">
                            {initials(row.student.full_name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{row.student.full_name}</span>
                            <span className="block truncate text-footnote text-label-2">{row.student.email}</span>
                          </span>
                        </span>
                      </th>
                      {ovas.map((ova) => (
                        <td key={ova.id} className="px-3 py-3">
                          <Cell percent={row.byOva.get(ova.id)?.percent_complete} />
                        </td>
                      ))}
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 font-semibold tabular',
                            row.average < AT_RISK && 'text-warning',
                          )}
                        >
                          {row.average < AT_RISK && <AlertTriangle className="size-4" aria-label="Avance bajo" />}
                          {row.average}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-label-2">{relative(row.lastAccess)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: 'warning' }) {
  return (
    <div className="card p-5">
      <dt className="text-footnote text-label-2">{label}</dt>
      <dd className={cn('mt-1 text-title-1 font-semibold tabular', tone === 'warning' && 'text-warning')}>{value}</dd>
    </div>
  )
}

function Cell({ percent }: { percent?: number }) {
  if (percent === undefined) return <span className="text-footnote text-label-3">—</span>
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-3" aria-hidden>
        <span
          className={cn('block h-full rounded-full', percent >= 100 ? 'bg-success' : 'bg-accent')}
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="text-footnote tabular">{percent}%</span>
    </span>
  )
}
