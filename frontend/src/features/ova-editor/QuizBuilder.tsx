import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { IconButton } from './BlocksEditor'

export interface DraftQuestion {
  key: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export const emptyQuestion = (): DraftQuestion => ({
  key: crypto.randomUUID(),
  prompt: '',
  options: ['', '', '', ''],
  answer: 0,
  explanation: '',
})

export function QuizBuilder({ questions, onChange }: { questions: DraftQuestion[]; onChange: (q: DraftQuestion[]) => void }) {
  const update = (key: string, patch: Partial<DraftQuestion>) =>
    onChange(questions.map((q) => (q.key === key ? { ...q, ...patch } : q)))

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <fieldset key={question.key} className="card space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <legend className="text-footnote font-semibold text-label-2">Pregunta {index + 1}</legend>
            <IconButton label="Eliminar pregunta" onClick={() => onChange(questions.filter((q) => q.key !== question.key))}>
              <Trash2 className="size-4 text-danger" />
            </IconButton>
          </div>
          <TextField label="Enunciado" value={question.prompt} onChange={(e) => update(question.key, { prompt: e.target.value })} />
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options.map((option, i) => (
              <div key={i} className="flex items-end gap-2">
                <label className="mb-3.5 flex items-center" title="Marcar como correcta">
                  <input
                    type="radio"
                    name={`correct-${question.key}`}
                    checked={question.answer === i}
                    onChange={() => update(question.key, { answer: i })}
                    className="size-5 accent-(--accent)"
                    aria-label={`Opción ${String.fromCharCode(65 + i)} es la correcta`}
                  />
                </label>
                <TextField
                  className="flex-1"
                  label={`Opción ${String.fromCharCode(65 + i)}`}
                  value={option}
                  onChange={(e) =>
                    update(question.key, { options: question.options.map((o, j) => (j === i ? e.target.value : o)) })
                  }
                />
              </div>
            ))}
          </div>
          <TextField
            label="Explicación de la respuesta"
            value={question.explanation}
            onChange={(e) => update(question.key, { explanation: e.target.value })}
          />
        </fieldset>
      ))}
      <Button variant="secondary" size="sm" icon={<Plus className="size-4" aria-hidden />} onClick={() => onChange([...questions, emptyQuestion()])}>
        Agregar pregunta
      </Button>
    </div>
  )
}
