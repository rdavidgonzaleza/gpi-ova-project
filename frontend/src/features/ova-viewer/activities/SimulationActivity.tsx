import type { ComponentType } from 'react'
import type { SimulationConfig, SimulationKind } from '../../../types/activities'
import { EDTSimulation } from '../../simulations/EDTSimulation'
import { ActivityShell, type ActivityProps } from '../ActivityShell'

type SimulationComponent = ComponentType<{
  activityId: string
  config: SimulationConfig
  onComplete: (result: Record<string, unknown>) => void
}>

const SIMULATIONS: Partial<Record<SimulationKind, SimulationComponent>> = {
  edt: EDTSimulation,
}

export function SimulationActivity({ id, title, description, config, done, onComplete }: ActivityProps<SimulationConfig>) {
  const Simulation = SIMULATIONS[config.kind]
  return (
    <ActivityShell
      kind="simulacion"
      title={title}
      description={description}
      instructions={config.instructions}
      usesAI={Boolean(config.review_ai_activity_id)}
      done={done}
    >
      {Simulation && <Simulation activityId={id} config={config} onComplete={onComplete} />}
    </ActivityShell>
  )
}
