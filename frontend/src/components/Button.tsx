import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '../lib/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'plain' | 'destructive' | 'ai'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-[background-color,color,transform,opacity] duration-150 ease-(--ease-standard) ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-surface-2 text-label hover:bg-surface-3',
  plain: 'text-accent hover:bg-accent-soft',
  destructive: 'bg-danger-soft text-danger hover:brightness-95',
  ai: 'bg-ai text-white hover:brightness-110 dark:text-black',
}

// 44 px is the default touch target (HIG accessibility.md); sm stays above
// the 28 px minimum and is meant for pointer-first toolbars.
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-footnote',
  md: 'h-11 px-5 text-subhead',
  lg: 'h-12 px-7 text-body',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, icon, className, children, disabled, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner className="size-4" /> : icon}
      {children}
    </button>
  )
})

interface ButtonLinkProps extends LinkProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

export function ButtonLink({ variant, size, icon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, typeof className === 'string' ? className : undefined)} {...props}>
      {icon}
      {children}
    </Link>
  )
}
