import { useState } from 'react'
import { VideoOff } from 'lucide-react'
import { isThemedDiagram, videoSource } from '../../lib/media'
import { Diagram } from './Diagram'

interface Props {
  type: 'imagen' | 'video'
  url: string
  description: string
}

export function MediaFigure({ type, url, description }: Props) {
  return (
    <figure className="space-y-3">
      {type === 'imagen' ? (
        <div className="card overflow-hidden p-3 sm:p-5">
          {isThemedDiagram(url) ? (
            <Diagram src={url} alt={description} />
          ) : (
            <img src={url} alt={description} className="w-full rounded-xl" loading="lazy" />
          )}
        </div>
      ) : (
        <Video url={url} description={description} />
      )}
      {description && <figcaption className="px-1 text-footnote text-label-2">{description}</figcaption>}
    </figure>
  )
}

function Video({ url, description }: { url: string; description: string }) {
  const [failed, setFailed] = useState(false)
  const source = videoSource(url)

  if (failed) {
    return (
      <div className="card flex aspect-video flex-col items-center justify-center gap-3 p-6 text-center">
        <VideoOff className="size-8 text-label-3" aria-hidden />
        <p className="text-subhead text-label-2">No pudimos cargar este video. Puedes continuar con el siguiente paso.</p>
      </div>
    )
  }

  if (source.kind === 'file') {
    return (
      <div className="card overflow-hidden bg-black">
        <video
          src={source.src}
          controls
          playsInline
          preload="metadata"
          aria-label={description || 'Video del OVA'}
          className="aspect-video w-full"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  return (
    <div className="card aspect-video overflow-hidden">
      <iframe
        src={source.kind === 'youtube' ? source.embed : source.src}
        title={description || 'Video del OVA'}
        className="size-full"
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
