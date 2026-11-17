import { useQuery } from '@tanstack/react-query'
import { contentApi } from '../../api/content'
import { trackingApi } from '../../api/tracking'
import type { OVA, Progress } from '../../types/domain'
import { useAuth } from '../auth/useAuth'

export function useCatalog() {
  const { user } = useAuth()
  const canSeeDrafts = user?.role === 'docente' || user?.role === 'administrador'

  const ovas = useQuery({
    queryKey: ['ovas'],
    queryFn: contentApi.list,
    select: (rows: OVA[]) =>
      rows
        .filter((ova) => canSeeDrafts || ova.status === 'publicado')
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
  })

  const progress = useQuery({
    queryKey: ['progress', user?.id],
    queryFn: () => trackingApi.progress(user!.id),
    enabled: user?.role === 'estudiante',
    select: (rows: Progress[]) => new Map(rows.map((row) => [row.ova_id, row])),
  })

  return { ovas, progress: progress.data }
}
