import { useMemo } from 'react'
import { renderMarkdown } from '../../lib/markdown'
import type { ContentBlock as Block } from '../../types/domain'

/** Image and video blocks store `url|description` in `content`. */
function splitMedia(content: string) {
  const [url, ...rest] = content.split('|')
  return { url: url.trim(), description: rest.join('|').trim() }
}

function embedUrl(url: string) {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)
  return youtube ? `https://www.youtube-nocookie.com/embed/${youtube[1]}` : url
}

export function ContentBlock({ block }: { block: Block }) {
  const html = useMemo(() => (block.type === 'texto' ? renderMarkdown(block.content) : ''), [block])

  if (block.type === 'texto') {
    return <div className="prose-ova" dangerouslySetInnerHTML={{ __html: html }} />
  }

  const { url, description } = splitMedia(block.content)
  if (block.type === 'imagen') {
    return (
      <figure className="space-y-3">
        <div className="card overflow-hidden p-2 sm:p-3">
          <img src={url} alt={description} className="w-full rounded-xl" loading="lazy" />
        </div>
        {description && <figcaption className="px-1 text-footnote text-label-2">{description}</figcaption>}
      </figure>
    )
  }

  return (
    <figure className="space-y-3">
      <div className="card aspect-video overflow-hidden">
        <iframe
          src={embedUrl(url)}
          title={description || 'Video del OVA'}
          className="size-full"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      {description && <figcaption className="px-1 text-footnote text-label-2">{description}</figcaption>}
    </figure>
  )
}
