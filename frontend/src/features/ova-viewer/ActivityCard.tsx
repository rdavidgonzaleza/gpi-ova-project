import type { ActivityConfigByType } from '../../types/activities'
import type { Activity } from '../../types/domain'
import { CaseStudyActivity } from './activities/CaseStudyActivity'
import { CollaborativeActivity } from './activities/CollaborativeActivity'
import { QuizActivity } from './activities/QuizActivity'
import { SimulationActivity } from './activities/SimulationActivity'

interface ActivityCardProps {
  activity: Activity
  done: boolean
  onComplete: (result: Record<string, unknown>) => void
}

/** Renders an activity-service activity according to its type (spec 5.3). */
export function ActivityCard({ activity, done, onComplete }: ActivityCardProps) {
  const common = { id: activity.id, title: activity.title, description: activity.description, done, onComplete }
  switch (activity.type) {
    case 'quiz':
      return <QuizActivity {...common} config={activity.config as unknown as ActivityConfigByType['quiz']} />
    case 'caso_estudio':
      return <CaseStudyActivity {...common} config={activity.config as unknown as ActivityConfigByType['caso_estudio']} />
    case 'simulacion':
      return <SimulationActivity {...common} config={activity.config as unknown as ActivityConfigByType['simulacion']} />
    case 'colaborativa':
      return <CollaborativeActivity {...common} config={activity.config as unknown as ActivityConfigByType['colaborativa']} />
  }
}
