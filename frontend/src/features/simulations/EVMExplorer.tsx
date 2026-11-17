import { useState } from 'react'
import { fmt, indicators } from './evm'

interface Props {
  bac: number
  pv: number
  ev: number
  ac: number
  currency: string
}

/** Sliders over EV and AC at the cut-off date, with the indicators recalculated live. */
export function EVMExplorer({ bac, pv, ev: initialEV, ac: initialAC, currency }: Props) {
  const [ev, setEV] = useState(initialEV)
  const [ac, setAC] = useState(initialAC)
  const k = indicators(bac, pv, ev, ac)
  const cost = k.cpi >= 1 ? 'dentro del presupuesto' : 'por encima del presupuesto'
  const time = k.spi >= 1 ? 'al día o adelantado' : 'atrasado'

  return (
    <section className="card space-y-4 p-4 sm:p-5" aria-labelledby="explorar-evm">
      <div>
        <h4 id="explorar-evm" className="text-headline">
          Explora: ¿y si el corte hubiera sido distinto?
        </h4>
        <p className="mt-1 text-subhead text-label-2">PV se mantiene en {pv} {currency}. Mueve el trabajo terminado y lo gastado.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label={`EV · trabajo terminado: ${ev} ${currency} (${fmt((ev / bac) * 100)} %)`} value={ev} max={bac / 2 + 60} onChange={setEV} />
        <Slider label={`AC · costo real: ${ac} ${currency}`} value={ac} max={bac / 2 + 100} onChange={setAC} />
      </div>
      <dl className="grid grid-cols-3 gap-3 sm:grid-cols-6" aria-live="polite">
        <Stat label="CV" value={fmt(k.cv)} />
        <Stat label="SV" value={fmt(k.sv)} />
        <Stat label="CPI" value={fmt(k.cpi, 2)} />
        <Stat label="SPI" value={fmt(k.spi, 2)} />
        <Stat label="EAC" value={fmt(k.eac)} />
        <Stat label="VAC" value={fmt(k.vac)} />
      </dl>
      <p className="text-subhead">
        Con estos datos el proyecto va <strong>{cost}</strong> y <strong>{time}</strong>.
      </p>
    </section>
  )
}

function Slider({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-footnote font-medium text-label-2 tabular">{label}</span>
      <input type="range" min={0} max={max} step={2} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-11 w-full accent-(--accent)" />
    </label>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-control bg-surface-2 px-3 py-2">
      <dt className="text-caption font-semibold text-label-2">{label}</dt>
      <dd className="text-headline tabular">{value}</dd>
    </div>
  )
}
