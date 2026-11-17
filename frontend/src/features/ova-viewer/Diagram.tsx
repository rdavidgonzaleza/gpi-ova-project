import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'

/**
 * Inlines one of the app's SVG diagrams (public/ovas). Inline SVG picks up the
 * `.dg-*` classes from index.css, so it follows the light/dark toggle; an
 * <img> would only see the system preference. Static assets are fetched
 * outside src/api because they do not belong to any microservice.
 */
export function Diagram({ src, alt }: { src: string; alt: string }) {
  const svg = useQuery({
    queryKey: ['diagram', src],
    queryFn: async () => {
      const response = await fetch(src)
      if (!response.ok) throw new Error(`diagram ${response.status}`)
      return DOMPurify.sanitize(await response.text(), {
        USE_PROFILES: { svg: true },
        // The file's own <style> targets the system theme; the app's wins.
        FORBID_TAGS: ['style'],
      })
    },
    staleTime: Infinity,
  })

  if (svg.isError) return <img src={src} alt={alt} className="w-full" loading="lazy" />
  if (!svg.data) return <div className="aspect-[5/2] w-full animate-pulse rounded-xl bg-surface-2" aria-hidden />
  return <div role="img" aria-label={alt} className="diagram" dangerouslySetInnerHTML={{ __html: svg.data }} />
}
