import { Check, X } from 'lucide-react'
import { Segmented } from '../../components/Segmented'
import { cn } from '../../lib/cn'
import { LEVELS, RESPONSES, capitalize, grade, zone, type Level, type Risk, type RiskAnswer } from './risk'

interface Props {
  index: number
  risk: Risk
  answer: RiskAnswer | undefined
  onChange: (answer: RiskAnswer) => void
  checked: boolean
}

const levelOptions = LEVELS.map((l) => ({ value: String(l.value), label: l.label }))

export function RiskCard({ index, risk, answer = {}, onChange, checked }: Props) {
  const result = checked ? grade(risk, answer) : null
  const expectedZone = zone(risk.probability, risk.impact)
  return (
    <li className={cn('card space-y-4 p-4 sm:p-5', result && (result.ok ? 'ring-1 ring-success' : 'ring-1 ring-danger'))}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid h-7 min-w-7 shrink-0 place-items-center rounded-full px-1.5 text-caption font-bold',
            risk.type === 'oportunidad' ? 'border-2 border-accent text-accent' : 'bg-label text-surface',
          )}
        >
          R{index + 1}
        </span>
        <div className="space-y-1">
          <p className="text-caption font-semibold text-label-2 uppercase">{risk.type}</p>
          <p className="text-subhead">{risk.text}</p>
        </div>
        {result && (
          <span className="ml-auto shrink-0">
            {result.ok ? <Check className="size-5 text-success" aria-label="Correcto" /> : <X className="size-5 text-danger" aria-label="Incorrecto" />}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Segmented
          size="sm"
          legend="Probabilidad"
          options={levelOptions}
          value={answer.p ? String(answer.p) : ''}
          onChange={(value) => onChange({ ...answer, p: Number(value) as Level })}
          disabled={checked}
        />
        <Segmented
          size="sm"
          legend="Impacto"
          options={levelOptions}
          value={answer.i ? String(answer.i) : ''}
          onChange={(value) => onChange({ ...answer, i: Number(value) as Level })}
          disabled={checked}
        />
        <Segmented
          size="sm"
          legend="Respuesta"
          options={RESPONSES[risk.type].map((r) => ({ value: r, label: capitalize(r) }))}
          value={answer.r ?? ''}
          onChange={(r) => onChange({ ...answer, r })}
          disabled={checked}
        />
      </div>
      {result && !result.ok && (
        <p className="rounded-control bg-surface-2 px-4 py-3 text-footnote text-label">
          {!result.zoneOk && <>Prioridad esperada: <strong>{expectedZone}</strong>. </>}
          {!result.responseOk && (
            <>
              Respuesta esperada: <strong>{risk.responses.map(capitalize).join(' o ')}</strong>.{' '}
            </>
          )}
          {risk.reason}
        </p>
      )}
    </li>
  )
}
