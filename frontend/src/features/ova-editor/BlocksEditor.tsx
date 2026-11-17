import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Clapperboard, Eye, ImagePlus, Pencil, TextCursorInput, Trash2 } from 'lucide-react'
import { Button } from '../../components/Button'
import { TextArea } from '../../components/TextArea'
import { renderMarkdown } from '../../lib/markdown'
import { MediaField } from './MediaField'

export interface DraftBlock {
  key: string
  type: 'texto' | 'imagen' | 'video'
  /** Markdown for texto; URL for imagen/video. */
  content: string
  alt?: string
  /** File chosen to upload to the bucket when the OVA is saved. */
  file?: File
  error?: string
}

const TYPE_LABEL: Record<DraftBlock['type'], string> = { texto: 'Texto', imagen: 'Imagen', video: 'Video' }

interface Props {
  blocks: DraftBlock[]
  onChange: (blocks: DraftBlock[]) => void
}

export function BlocksEditor({ blocks, onChange }: Props) {
  const update = (key: string, patch: Partial<DraftBlock>) =>
    onChange(blocks.map((block) => (block.key === key ? { ...block, ...patch } : block)))
  const move = (index: number, delta: number) => {
    const next = [...blocks]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    onChange(next)
  }
  const add = (type: DraftBlock['type']) =>
    onChange([...blocks, { key: crypto.randomUUID(), type, content: type === 'texto' ? '## Nuevo tema\n\n' : '' }])

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={block.key} className="card space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-footnote font-semibold text-label-2">
              Bloque {index + 1} · {TYPE_LABEL[block.type]}
            </p>
            <div className="flex gap-1">
              <IconButton label="Subir" disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp className="size-4" />
              </IconButton>
              <IconButton label="Bajar" disabled={index === blocks.length - 1} onClick={() => move(index, 1)}>
                <ArrowDown className="size-4" />
              </IconButton>
              <IconButton label="Eliminar bloque" onClick={() => onChange(blocks.filter((b) => b.key !== block.key))}>
                <Trash2 className="size-4 text-danger" />
              </IconButton>
            </div>
          </div>
          {block.type === 'texto' ? (
            <MarkdownField value={block.content} onChange={(content) => update(block.key, { content })} />
          ) : (
            <MediaField block={block as DraftBlock & { type: 'imagen' | 'video' }} onChange={(patch) => update(block.key, patch)} />
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" icon={<TextCursorInput className="size-4" aria-hidden />} onClick={() => add('texto')}>
          Agregar texto
        </Button>
        <Button variant="secondary" size="sm" icon={<ImagePlus className="size-4" aria-hidden />} onClick={() => add('imagen')}>
          Agregar imagen
        </Button>
        <Button variant="secondary" size="sm" icon={<Clapperboard className="size-4" aria-hidden />} onClick={() => add('video')}>
          Agregar video
        </Button>
      </div>
    </div>
  )
}

function MarkdownField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [preview, setPreview] = useState(false)
  const html = useMemo(() => (preview ? renderMarkdown(value) : ''), [preview, value])
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          variant="plain"
          size="sm"
          icon={preview ? <Pencil className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          onClick={() => setPreview((p) => !p)}
        >
          {preview ? 'Editar' : 'Vista previa'}
        </Button>
      </div>
      {preview ? (
        <div className="prose-ova compact rounded-control bg-surface-2 p-4" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <TextArea
          label="Contenido (Markdown)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="font-mono [&_textarea]:font-mono [&_textarea]:text-subhead"
          hint="Usa ## para títulos, **negrita**, listas con - y tablas con |."
        />
      )}
    </div>
  )
}

export function IconButton({
  label,
  children,
  ...props
}: { label: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full text-label-2 hover:bg-surface-2 disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  )
}
