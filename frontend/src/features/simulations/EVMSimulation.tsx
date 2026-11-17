import { RotateCcw } from 'lucide-react'
import { activitiesApi } from '../../api/activities'
import { Button } from '../../components/Button'
import { Segmented } from '../../components/Segmented'
import { usePersistentState } from '../../lib/usePersistentState'
import type { SimulationConfig } from '../../types/activities'
import type { SimulationReviewData } from '../ai-activity/SimulationReview'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import { EVMExplorer } from './EVMExplorer'
import { fmt, indicators, type EVMIndicators } from './evm'
import { NumberField, parseNumber } from './NumberField'
import { SCurveChart } from './SCurveChart'
import { SimulationAIReview } from './SimulationAIReview'

interface EVMParams {
  currency: string
  bac: number
  week: number
  total_weeks: number
  pv: number[]
  ev: number[]
  ac: number[]
}

type Field = 'cv' | 'sv' | 'cpi' | 'spi' | 'eac'
type Answers = Record<Field | 'diagnosis', string>

const EMPTY: Answers = { cv: '', sv: '', cpi: '', spi: '', eac: '', diagnosis: '' }

const FIELDS: Array<{ key: Field; label: string; formula: string; index?: boolean; tolerance: number }> = [
  { key: 'cv', label: 'CV, variación del costo', formula: 'EV − AC', tolerance: 0.5 },
  { key: 'sv', label: 'SV, variación del cronograma', formula: 'EV − PV', tolerance: 0.5 },
  { key: 'cpi', label: 'CPI', formula: 'EV / AC', index: true, tolerance: 0.011 },
  { key: 'spi', label: 'SPI', formula: 'EV / PV', index: true, tolerance: 0.011 },
  { key: 'eac', label: 'EAC, costo final estimado', formula: 'BAC / CPI', tolerance: 3 },
]

const DIAGNOSES = [
  { value: 'sobre_atrasado', label: 'Sobrecosto y atrasado' },
  { value: 'sobre_adelantado', label: 'Sobrecosto y adelantado' },
  { value: 'ahorro_atrasado', label: 'Ahorro y atrasado' },
  { value: 'ahorro_adelantado', label: 'Ahorro y adelantado' },
]

function diagnose(k: EVMIndicators) {
  return `${k.cpi < 1 ? 'sobre' : 'ahorro'}_${k.spi < 1 ? 'atrasado' : 'adelantado'}`
}

interface Props {
  activityId: string
  config: SimulationConfig
  onComplete: (result: Record<string, unknown>) => void
}

export function EVMSimulation({ activityId, config, onComplete }: Props) {
  const p = config.params as unknown as EVMParams
  const { user } = useAuth()
  const scope = `${user?.id}.${activityId}`
  const [answers, setAnswers] = usePersistentState<Answers>(`evm.${scope}`, EMPTY)
  const [checked, setChecked] = usePersistentState<boolean>(`evm.${scope}.checked`, false)
  const review = useAIRun<SimulationReviewData>(config.review_ai_activity_id, `${scope}.review`, { json: true })

  const [pv, ev, ac] = [p.pv[p.week], p.ev[p.week], p.ac[p.week]]
  const k = indicators(p.bac, pv, ev, ac)
  const results = Object.fromEntries(
    FIELDS.map((f) => {
      const value = parseNumber(answers[f.key])
      return [f.key, value !== null && Math.abs(value - k[f.key]) <= f.tolerance]
    }),
  ) as Record<Field, boolean>
  const diagnosisOk = answers.diagnosis === diagnose(k)
  const correct = Object.values(results).filter(Boolean).length + (diagnosisOk ? 1 : 0)
  const total = FIELDS.length + 1
  const complete = Object.values(answers).every((value) => value.trim())
  const expected = (f: (typeof FIELDS)[number]) => `${f.formula} = ${fmt(k[f.key], f.index ? 2 : 0)}`

  function check() {
    setChecked(true)
    onComplete({ tipo: 'simulacion_valor_ganado', aciertos: correct, total })
    if (user?.role === 'estudiante') activitiesApi.registerAttempt(activityId, user.id, answers).catch(() => undefined)
  }

  function reset() {
    setAnswers(EMPTY)
    setChecked(false)
    review.clear()
  }

  function requestReview() {
    review.run({
      corte: { semana: p.week, de: p.total_weeks, unidad: `${p.currency} de pesos`, BAC: p.bac, PV: pv, EV: ev, AC: ac },
      respuestas_del_estudiante: { ...answers, diagnostico: DIAGNOSES.find((d) => d.value === answers.diagnosis)?.label },
      valores_correctos: {
        CV: k.cv,
        SV: k.sv,
        CPI: Number(k.cpi.toFixed(2)),
        SPI: Number(k.spi.toFixed(2)),
        EAC: Math.round(k.eac),
        VAC: Math.round(k.vac),
        diagnostico: DIAGNOSES.find((d) => d.value === diagnose(k))?.label,
      },
      errores_detectados: [...FIELDS.filter((f) => !results[f.key]).map((f) => f.label), ...(diagnosisOk ? [] : ['diagnóstico'])],
    })
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-4 p-4 sm:p-5" aria-labelledby="informe-corte">
        <h4 id="informe-corte" className="text-headline">
          Informe de corte · semana {p.week} de {p.total_weeks}
        </h4>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['BAC · presupuesto', p.bac],
            ['PV · planificado', pv],
            ['EV · valor ganado', ev],
            ['AC · costo real', ac],
          ].map(([label, value]) => (
            <div key={label} className="rounded-control bg-surface-2 px-3 py-2">
              <dt className="text-caption font-semibold text-label-2">{label}</dt>
              <dd className="text-title-3 font-semibold tabular">
                ${value} <span className="text-footnote font-normal text-label-2">{p.currency}</span>
              </dd>
            </div>
          ))}
        </dl>
        <SCurveChart pv={p.pv} ev={p.ev} ac={p.ac} week={p.week} currency={p.currency} />
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            hint={f.index ? 'Con dos decimales, por ejemplo 0,95' : `En ${p.currency}; usa el signo menos si es negativa`}
            suffix={f.index ? undefined : p.currency}
            value={answers[f.key]}
            onChange={(value) => setAnswers((previous) => ({ ...previous, [f.key]: value }))}
            disabled={checked}
            result={checked ? { ok: results[f.key], expected: expected(f) } : undefined}
          />
        ))}
      </div>

      <Segmented
        legend="¿Cuál es el diagnóstico del proyecto?"
        options={DIAGNOSES}
        value={answers.diagnosis}
        onChange={(diagnosis) => setAnswers((previous) => ({ ...previous, diagnosis }))}
        disabled={checked}
        result={checked ? { ok: diagnosisOk, expected: DIAGNOSES.find((d) => d.value === diagnose(k))!.label } : undefined}
      />

      <div className="flex flex-wrap items-center gap-3">
        {checked ? (
          <>
            <p className="text-headline" role="status">
              {correct} de {total} respuestas correctas · VAC = {fmt(k.vac)} {p.currency}
            </p>
            <Button variant="secondary" onClick={reset} icon={<RotateCcw className="size-4" aria-hidden />}>
              Intentar de nuevo
            </Button>
          </>
        ) : (
          <Button onClick={check} disabled={!complete}>
            Comprobar
          </Button>
        )}
      </div>

      {checked && (
        <>
          <EVMExplorer bac={p.bac} pv={pv} ev={ev} ac={ac} currency={p.currency} />
          {user && config.review_ai_activity_id && (
            <SimulationAIReview
              review={review}
              onRequest={requestReview}
              buttonLabel="Analizar mi informe con IA"
              title="Análisis de tu informe de valor ganado"
              pendingLabel="Revisando tus cálculos de CPI, SPI y EAC y tu diagnóstico…"
            />
          )}
        </>
      )}
    </div>
  )
}
