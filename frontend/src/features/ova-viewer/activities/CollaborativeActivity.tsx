import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { activitiesApi } from '../../../api/activities'
import { Button } from '../../../components/Button'
import { TextArea } from '../../../components/TextArea'
import { initials } from '../../../lib/roles'
import { usePersistentState } from '../../../lib/usePersistentState'
import type { CollaborativeConfig, TeamContribution } from '../../../types/activities'
import { AIPanel, AISignInPrompt } from '../../ai-activity/AIPanel'
import { FeedbackList } from '../../ai-activity/RubricReview'
import { useAIRun } from '../../ai-activity/useAIRun'
import { useAuth } from '../../auth/useAuth'
import { ActivityShell, type ActivityProps } from '../ActivityShell'

interface Synthesis {
  sintesis: string
  acuerdos: string[]
  tensiones: string[]
  decision_sugerida: string
  sobre_tu_aporte: string
}

export function CollaborativeActivity({ id, title, description, config, done, onComplete }: ActivityProps<CollaborativeConfig>) {
  const { user } = useAuth()
  const scope = `${user?.id}.${id}`
  const [posted, setPosted] = usePersistentState<string | null>(`colab.${scope}`, null)
  const [draft, setDraft] = useState('')
  const synthesis = useAIRun<Synthesis>(config.synthesis_ai_activity_id, `${scope}.synthesis`, { json: true })

  function post() {
    const text = draft.trim()
    setPosted(text)
    setDraft('')
    onComplete({ tipo: 'colaborativa', aporte_publicado: true })
    if (user?.role === 'estudiante') activitiesApi.registerAttempt(id, user.id, { aporte: text }).catch(() => undefined)
  }

  function synthesize() {
    synthesis.run({
      situacion: config.prompt,
      posturas: config.contributions.map(({ author, role, text }) => ({ integrante: author, rol: role, postura: text })),
      aporte_del_estudiante: { rol: config.role, postura: posted },
    })
  }

  return (
    <ActivityShell
      kind="colaborativa"
      title={title}
      description={description}
      usesAI={Boolean(config.synthesis_ai_activity_id)}
      done={done}
    >
      <p className="card px-5 py-4 text-body sm:px-6">{config.prompt}</p>

      <ul className="space-y-3" aria-label="Posturas del equipo">
        {config.contributions.map((contribution) => (
          <Contribution key={contribution.author} contribution={contribution} />
        ))}
        {posted && user && (
          <Contribution contribution={{ author: `${user.full_name} (tú)`, role: config.role, text: posted }} own />
        )}
      </ul>

      {!posted ? (
        user ? (
          <div className="space-y-3">
            <TextArea
              label={`Tu postura como ${config.role}`}
              placeholder="Escribe qué propones y por qué, considerando lo que dijo el resto del equipo."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={4}
            />
            <Button onClick={post} disabled={draft.trim().length < 40}>
              Publicar mi postura
            </Button>
          </div>
        ) : (
          <AISignInPrompt action="participar en la discusión del equipo" />
        )
      ) : (
        config.synthesis_ai_activity_id &&
        !synthesis.result &&
        !synthesis.pending && (
          <Button variant="ai" onClick={synthesize} icon={<Sparkles className="size-4" aria-hidden />}>
            Generar síntesis de la reunión
          </Button>
        )
      )}

      {(synthesis.pending || synthesis.error || synthesis.result) && (
        <AIPanel
          title="Síntesis de la reunión"
          pendingLabel="Leyendo las posturas del equipo y redactando la síntesis…"
          pending={synthesis.pending}
          error={synthesis.error}
          onRetry={synthesize}
        >
          {synthesis.result &&
            (synthesis.result.data ? (
              <div className="space-y-5">
                <p className="text-subhead text-label">{synthesis.result.data.sintesis}</p>
                <FeedbackList title="Acuerdos" items={synthesis.result.data.acuerdos} />
                <FeedbackList title="Tensiones" items={synthesis.result.data.tensiones} />
                <p className="rounded-control bg-surface px-4 py-3 text-subhead">
                  <strong className="font-semibold">Decisión sugerida: </strong>
                  {synthesis.result.data.decision_sugerida}
                </p>
                <p className="text-subhead text-label">
                  <strong className="font-semibold">Sobre tu aporte: </strong>
                  {synthesis.result.data.sobre_tu_aporte}
                </p>
              </div>
            ) : (
              <p className="whitespace-pre-line text-subhead">{synthesis.result.raw}</p>
            ))}
        </AIPanel>
      )}
    </ActivityShell>
  )
}

function Contribution({ contribution, own }: { contribution: TeamContribution; own?: boolean }) {
  return (
    <li className={own ? 'card animate-rise flex gap-3 p-4 ring-2 ring-accent/40 sm:p-5' : 'card flex gap-3 p-4 sm:p-5'}>
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-footnote font-semibold text-label-2"
      >
        {initials(contribution.author)}
      </span>
      <div className="min-w-0">
        <p className="text-subhead">
          <span className="font-semibold">{contribution.author}</span>
          <span className="text-label-2"> · {contribution.role}</span>
        </p>
        <p className="mt-1 text-subhead text-label">{contribution.text}</p>
      </div>
    </li>
  )
}
