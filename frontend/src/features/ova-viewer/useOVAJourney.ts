import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activitiesApi } from '../../api/activities'
import { contentApi } from '../../api/content'
import { evaluationsApi } from '../../api/evaluations'
import { trackingApi } from '../../api/tracking'
import { usePersistentState } from '../../lib/usePersistentState'
import type { QuizConfig } from '../../types/activities'
import type { Activity, ContentBlock, Evaluation, OVA, Progress, UUID } from '../../types/domain'
import { useAuth } from '../auth/useAuth'

export type Step =
  | { kind: 'block'; id: UUID; title: string; block: ContentBlock }
  | { kind: 'activity'; id: UUID; title: string; activity: Activity }
  | { kind: 'evaluation'; id: UUID; title: string; activity: Activity<QuizConfig>; evaluation: Evaluation | undefined }
  | { kind: 'recap'; id: 'repaso'; title: string }

/** What each finished step contributes to the final AI recap. */
export type StepResult = Record<string, unknown>

interface JourneyState {
  completed: UUID[]
  results: Record<string, StepResult>
}

function blockTitle(block: ContentBlock): string {
  if (block.type === 'imagen') return 'Diagrama'
  if (block.type === 'video') return 'Video'
  const heading = block.content.match(/^#{1,3}\s+(.+)$/m)
  return heading?.[1]?.trim() ?? 'Lectura'
}

function buildSteps(ova: OVA, activities: Activity[], evaluations: Evaluation[]): Step[] {
  const positioned: Array<{ position: number; step: Step }> = []
  for (const block of ova.blocks ?? []) {
    positioned.push({ position: block.position, step: { kind: 'block', id: block.id, title: blockTitle(block), block } })
  }
  for (const activity of activities) {
    const config = activity.config as { position?: number; evaluation_id?: UUID }
    const position = config.position ?? 999
    if (config.evaluation_id) {
      const evaluation = evaluations.find((item) => item.id === config.evaluation_id)
      positioned.push({
        position,
        step: { kind: 'evaluation', id: activity.id, title: activity.title, activity: activity as unknown as Activity<QuizConfig>, evaluation },
      })
    } else {
      positioned.push({ position, step: { kind: 'activity', id: activity.id, title: activity.title, activity } })
    }
  }
  const steps = positioned.sort((a, b) => a.position - b.position).map((item) => item.step)
  if (steps.length > 0) steps.push({ kind: 'recap', id: 'repaso', title: 'Tu repaso personalizado' })
  return steps
}

export function useOVAJourney(ovaId: UUID) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isStudent = user?.role === 'estudiante'

  const ova = useQuery({ queryKey: ['ova', ovaId], queryFn: () => contentApi.get(ovaId) })
  const activities = useQuery({ queryKey: ['activities', ovaId], queryFn: () => activitiesApi.listByOva(ovaId) })
  const evaluations = useQuery({ queryKey: ['evaluations', ovaId], queryFn: () => evaluationsApi.listByOva(ovaId) })

  const steps = useMemo(
    () => (ova.data && activities.data ? buildSteps(ova.data, activities.data, evaluations.data ?? []) : []),
    [ova.data, activities.data, evaluations.data],
  )

  const [state, setState] = usePersistentState<JourneyState>(`journey.${user?.id ?? 'anon'}.${ovaId}`, {
    completed: [],
    results: {},
  })

  const saveProgress = useMutation({
    mutationFn: trackingApi.upsert,
    onSuccess: (row) =>
      queryClient.setQueryData<Progress[]>(['progress', user?.id], (rows) => [
        ...(rows ?? []).filter((item) => item.ova_id !== row.ova_id),
        row,
      ]),
  })

  const completedSet = useMemo(() => new Set(state.completed), [state.completed])
  const countable = steps.filter((step) => step.kind !== 'recap')
  const done = countable.filter((step) => completedSet.has(step.id)).length
  const percent = countable.length ? Math.round((done / countable.length) * 100) : 0

  // Persist progress whenever the completed count changes (spec 5.6: the
  // frontend calls PUT /api/progress as the learner advances).
  const lastSaved = useRef<number | null>(null)
  useEffect(() => {
    if (!isStudent || !user || countable.length === 0 || lastSaved.current === percent) return
    // Merely viewing the overview does not count as starting (see markStarted).
    if (lastSaved.current === null && percent === 0) return
    lastSaved.current = percent
    saveProgress.mutate({
      student_id: user.id,
      ova_id: ovaId,
      status: percent >= 100 ? 'completado' : 'en_progreso',
      percent_complete: percent,
    })
  }, [percent, isStudent, user, ovaId, countable.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const complete = useCallback(
    (stepId: UUID, result?: StepResult) =>
      setState((previous) => ({
        completed: previous.completed.includes(stepId) ? previous.completed : [...previous.completed, stepId],
        results: result ? { ...previous.results, [stepId]: result } : previous.results,
      })),
    [setState],
  )

  /** Registers "en_progreso" the first time the learner opens the OVA. */
  const markStarted = useCallback(() => {
    if (!isStudent || !user || state.completed.length > 0 || lastSaved.current !== null) return
    lastSaved.current = 0
    saveProgress.mutate({ student_id: user.id, ova_id: ovaId, status: 'en_progreso', percent_complete: 0 })
  }, [isStudent, user, ovaId, state.completed.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ova,
    activities,
    steps,
    isLoading: ova.isPending || activities.isPending,
    error: ova.error ?? activities.error,
    completed: completedSet,
    results: state.results,
    percent,
    complete,
    markStarted,
  }
}

export type Journey = ReturnType<typeof useOVAJourney>
