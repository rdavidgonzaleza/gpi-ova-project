import { CalendarRange, CircleDollarSign, GitPullRequestArrow, Layers, PackageCheck, Rocket, ShieldAlert, UsersRound, type LucideIcon } from 'lucide-react'

// Icon per knowledge area, matched by title so OVAs created later get a
// sensible icon too.
const TOPICS: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /alcance|edt|wbs/i, icon: Layers },
  { match: /cronograma|tiempo|ruta cr[ií]tica/i, icon: CalendarRange },
  { match: /costo|presupuesto|valor ganado/i, icon: CircleDollarSign },
  { match: /riesgo/i, icon: ShieldAlert },
  { match: /inicio|planificaci[oó]n|acta/i, icon: Rocket },
  { match: /ejecuci[oó]n|equipo/i, icon: UsersRound },
  { match: /cambio|control/i, icon: GitPullRequestArrow },
  { match: /cierre/i, icon: PackageCheck },
]

export function topicIcon(title: string): LucideIcon {
  return TOPICS.find((topic) => topic.match.test(title))?.icon ?? Layers
}
