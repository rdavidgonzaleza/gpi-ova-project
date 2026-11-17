import { useMemo } from 'react'
import { renderMarkdown } from '../../lib/markdown'
import { splitMedia } from '../../lib/media'
import type { ContentBlock as Block } from '../../types/domain'
import { MediaFigure } from './MediaFigure'

type Part = { kind: 'markdown'; html: string } | { kind: 'figure'; url: string; description: string }

/**
 * A Markdown line holding only an image (`![descripción](url)`) becomes a
 * figure, so a reading can mix short text with diagrams in the same step.
 */
const FIGURE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/gm

function splitText(markdown: string): Part[] {
  const parts: Part[] = []
  let last = 0
  for (const match of markdown.matchAll(FIGURE_LINE)) {
    const before = markdown.slice(last, match.index).trim()
    if (before) parts.push({ kind: 'markdown', html: renderMarkdown(before) })
    parts.push({ kind: 'figure', url: match[2], description: match[1] })
    last = match.index + match[0].length
  }
  const rest = markdown.slice(last).trim()
  if (rest) parts.push({ kind: 'markdown', html: renderMarkdown(rest) })
  return parts
}

export function ContentBlock({ block }: { block: Block }) {
  const parts = useMemo(() => (block.type === 'texto' ? splitText(block.content) : []), [block])

  if (block.type === 'texto') {
    return (
      <div className="space-y-8">
        {parts.map((part, index) =>
          part.kind === 'markdown' ? (
            <div key={index} className="prose-ova" dangerouslySetInnerHTML={{ __html: part.html }} />
          ) : (
            <MediaFigure key={index} type="imagen" url={part.url} description={part.description} />
          ),
        )}
      </div>
    )
  }

  const { url, description } = splitMedia(block.content)
  return <MediaFigure type={block.type} url={url} description={description} />
}
