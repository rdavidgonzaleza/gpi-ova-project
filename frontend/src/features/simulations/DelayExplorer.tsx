import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '../../components/Button'
import { schedule, type NetworkActivity } from './cpm'
import { GanttChart } from './GanttChart'

interface Props {
  network: NetworkActivity[]
  unit: string
}

/** Lets the learner delay any activity and watch the end date and critical path move. */
export function DelayExplorer({ network, unit }: Props) {
  const [activityId, setActivityId] = useState(network[0].id)
  const [delays, setDelays] = useState<Record<string, number>>({})
  const baseline = schedule(network)
  const current = schedule(network, delays)
  const shift = current.duration - baseline.duration
  const amount = delays[activityId] ?? 0
  const selected = baseline.activities.find((a) => a.id === activityId)!

  return (
    <section className="card space-y-4 p-4 sm:p-5" aria-labelledby="explorar-retrasos">
      <div>
        <h4 id="explorar-retrasos" className="text-headline">
          Cronograma de la línea base y retrasos
        </h4>
        <p className="mt-1 text-subhead text-label-2">Este es el cronograma resultante. Elige una actividad, súmale semanas y observa cómo cambian la fecha final y la ruta crítica.</p>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="space-y-1.5">
          <span className="block text-footnote font-medium text-label-2">Actividad</span>
          <select
            value={activityId}
            onChange={(event) => setActivityId(event.target.value)}
            className="h-11 rounded-control border border-separator-strong bg-surface px-3 text-subhead focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {baseline.activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} · {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-48 flex-1 space-y-1.5">
          <span className="block text-footnote font-medium text-label-2 tabular">
            Retraso: {amount} {unit} · holgura original {selected.slack}
          </span>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={amount}
            onChange={(event) => setDelays((previous) => ({ ...previous, [activityId]: Number(event.target.value) }))}
            className="h-11 w-full accent-(--accent)"
          />
        </label>
        <Button variant="secondary" size="sm" onClick={() => setDelays({})} icon={<RotateCcw className="size-4" aria-hidden />}>
          Quitar retrasos
        </Button>
      </div>
      <p className="text-subhead" role="status">
        El proyecto dura <strong className="tabular">{current.duration} {unit}</strong>
        {shift > 0 ? ` (${shift} más que la línea base).` : ' (sin cambios en la fecha final).'} Ruta crítica:{' '}
        <strong>{current.criticalPath.join(' → ')}</strong>
      </p>
      <GanttChart schedule={current} unit={unit} span={baseline.duration + 4} delayed={delays} />
    </section>
  )
}
