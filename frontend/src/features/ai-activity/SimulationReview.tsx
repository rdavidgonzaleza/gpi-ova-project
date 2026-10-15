import { FeedbackList } from './RubricReview'
import type { AIResult } from './useAIRun'

export interface SimulationReviewData {
  valoracion: string
  observaciones: string[]
  principio_clave: string
}

export function SimulationReview({ result }: { result: AIResult<SimulationReviewData> }) {
  const data = result.data
  if (!data?.valoracion) return <p className="whitespace-pre-line text-subhead text-label">{result.raw}</p>
  return (
    <div className="space-y-4">
      <p className="text-subhead text-label">{data.valoracion}</p>
      <FeedbackList title="Observaciones" items={data.observaciones} />
      {data.principio_clave && (
        <p className="rounded-control bg-surface px-4 py-3 text-subhead">
          <strong className="font-semibold">Para recordar: </strong>
          {data.principio_clave}
        </p>
      )}
    </div>
  )
}
