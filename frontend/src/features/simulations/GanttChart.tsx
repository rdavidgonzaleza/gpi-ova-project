import { Fragment, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { Schedule } from './cpm'

interface Props {
  schedule: Schedule
  unit: string
  /** Fixed axis length so the chart does not jump while exploring delays. */
  span?: number
  /** Activities that carry a simulated delay. */
  delayed?: Record<string, number>
}

/** Gantt of a CPM schedule: critical bars filled, float shown as a dashed tail. */
export function GanttChart({ schedule, unit, span, delayed = {} }: Props) {
  const total = Math.max(span ?? 0, schedule.duration)
  const pct = (value: number) => `${(value / total) * 100}%`
  const ticks = Array.from({ length: total + 1 }, (_, week) => week).filter((week) => week % 2 === 0)

  return (
    <figure className="space-y-3">
      <div className="overflow-x-auto">
        <div className="min-w-[40rem]">
          <div className="grid grid-cols-[14rem_1fr] gap-x-3">
            <span />
            <div className="relative mb-1 h-5 text-caption text-label-2 tabular" aria-hidden>
              {ticks.map((week) => (
                <span key={week} className={cn('absolute', week === total ? '-translate-x-full' : week ? '-translate-x-1/2' : '')} style={{ left: pct(week) }}>
                  {week}
                </span>
              ))}
            </div>
            {schedule.activities.map((activity) => (
              <Fragment key={activity.id}>
                <span className="truncate py-1.5 text-footnote">
                  <span className="font-semibold">{activity.id}</span> · {activity.name}
                </span>
                <div className="relative h-8 border-l border-separator">
                  {ticks.map((week) => (
                    <span key={week} className="absolute inset-y-0 border-l border-separator/60" style={{ left: pct(week) }} aria-hidden />
                  ))}
                  <span
                    role="img"
                    aria-label={`${activity.name}: semanas ${activity.es} a ${activity.ef}, holgura ${activity.slack}${activity.critical ? ', ruta crítica' : ''}`}
                    title={`${activity.name}\nInicio ${activity.es} · Fin ${activity.ef} · Holgura ${activity.slack} ${unit}`}
                    className={cn(
                      'absolute top-1.5 flex h-5 items-center rounded-[4px] px-1.5 text-caption font-semibold',
                      activity.critical ? 'bg-accent text-on-accent' : 'border border-separator-strong bg-surface-3 text-label',
                      delayed[activity.id] && 'ring-2 ring-warning ring-offset-1 ring-offset-surface',
                    )}
                    style={{ left: pct(activity.es), width: `calc(${pct(activity.duration)} - 2px)` }}
                  >
                    {activity.duration}
                  </span>
                  {activity.slack > 0 && (
                    <span
                      aria-hidden
                      className="absolute top-1.5 h-5 rounded-r-[4px] border border-dashed border-label-3"
                      style={{ left: pct(activity.ef), width: pct(activity.slack) }}
                    />
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 text-footnote text-label-2">
        <Legend swatch="bg-accent">Ruta crítica (holgura 0)</Legend>
        <Legend swatch="border border-separator-strong bg-surface-3">Con holgura</Legend>
        <Legend swatch="border border-dashed border-label-3">Holgura disponible</Legend>
        <span className="tabular">Eje en {unit}</span>
      </figcaption>
    </figure>
  )
}

function Legend({ swatch, children }: { swatch: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-3 w-5 rounded-[3px]', swatch)} aria-hidden />
      {children}
    </span>
  )
}
