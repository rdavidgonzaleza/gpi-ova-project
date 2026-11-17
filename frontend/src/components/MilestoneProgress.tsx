import { cn } from '../lib/cn'
import { MilestoneGlyph } from './BrandMark'

interface MilestoneProgressProps {
  /** 0–100 */
  value: number
  /** Positions (0–100) of the milestones along the bar, e.g. section boundaries. */
  milestones?: number[]
  label: string
  className?: string
}

/**
 * Progress drawn like a Gantt bar: a track with milestone diamonds that fill
 * in as the learner passes them. Signature element of the product.
 */
export function MilestoneProgress({ value, milestones = [], label, className }: MilestoneProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn('relative h-3', className)}
    >
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-700 ease-(--ease-standard)"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {milestones.map((position) => (
        <MilestoneGlyph
          key={position}
          filled={clamped >= position}
          className={cn(
            'absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 transition-colors duration-500',
            clamped >= position ? 'text-accent' : 'text-label-3',
          )}
          // keep the diamond inside the track at both ends
          style={{ left: `clamp(6px, ${position}%, calc(100% - 6px))` }}
        />
      ))}
    </div>
  )
}
