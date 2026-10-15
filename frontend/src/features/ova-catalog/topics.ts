import { CalendarRange, CircleDollarSign, Layers, ShieldAlert, type LucideIcon } from 'lucide-react'

// Icon per knowledge area, matched by title so OVAs created later get a
// sensible icon too.
const TOPICS: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /alcance|edt|wbs/i, icon: Layers },
  { match: /cronograma|tiempo|ruta cr[ií]tica/i, icon: CalendarRange },
  { match: /costo|presupuesto|valor ganado/i, icon: CircleDollarSign },
  { match: /riesgo/i, icon: ShieldAlert },
]

export function topicIcon(title: string): LucideIcon {
  return TOPICS.find((topic) => topic.match.test(title))?.icon ?? Layers
}
