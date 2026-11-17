import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { LEVELS, zone, type Risk, type RiskAnswer } from './risk'

const ZONE_STYLE = {
  alta: 'bg-danger-soft',
  media: 'bg-warning-soft',
  baja: 'bg-success-soft',
}

interface Props {
  risks: Risk[]
  answers: Record<string, RiskAnswer>
}

/** 3×3 probability (rows) × impact (columns) matrix with the learner's placement. */
export function RiskMatrix({ risks, answers }: Props) {
  const label = (id: string) => `R${risks.findIndex((r) => r.id === id) + 1}`
  const rows = [...LEVELS].reverse()
  return (
    <figure className="space-y-2">
      <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] gap-1.5 text-footnote">
        {rows.map((p) => (
          <Row key={p.value} label={p.label}>
            {LEVELS.map((i) => {
              const z = zone(p.value, i.value)
              const here = risks.filter((r) => answers[r.id]?.p === p.value && answers[r.id]?.i === i.value)
              return (
                <div
                  key={i.value}
                  className={cn('min-h-20 rounded-xl p-2', ZONE_STYLE[z])}
                  aria-label={`Probabilidad ${p.label.toLowerCase()}, impacto ${i.label.toLowerCase()}: prioridad ${z}${here.length ? `, ${here.map((r) => label(r.id)).join(', ')}` : ''}`}
                  role="group"
                >
                  <span className="block text-caption font-semibold text-label-2 capitalize">{z}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {here.map((r) => (
                      <span
                        key={r.id}
                        title={r.text}
                        className={cn(
                          'grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-caption font-bold',
                          r.type === 'oportunidad' ? 'border-2 border-accent bg-surface text-accent' : 'bg-label text-surface',
                        )}
                      >
                        {label(r.id)}
                      </span>
                    ))}
                  </span>
                </div>
              )
            })}
          </Row>
        ))}
        <span />
        {LEVELS.map((i) => (
          <span key={i.value} className="text-center text-caption font-medium text-label-2">
            {i.label}
          </span>
        ))}
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 text-caption text-label-2">
        <span>Filas: probabilidad · Columnas: impacto</span>
        <span className="flex gap-3">
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-label" aria-hidden /> Amenaza
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-full border-2 border-accent" aria-hidden /> Oportunidad
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <span className="flex items-center pr-1 text-caption font-medium text-label-2 [writing-mode:vertical-rl] rotate-180 sm:rotate-0 sm:[writing-mode:horizontal-tb]">
        {label}
      </span>
      {children}
    </>
  )
}
