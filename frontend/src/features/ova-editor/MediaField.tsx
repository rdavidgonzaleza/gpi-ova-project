import { useId } from 'react'
import { FileUp, X } from 'lucide-react'
import { sourceOf } from '../../api/source'
import { TextField } from '../../components/TextField'
import type { DraftBlock } from './BlocksEditor'

const ACCEPT = {
  imagen: 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml',
  video: 'video/mp4,video/webm',
} as const

/** Max size accepted by the editor; B2's free tier has 10 GB in total. */
const MAX_BYTES = { imagen: 10 * 1024 * 1024, video: 500 * 1024 * 1024 } as const

interface Props {
  block: DraftBlock & { type: 'imagen' | 'video' }
  onChange: (patch: Partial<DraftBlock>) => void
}

/**
 * URL or file for an image/video block. A chosen file is uploaded to the
 * bucket when the OVA is saved (it needs the OVA id to sign the upload).
 */
export function MediaField({ block, onChange }: Props) {
  const inputId = useId()
  const canUpload = sourceOf('content') === 'remote'
  const kind = block.type === 'video' ? 'video' : 'imagen'

  function pick(file: File | undefined) {
    if (!file) return
    if (file.size > MAX_BYTES[kind]) {
      onChange({ file: undefined, error: `El archivo supera ${MAX_BYTES[kind] / 1024 / 1024} MB.` })
      return
    }
    onChange({ file, content: '', error: undefined, alt: block.alt || file.name.replace(/\.[^.]+$/, '') })
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {block.file ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-footnote font-medium text-label-2">Archivo</span>
            <div className="flex min-h-11 items-center justify-between gap-2 rounded-control bg-surface-2 px-3.5 text-subhead">
              <span className="truncate">{block.file.name}</span>
              <button
                type="button"
                aria-label="Quitar archivo"
                className="grid size-7 place-items-center rounded-full text-label-2 hover:bg-surface-3"
                onClick={() => onChange({ file: undefined })}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <TextField
            label={kind === 'video' ? 'URL del video (YouTube o MP4)' : 'URL de la imagen'}
            value={block.content}
            onChange={(e) => onChange({ content: e.target.value })}
          />
        )}
        <TextField label="Descripción (texto alternativo)" value={block.alt ?? ''} onChange={(e) => onChange({ alt: e.target.value })} />
      </div>
      {canUpload && !block.file && (
        <div>
          <input
            id={inputId}
            type="file"
            accept={ACCEPT[kind]}
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <label
            htmlFor={inputId}
            className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-subhead font-medium text-accent hover:bg-accent-soft"
          >
            <FileUp className="size-4" aria-hidden />
            {kind === 'video' ? 'Subir un video desde tu equipo' : 'Subir una imagen desde tu equipo'}
          </label>
          <p className="mt-1 text-footnote text-label-2">
            {kind === 'video'
              ? 'MP4 o WebM, hasta 500 MB. Sirve para los resúmenes en video generados con IA.'
              : 'PNG, JPEG, WebP, GIF o SVG, hasta 10 MB.'}
          </p>
        </div>
      )}
      {block.error && (
        <p role="alert" className="text-footnote text-danger">
          {block.error}
        </p>
      )}
    </div>
  )
}
