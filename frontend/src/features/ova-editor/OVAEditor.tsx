import { useState, type FormEvent, type ReactNode } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { activitiesApi } from '../../api/activities'
import { ApiError } from '../../api/client'
import { contentApi } from '../../api/content'
import { Button, ButtonLink } from '../../components/Button'
import { TextArea } from '../../components/TextArea'
import { TextField } from '../../components/TextField'
import { SHARED_AI } from '../../content/ids'
import type { QuizConfig } from '../../types/activities'
import type { OVA } from '../../types/domain'
import { BlocksEditor, type DraftBlock } from './BlocksEditor'
import { QuestionDrafts } from './QuestionDrafts'
import { QuizBuilder, emptyQuestion, type DraftQuestion } from './QuizBuilder'

/** UC-03: create an OVA with its content blocks and a quiz. */
export function OVAEditor() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [outcome, setOutcome] = useState('')
  const [blocks, setBlocks] = useState<DraftBlock[]>([{ key: crypto.randomUUID(), type: 'texto', content: '## Introducción\n\n' }])
  const [quizTitle, setQuizTitle] = useState('Comprueba lo aprendido')
  const [questions, setQuestions] = useState<DraftQuestion[]>([emptyQuestion()])
  const [created, setCreated] = useState<OVA | null>(null)

  const validQuestions = questions.filter((q) => q.prompt.trim() && q.options.every((o) => o.trim()))
  const ready = title.trim().length >= 4 && description.trim().length >= 10 && outcome.trim().length >= 10

  const save = useMutation({
    mutationFn: async () => {
      const ova = await contentApi.create({
        title,
        description,
        learning_outcome: outcome,
        blocks: blocks.map((block, index) => ({
          type: block.type,
          position: index + 1,
          content: block.type === 'imagen' ? `${block.content}|${block.alt ?? ''}` : block.content,
        })),
        activities: validQuestions.length ? [{ title: quizTitle, description: 'Quiz de comprobación', is_ai: true }] : [],
      })
      if (validQuestions.length) {
        const config: QuizConfig = {
          position: blocks.length + 1,
          hints_ai_activity_id: SHARED_AI.hints,
          questions: validQuestions.map((q, index) => ({
            id: `q${index + 1}`,
            prompt: q.prompt,
            options: q.options.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
            answer: String.fromCharCode(97 + q.answer),
            explanation: q.explanation || undefined,
          })),
        }
        await activitiesApi.create({ ova_id: ova.id, type: 'quiz', title: quizTitle, config: config as unknown as Record<string, unknown> })
      }
      return ova
    },
    onSuccess: (ova) => {
      setCreated(ova)
      queryClient.invalidateQueries({ queryKey: ['ovas'] })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })

  const publish = useMutation({
    mutationFn: () => contentApi.publish(created!.id),
    onSuccess: (ova) => {
      setCreated(ova)
      queryClient.invalidateQueries({ queryKey: ['ovas'] })
    },
  })

  if (created) {
    const published = created.status === 'publicado'
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <CheckCircle2 className="mx-auto size-14 text-success" strokeWidth={1.5} aria-hidden />
        <h1 className="mt-4 text-title-1 font-bold">{published ? 'OVA publicado' : 'Borrador guardado'}</h1>
        <p className="mt-2 text-body text-label-2">
          {published
            ? `"${created.title}" ya aparece en la ruta de aprendizaje de los estudiantes.`
            : `"${created.title}" quedó como borrador. Solo docentes y administradores lo ven hasta que lo publiques.`}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {!published && (
            <Button onClick={() => publish.mutate()} loading={publish.isPending}>
              Publicar ahora
            </Button>
          )}
          <ButtonLink to={`/ovas/${created.id}`} variant="secondary">
            Ver OVA
          </ButtonLink>
        </div>
      </div>
    )
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (ready) save.mutate()
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-10 px-4 pt-10 pb-16 sm:px-6 md:pt-14">
      <header>
        <p className="text-subhead font-medium text-label-2">Docencia</p>
        <h1 className="mt-1 text-title-1 font-bold tracking-tight sm:text-large-title">Nuevo OVA</h1>
        <p className="mt-3 text-body text-label-2">El OVA se guarda como borrador. Puedes publicarlo al terminar.</p>
      </header>

      <Section title="Información general">
        <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Gestión de la calidad" />
        <TextArea label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        <TextArea label="Resultado de aprendizaje" value={outcome} onChange={(e) => setOutcome(e.target.value)} rows={2} />
      </Section>

      <Section title="Contenido" subtitle="Los bloques se muestran como pasos, en este orden.">
        <BlocksEditor blocks={blocks} onChange={setBlocks} />
      </Section>

      <Section title="Quiz de comprobación" subtitle="Los estudiantes podrán pedir pistas graduadas a la IA en cada pregunta.">
        <TextField label="Título del quiz" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
        <QuestionDrafts
          ovaTitle={title}
          onAdd={(question) => setQuestions((list) => [...list.filter((q) => q.prompt.trim()), question])}
        />
        <QuizBuilder questions={questions} onChange={setQuestions} />
      </Section>

      <div className="glass sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-separator px-4 py-4 sm:-mx-6 sm:px-6">
        <Button type="submit" disabled={!ready} loading={save.isPending}>
          Guardar borrador
        </Button>
        <p className="text-footnote text-label-2">
          {blocks.length} bloques · {validQuestions.length} preguntas completas
        </p>
        {save.error && (
          <p role="alert" className="w-full text-footnote text-danger">
            {save.error instanceof ApiError ? save.error.message : 'No fue posible guardar el OVA.'}
          </p>
        )}
      </div>
    </form>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-title-3 font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-subhead text-label-2">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
