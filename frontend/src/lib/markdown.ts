import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.use({ gfm: true, breaks: false })

/** Renders teacher- or AI-authored Markdown to sanitized HTML. */
export function renderMarkdown(source: string): string {
  return DOMPurify.sanitize(marked.parse(source, { async: false }), { USE_PROFILES: { html: true } })
}

/** Inline variant (no wrapping paragraph), for short labels such as quiz prompts. */
export function renderInline(source: string): string {
  return DOMPurify.sanitize(marked.parseInline(source, { async: false }), { USE_PROFILES: { html: true } })
}
