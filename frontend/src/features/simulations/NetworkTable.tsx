import type { NetworkActivity } from './cpm'

export function NetworkTable({ activities, unit }: { activities: NetworkActivity[]; unit: string }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-subhead">
        <caption className="sr-only">Actividades de RutaCaribe</caption>
        <thead className="bg-surface-2 text-footnote text-label-2">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-semibold">Actividad</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">Duración</th>
            <th scope="col" className="px-4 py-2.5 font-semibold">Predecesoras</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-separator">
          {activities.map((a) => (
            <tr key={a.id}>
              <th scope="row" className="px-4 py-2.5 font-normal">
                <span className="font-semibold">{a.id}</span> · {a.name}
              </th>
              <td className="px-3 py-2.5 tabular">{a.duration} {unit}</td>
              <td className="px-4 py-2.5 text-label-2">{a.predecessors.join(', ') || 'Ninguna'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
