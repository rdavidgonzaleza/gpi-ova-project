// Critical path method (forward and backward pass) for finish-to-start networks.

export interface NetworkActivity {
  id: string
  name: string
  duration: number
  predecessors: string[]
}

export interface ScheduledActivity extends NetworkActivity {
  es: number
  ef: number
  ls: number
  lf: number
  slack: number
  critical: boolean
}

export interface Schedule {
  activities: ScheduledActivity[]
  duration: number
  criticalPath: string[]
}

/** Activities must be listed in topological order (predecessors first). */
export function schedule(network: NetworkActivity[], delays: Record<string, number> = {}): Schedule {
  const byId = new Map<string, ScheduledActivity>()
  for (const activity of network) {
    const duration = activity.duration + (delays[activity.id] ?? 0)
    const es = Math.max(0, ...activity.predecessors.map((id) => byId.get(id)!.ef))
    byId.set(activity.id, { ...activity, duration, es, ef: es + duration, ls: 0, lf: 0, slack: 0, critical: false })
  }
  const duration = Math.max(...[...byId.values()].map((a) => a.ef))
  for (const activity of [...byId.values()].reverse()) {
    const successors = network.filter((a) => a.predecessors.includes(activity.id))
    activity.lf = Math.min(duration, ...successors.map((s) => byId.get(s.id)!.ls))
    activity.ls = activity.lf - activity.duration
    activity.slack = activity.ls - activity.es
    activity.critical = activity.slack === 0
  }
  const activities = network.map((a) => byId.get(a.id)!)
  return { activities, duration, criticalPath: activities.filter((a) => a.critical).map((a) => a.id) }
}
