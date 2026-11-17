/** Image and video blocks store `url|description` in `content` (spec 5.3.1). */
export function splitMedia(content: string) {
  const [url, ...rest] = content.split('|')
  return { url: url.trim(), description: rest.join('|').trim() }
}

const YOUTUBE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/

export type VideoSource = { kind: 'youtube'; embed: string } | { kind: 'file'; src: string } | { kind: 'embed'; src: string }

/** YouTube links become privacy-friendly embeds; MP4/WebM play natively. */
export function videoSource(url: string): VideoSource {
  const youtube = url.match(YOUTUBE)
  if (youtube) return { kind: 'youtube', embed: `https://www.youtube-nocookie.com/embed/${youtube[1]}` }
  if (/\.(mp4|webm|m4v|mov)(\?|#|$)/i.test(url)) return { kind: 'file', src: url }
  return { kind: 'embed', src: url }
}

/** Diagrams shipped with the app are inlined so they follow the app theme. */
export function isThemedDiagram(url: string) {
  return /^\/ovas\/[\w-]+\.svg$/.test(url)
}

/** Short step title from a block description: its first clause. */
export function captionTitle(description: string, fallback: string) {
  const first = description.split(/[:.]/)[0]?.trim()
  if (!first) return fallback
  return first.length > 60 ? `${first.slice(0, 57).trimEnd()}…` : first
}
