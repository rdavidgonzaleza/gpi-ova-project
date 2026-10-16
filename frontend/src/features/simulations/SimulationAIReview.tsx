import { Sparkles } from 'lucide-react'
import { Button } from '../../components/Button'
import { AIPanel } from '../ai-activity/AIPanel'
import { SimulationReview, type SimulationReviewData } from '../ai-activity/SimulationReview'
import type { useAIRun } from '../ai-activity/useAIRun'

interface Props {
  review: ReturnType<typeof useAIRun<SimulationReviewData>>
  onRequest: () => void
  buttonLabel: string
  title: string
  pendingLabel: string
}

/** "Analyze with AI" action and its panel, shown once a simulation is checked. */
export function SimulationAIReview({ review, onRequest, buttonLabel, title, pendingLabel }: Props) {
  return (
    <>
      {!review.result && !review.pending && !review.error && (
        <Button variant="ai" onClick={onRequest} icon={<Sparkles className="size-4" aria-hidden />}>
          {buttonLabel}
        </Button>
      )}
      {(review.pending || review.error || review.result) && (
        <AIPanel title={title} pendingLabel={pendingLabel} pending={review.pending} error={review.error} onRetry={onRequest}>
          {review.result && <SimulationReview result={review.result} />}
        </AIPanel>
      )}
    </>
  )
}
