import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Inbox, ShieldCheck, XCircle } from 'lucide-react'
import { aiApi } from '../../api/ai'
import { ApiError } from '../../api/client'
import { Button } from '../../components/Button'
import { ErrorView, Skeleton, StateView } from '../../components/StateView'
import { TextArea } from '../../components/TextArea'
import { cn } from '../../lib/cn'
import type { AIInteraction } from '../../types/domain'
import { StructuredText } from './StructuredText'
import { useAIActivityLabels } from './useAIActivityLabels'

type Tab = 'pendientes' | 'revisadas'

/** UC-10: human validation of AI interactions (RF-09, RF-10). */
export function ValidationPanel() {
  const [tab, setTab] = useState<Tab>('pendientes')
  const interactions = useQuery({ queryKey: ['ai-interactions'], queryFn: () => aiApi.listInteractions() })
  const labels = useAIActivityLabels()

  const all = interactions.data ?? []
  const pending = all.filter((item) => !item.validated && !item.validation_notes)
  const reviewed = all.filter((item) => item.validated || item.validation_notes)
  const list = tab === 'pendientes' ? pending : reviewed

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 pb-16 sm:px-6 md:pt-14">
      <header className="mb-8">
        <p className="text-subhead font-medium text-label-2">Validación humana</p>
        <h1 className="mt-1 text-title-1 font-bold tracking-tight sm:text-large-title">Respuestas de la IA</h1>
        <p className="mt-3 max-w-2xl text-body text-label-2">
          Revisa que cada respuesta sea correcta, pertinente y respetuosa. Las que rechaces quedan registradas con tus notas
          para ajustar las actividades.
        </p>
      </header>

      <div role="tablist" aria-label="Estado" className="mb-6 inline-flex rounded-full bg-surface-2 p-1">
        {(['pendientes', 'revisadas'] as const).map((value) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              'h-9 rounded-full px-4 text-subhead font-medium capitalize transition-colors',
              tab === value ? 'bg-surface text-label shadow-card' : 'text-label-2 hover:text-label',
            )}
          >
            {value} <span className="tabular text-label-3">{value === 'pendientes' ? pending.length : reviewed.length}</span>
          </button>
        ))}
      </div>

      {interactions.isPending ? (
        <div className="space-y-4" aria-busy>
          <Skeleton className="h-64 rounded-card" />
          <Skeleton className="h-64 rounded-card" />
        </div>
      ) : interactions.isError ? (
        <ErrorView error={interactions.error} onRetry={() => interactions.refetch()} />
      ) : list.length === 0 ? (
        <StateView
          icon={tab === 'pendientes' ? <ShieldCheck /> : <Inbox />}
          title={tab === 'pendientes' ? 'No hay respuestas por revisar' : 'Todavía no has revisado respuestas'}
          message={
            tab === 'pendientes'
              ? 'Cuando los estudiantes usen la IA, sus respuestas aparecerán aquí.'
              : 'Las respuestas que apruebes o rechaces aparecerán aquí.'
          }
        />
      ) : (
        <ul className="space-y-5">
          {list.map((interaction) => (
            <li key={interaction.id}>
              <InteractionCard interaction={interaction} label={labels.get(interaction.ai_activity_id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function InteractionCard({ interaction, label }: { interaction: AIInteraction; label?: { title: string; ova?: string } }) {
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState('')
  const reviewed = interaction.validated || Boolean(interaction.validation_notes)
  const validate = useMutation({
    mutationFn: (approved: boolean) => aiApi.validate(interaction.id, approved, notes),
    onSuccess: (updated) =>
      queryClient.setQueryData<AIInteraction[]>(['ai-interactions'], (rows) =>
        rows?.map((row) => (row.id === updated.id ? updated : row)),
      ),
  })

  return (
    <article className="card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-separator px-5 py-3">
        <div>
          <p className="text-subhead font-semibold">{label?.title ?? 'Actividad con IA'}</p>
          <p className="text-footnote text-label-2">
            {label?.ova && `${label.ova} · `}
            {new Date(interaction.created_at).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        {reviewed && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-footnote font-semibold',
              interaction.validated ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
            )}
          >
            {interaction.validated ? <CheckCircle2 className="size-4" aria-hidden /> : <XCircle className="size-4" aria-hidden />}
            {interaction.validated ? 'Aprobada' : 'Rechazada'}
          </span>
        )}
      </header>

      <div className="grid gap-px bg-separator md:grid-cols-2">
        <section className="space-y-2 bg-surface p-5">
          <h3 className="text-footnote font-semibold tracking-wide text-label-2 uppercase">Lo que envió el estudiante</h3>
          <div className="max-h-72 overflow-y-auto pr-1">
            <StructuredText text={interaction.input} />
          </div>
        </section>
        <section className="space-y-2 bg-surface p-5">
          <h3 className="text-footnote font-semibold tracking-wide text-ai uppercase">Respuesta de la IA</h3>
          <div className="max-h-72 overflow-y-auto pr-1">
            <StructuredText text={interaction.ai_output} />
          </div>
        </section>
      </div>

      <footer className="space-y-3 border-t border-separator px-5 py-4">
        {reviewed ? (
          interaction.validation_notes && (
            <p className="text-subhead text-label-2">
              <strong className="font-semibold text-label">Notas: </strong>
              {interaction.validation_notes}
            </p>
          )
        ) : (
          <>
            <TextArea
              label="Notas de validación"
              placeholder="Opcional al aprobar. Al rechazar, explica qué está mal."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              className="[&_textarea]:min-h-16"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => validate.mutate(true)} loading={validate.isPending && validate.variables === true}>
                Aprobar
              </Button>
              <Button
                variant="destructive"
                onClick={() => validate.mutate(false)}
                disabled={notes.trim().length < 5}
                loading={validate.isPending && validate.variables === false}
              >
                Rechazar
              </Button>
            </div>
            {validate.error && (
              <p role="alert" className="text-footnote text-danger">
                {validate.error instanceof ApiError ? validate.error.message : 'No fue posible guardar la validación.'}
              </p>
            )}
          </>
        )}
      </footer>
    </article>
  )
}
