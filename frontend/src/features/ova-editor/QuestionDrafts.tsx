import { useState } from 'react'
import { Check, Plus, Sparkles } from 'lucide-react'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { SHARED_AI } from '../../content/ids'
import { AIPanel } from '../ai-activity/AIPanel'
import { useAIRun } from '../ai-activity/useAIRun'
import { useAuth } from '../auth/useAuth'
import type { DraftQuestion } from './QuizBuilder'

interface Drafts {
  preguntas: Array<{ enunciado: string; opciones: string[]; correcta: number; explicacion: string }>
}

/** AI drafts of quiz questions; the teacher decides which ones to keep. */
export function QuestionDrafts({ ovaTitle, onAdd }: { ovaTitle: string; onAdd: (question: DraftQuestion) => void }) {
  const { user } = useAuth()
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(3)
  const [difficulty, setDifficulty] = useState('media')
  const [added, setAdded] = useState<number[]>([])
  const drafts = useAIRun<Drafts>(SHARED_AI.questionDrafts, `${user?.id}.question-drafts`, { json: true })

  function generate() {
    setAdded([])
    drafts.run({ ova: ovaTitle || 'Gestión de proyectos informáticos', tema: topic, cantidad: count, dificultad: difficulty })
  }

  return (
    <section className="space-y-4 rounded-card border border-ai/25 bg-ai-soft p-5" aria-labelledby="borradores">
      <div>
        <h3 id="borradores" className="flex items-center gap-2 text-headline text-ai">
          <Sparkles className="size-5" aria-hidden />
          Borradores de preguntas con IA
        </h3>
        <p className="mt-1 text-subhead text-label-2">
          Describe el tema y la IA propone preguntas. Revísalas antes de agregarlas: tú decides qué entra al quiz.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_7rem_9rem]">
        <TextField label="Tema" placeholder="Ej. diferencias entre EDT y cronograma" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <label className="flex flex-col gap-1.5">
          <span className="text-footnote font-medium text-label-2">Cantidad</span>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="h-12 rounded-control border border-separator-strong bg-surface px-3">
            {[2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-footnote font-medium text-label-2">Dificultad</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="h-12 rounded-control border border-separator-strong bg-surface px-3">
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
      </div>
      <Button variant="ai" onClick={generate} disabled={topic.trim().length < 4} loading={drafts.pending} icon={<Sparkles className="size-4" aria-hidden />}>
        Generar borradores
      </Button>

      {(drafts.pending || drafts.error || drafts.result) && (
        <AIPanel
          title="Propuestas"
          pendingLabel={`Redactando ${count} preguntas sobre "${topic}"…`}
          pending={drafts.pending}
          error={drafts.error}
          onRetry={generate}
          className="bg-surface/70"
        >
          {drafts.result?.data?.preguntas ? (
            <ol className="space-y-3">
              {drafts.result.data.preguntas.map((q, index) => (
                <li key={index} className="rounded-control bg-surface p-4">
                  <p className="text-subhead font-semibold">{q.enunciado}</p>
                  <ul className="mt-2 space-y-1 text-subhead">
                    {q.opciones.map((option, i) => (
                      <li key={i} className={i === q.correcta ? 'font-medium text-success' : 'text-label-2'}>
                        {String.fromCharCode(65 + i)}. {option}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-footnote text-label-2">{q.explicacion}</p>
                  <Button
                    variant={added.includes(index) ? 'secondary' : 'plain'}
                    size="sm"
                    className="mt-2 -ml-3"
                    disabled={added.includes(index)}
                    icon={added.includes(index) ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                    onClick={() => {
                      setAdded((list) => [...list, index])
                      onAdd({
                        key: crypto.randomUUID(),
                        prompt: q.enunciado,
                        options: q.opciones.slice(0, 4),
                        answer: Math.min(Math.max(q.correcta, 0), 3),
                        explanation: q.explicacion,
                      })
                    }}
                  >
                    {added.includes(index) ? 'Agregada al quiz' : 'Agregar al quiz'}
                  </Button>
                </li>
              ))}
            </ol>
          ) : (
            drafts.result && <p className="text-subhead whitespace-pre-line">{drafts.result.raw}</p>
          )}
        </AIPanel>
      )}
    </section>
  )
}
