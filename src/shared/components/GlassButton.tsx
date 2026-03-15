'use client'

import { cn } from '@/shared/lib/utils'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const variants = {
  primary:
    'bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 text-white font-semibold',
  secondary:
    'bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/25 text-white font-medium',
  danger:
    'bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 hover:text-red-200 font-medium',
  ghost:
    'bg-transparent hover:bg-white/[0.08] border border-transparent text-white/70 hover:text-white font-medium',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
}

export function GlassButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: GlassButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'relative backdrop-blur-md transition-all duration-300 cursor-pointer',
        'hover:-translate-y-0.5 active:translate-y-0',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2 justify-center">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
