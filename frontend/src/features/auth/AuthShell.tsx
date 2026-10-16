import type { ReactNode } from 'react'
import { MilestoneGlyph } from '../../components/BrandMark'

// A small project plan drawn as a Gantt chart: the visual world of the course.
const BARS = [
  { label: 'Alcance', start: 0, span: 28, done: true },
  { label: 'Cronograma', start: 22, span: 30, done: true },
  { label: 'Costos', start: 46, span: 26, done: false },
  { label: 'Riesgos', start: 8, span: 82, done: false },
]

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
      <section aria-hidden className="relative hidden overflow-hidden rounded-[2rem] bg-surface p-10 shadow-card lg:block">
        <p className="text-footnote font-semibold tracking-wide text-accent uppercase">Gestión de Proyectos Informáticos</p>
        <p className="mt-3 max-w-sm font-display text-title-1 font-semibold">
          Aprende a planear, medir y entregar proyectos de software.
        </p>
        <div className="mt-10 space-y-4">
          {BARS.map((bar) => (
            <div key={bar.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
              <span className="text-footnote text-label-2">{bar.label}</span>
              <div className="relative h-7 rounded-lg bg-surface-2">
                <div
                  className={bar.done ? 'absolute inset-y-1 rounded-md bg-accent' : 'absolute inset-y-1 rounded-md bg-accent-soft'}
                  style={{ left: `${bar.start}%`, width: `${bar.span}%` }}
                />
                <MilestoneGlyph
                  className={bar.done ? 'absolute top-1/2 size-3.5 -translate-y-1/2 text-accent' : 'absolute top-1/2 size-3.5 -translate-y-1/2 text-label-3'}
                  filled={bar.done}
                  style={{ left: `calc(${bar.start + bar.span}% + 6px)` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-[6.5rem_1fr] gap-3 text-caption text-label-3">
          <span />
          <div className="flex justify-between">
            <span>Sem 1</span>
            <span>Sem 4</span>
            <span>Sem 8</span>
            <span>Sem 12</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md">
        <h1 className="text-title-1 font-semibold">{title}</h1>
        <p className="mt-2 text-subhead text-label-2">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </section>
    </div>
  )
}
