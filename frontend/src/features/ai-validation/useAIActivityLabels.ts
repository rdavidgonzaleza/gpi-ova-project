import { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { activitiesApi } from '../../api/activities'
import { contentApi } from '../../api/content'
import { SHARED_AI } from '../../content/ids'

const SHARED_LABELS: Record<string, string> = {
  [SHARED_AI.hints]: 'Pista graduada en quiz',
  [SHARED_AI.explainMistakes]: 'Explicación de errores de autoevaluación',
  [SHARED_AI.recap]: 'Repaso personalizado',
  [SHARED_AI.teamSynthesis]: 'Síntesis de trabajo en equipo',
  [SHARED_AI.questionDrafts]: 'Borradores de preguntas para docentes',
}

const FIELD_LABELS: Record<string, string> = {
  review_ai_activity_id: 'Retroalimentación',
  variant_ai_activity_id: 'Variante del caso',
  hints_ai_activity_id: 'Pistas',
  explain_ai_activity_id: 'Explicación de errores',
  synthesis_ai_activity_id: 'Síntesis',
}

/** Names each ai-service activity after the OVA activity that uses it. */
export function useAIActivityLabels() {
  const ovas = useQuery({ queryKey: ['ovas'], queryFn: contentApi.list })
  const activities = useQueries({
    queries: (ovas.data ?? []).map((ova) => ({
      queryKey: ['activities', ova.id],
      queryFn: () => activitiesApi.listByOva(ova.id),
    })),
  })

  return useMemo(() => {
    const labels = new Map<string, { title: string; ova?: string }>(
      Object.entries(SHARED_LABELS).map(([id, title]) => [id, { title }]),
    )
    activities.forEach((query, index) => {
      const ova = ovas.data?.[index]
      for (const activity of query.data ?? []) {
        for (const [field, value] of Object.entries(activity.config)) {
          if (typeof value === 'string' && field.endsWith('ai_activity_id') && !SHARED_LABELS[value]) {
            labels.set(value, { title: `${FIELD_LABELS[field] ?? 'IA'} · ${activity.title}`, ova: ova?.title })
          }
        }
      }
    })
    return labels
  }, [ovas.data, activities])
}
