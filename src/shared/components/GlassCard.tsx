import { cn } from '@/shared/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  highlight?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  hover = false,
  highlight = false,
  onClick,
}: GlassCardProps) {
  const base = hover
    ? 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl shadow-xl hover:bg-white/[0.12] hover:border-white/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300'
    : 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl shadow-xl'

  return (
    <div
      className={cn('relative overflow-hidden', base, onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {/* Highlight superior (efecto cristal) */}
      {highlight && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      )}
      {children}
    </div>
  )
}
