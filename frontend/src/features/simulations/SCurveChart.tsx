import { useState } from 'react'

interface Props {
  pv: number[]
  ev: number[]
  ac: number[]
  /** Cut-off week (last index of ev/ac). */
  week: number
  currency: string
}

const W = 640
const H = 300
const PAD = { top: 16, right: 24, bottom: 32, left: 44 }

const SERIES = [
  { key: 'pv', name: 'PV · planificado', color: 'var(--label-2)', dash: '6 5' },
  { key: 'ev', name: 'EV · valor ganado', color: 'var(--series-1)' },
  { key: 'ac', name: 'AC · costo real', color: 'var(--series-2)' },
] as const

/** Cumulative cost curve (S-curve) with the cut-off line and a hover crosshair. */
export function SCurveChart({ pv, ev, ac, week, currency }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const data = { pv, ev, ac }
  const weeks = pv.length - 1
  const max = Math.ceil(Math.max(...pv, ...ac) / 100) * 100
  const x = (i: number) => PAD.left + (i / weeks) * (W - PAD.left - PAD.right)
  const y = (v: number) => H - PAD.bottom - (v / max) * (H - PAD.top - PAD.bottom)
  const path = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')

  // Direct labels at the cut-off, nudged apart so they never overlap.
  const labels = SERIES.map((s) => ({ ...s, value: data[s.key][week] }))
    .sort((a, b) => b.value - a.value)
    .reduce<Array<(typeof SERIES)[number] & { value: number; ly: number }>>((placed, s) => {
      const previous = placed.at(-1)
      const ly = previous ? Math.max(y(s.value), previous.ly + 15) : y(s.value)
      return [...placed, { ...s, ly }]
    }, [])

  const at = hover ?? week
  const tooltipX = Math.min(x(at) + 10, W - PAD.right - 130)

  return (
    <figure className="space-y-3">
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-footnote text-label-2" aria-label="Leyenda">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <svg width="20" height="8" aria-hidden>
              <line x1="0" y1="4" x2="20" y2="4" stroke={s.color} strokeWidth="2" strokeDasharray={'dash' in s ? s.dash : undefined} />
            </svg>
            {s.name}
          </li>
        ))}
      </ul>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        role="img"
        aria-label={`Curva S: a la semana ${week}, PV ${pv[week]}, EV ${ev[week]} y AC ${ac[week]} ${currency}`}
        onPointerMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect()
          const px = ((event.clientX - box.left) / box.width) * W
          const i = Math.round(((px - PAD.left) / (W - PAD.left - PAD.right)) * weeks)
          setHover(i >= 0 && i <= weeks ? i : null)
        }}
        onPointerLeave={() => setHover(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(max * t)} y2={y(max * t)} stroke="var(--separator)" />
            <text x={PAD.left - 8} y={y(max * t) + 4} textAnchor="end" fontSize="11" fill="var(--label-2)">
              {max * t}
            </text>
          </g>
        ))}
        {Array.from({ length: weeks / 2 + 1 }, (_, k) => k * 2).map((i) => (
          <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--label-2)">
            {i}
          </text>
        ))}
        <line x1={x(week)} x2={x(week)} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--label-3)" strokeDasharray="2 3" />
        <text x={x(week) + 4} y={PAD.top + 10} fontSize="11" fill="var(--label-2)">
          Corte · semana {week}
        </text>
        {SERIES.map((s) => (
          <path
            key={s.key}
            d={path(data[s.key])}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={'dash' in s ? s.dash : undefined}
          />
        ))}
        {labels.map((s) => (
          <g key={s.key}>
            <circle cx={x(week)} cy={y(s.value)} r="4.5" fill={s.color} stroke="var(--surface)" strokeWidth="2" />
            <text x={x(week) + 10} y={s.ly + 8} fontSize="12" fontWeight="600" fill="var(--label)" stroke="var(--surface)" strokeWidth="4" paintOrder="stroke">
              {s.key.toUpperCase()} {s.value}
            </text>
          </g>
        ))}
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(at)} x2={x(at)} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--label-3)" />
            <rect x={tooltipX} y={PAD.top + 18} width="124" height={at <= week ? 70 : 34} rx="8" fill="var(--surface)" stroke="var(--separator-strong)" />
            <text x={tooltipX + 10} y={PAD.top + 36} fontSize="11" fontWeight="600" fill="var(--label)">
              Semana {at}
            </text>
            {SERIES.filter((s) => data[s.key][at] !== undefined).map((s, row) => (
              <text key={s.key} x={tooltipX + 10} y={PAD.top + 52 + row * 15} fontSize="11" fill="var(--label-2)">
                {s.key.toUpperCase()}: {data[s.key][at]} {currency}
              </text>
            ))}
          </g>
        )}
      </svg>
      <details className="text-footnote text-label-2">
        <summary className="cursor-pointer font-medium text-accent">Ver los datos como tabla</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="text-left tabular">
            <thead>
              <tr>
                <th scope="col" className="pr-4 font-semibold">Semana</th>
                {SERIES.map((s) => (
                  <th key={s.key} scope="col" className="pr-4 font-semibold">{s.key.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pv.map((_, i) => (
                <tr key={i}>
                  <td className="pr-4">{i}</td>
                  {SERIES.map((s) => (
                    <td key={s.key} className="pr-4">{data[s.key][i] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
