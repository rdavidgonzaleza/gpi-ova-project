import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] shadow-sm': variant === 'primary',
            'bg-[var(--color-surface)] text-[var(--color-content)] hover:bg-[var(--color-border)]': variant === 'secondary',
            'border border-[var(--color-border)] text-[var(--color-content)] hover:bg-[var(--color-surface)]': variant === 'outline',
            'text-[var(--color-content)] hover:bg-[var(--color-surface)]': variant === 'ghost',
            
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-5 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
