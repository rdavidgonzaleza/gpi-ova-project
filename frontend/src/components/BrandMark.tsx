import type { CSSProperties } from 'react'
import { cn } from '../lib/cn'

/** The milestone diamond: the product's single signature shape. */
export function MilestoneGlyph({
  className,
  filled = true,
  style,
}: {
  className?: string
  filled?: boolean
  style?: CSSProperties
}) {
  return (
    <svg viewBox="0 0 12 12" className={cn('size-3', className)} style={style} aria-hidden>
      <path
        d="M6 .8 11.2 6 6 11.2.8 6Z"
        fill={filled ? 'currentColor' : 'var(--surface)'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.4}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="grid size-7 place-items-center rounded-[0.5rem] bg-accent text-on-accent">
        <MilestoneGlyph className="size-3.5" />
      </span>
      <span className="font-display text-headline font-semibold tracking-tight">Hito</span>
    </span>
  )
}
