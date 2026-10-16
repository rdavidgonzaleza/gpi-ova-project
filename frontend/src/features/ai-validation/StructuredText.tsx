import { parseAIJson } from '../ai-activity/useAIRun'

const LABELS: Record<string, string> = {
  criterios: 'Criterios',
  fortalezas: 'Fortalezas',
  mejoras: 'Mejoras',
  pregunta_reflexion: 'Pregunta de reflexión',
  explicaciones: 'Explicaciones',
  siguiente_paso: 'Siguiente paso',
  resumen: 'Resumen',
  a_reforzar: 'Para reforzar',
  sintesis: 'Síntesis',
  acuerdos: 'Acuerdos',
  tensiones: 'Tensiones',
  decision_sugerida: 'Decisión sugerida',
  sobre_tu_aporte: 'Sobre el aporte',
  valoracion: 'Valoración',
  observaciones: 'Observaciones',
  principio_clave: 'Principio clave',
  preguntas: 'Preguntas',
  escenario: 'Escenario',
  titulo: 'Título',
}

const label = (key: string) => LABELS[key] ?? key.replaceAll('_', ' ').replace(/^\w/, (c) => c.toUpperCase())

/** Readable view of a JSON payload (AI output or structured learner input). */
export function StructuredText({ text }: { text: string }) {
  const data = text.trim().startsWith('{') || text.trim().startsWith('```') ? parseAIJson<unknown>(text) : null
  if (data === null) return <p className="text-subhead whitespace-pre-line text-label">{text}</p>
  return <Value value={data} />
}

function Value({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <span className="text-label-3">—</span>
  if (typeof value !== 'object') return <span className="whitespace-pre-line">{String(value)}</span>
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc space-y-1 pl-5 marker:text-label-3">
        {value.map((item, index) => (
          <li key={index}>
            <Value value={item} />
          </li>
        ))}
      </ul>
    )
  }
  return (
    <dl className="space-y-2">
      {Object.entries(value)
        .filter(([key]) => key !== 'id')
        .map(([key, item]) => (
        <div key={key}>
          <dt className="text-footnote font-semibold text-label-2">{label(key)}</dt>
          <dd className="text-subhead text-label">
            <Value value={item} />
          </dd>
        </div>
      ))}
    </dl>
  )
}
