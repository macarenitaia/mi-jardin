// Preset de clases Liquid Glass para Mi Jardín
// Importar con: import { glass } from '@/shared/lib/glass'

export const glass = {
  // Cards
  card: 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl shadow-xl',
  cardHover: 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl shadow-xl hover:bg-white/[0.12] hover:border-white/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300',
  cardSm: 'bg-white/[0.08] backdrop-blur-lg border border-white/[0.15] rounded-2xl shadow-lg',

  // Inputs
  input: 'glass-input w-full px-4 py-3',

  // Buttons
  buttonPrimary: 'glass-button-primary px-6 py-3 cursor-pointer',
  buttonSecondary: 'glass-button-secondary px-6 py-3 cursor-pointer',
  buttonIcon: 'bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-md border border-white/[0.15] rounded-xl p-2.5 text-white transition-all duration-200 cursor-pointer',

  // Navigation
  sidebar: 'bg-black/20 backdrop-blur-2xl border-r border-white/10',
  navbar: 'bg-black/20 backdrop-blur-xl border-b border-white/10',
  navItem: 'flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer',
  navItemActive: 'flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-white/[0.12] border border-white/[0.15]',

  // Badges
  badge: 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full px-3 py-1 text-xs font-medium',
  badgeDanger: 'bg-red-500/20 border border-red-400/30 text-red-300 rounded-full px-3 py-1 text-xs font-medium',
  badgeWarning: 'bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full px-3 py-1 text-xs font-medium',

  // Text
  heading: 'text-white font-bold',
  subheading: 'text-white/70 font-medium',
  muted: 'text-white/50',
  label: 'text-white/60 text-sm font-medium',

  // Divider
  divider: 'border-t border-white/[0.08]',

  // Modal / Overlay
  overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50',
  modal: 'bg-white/[0.10] backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl',
} as const

export type GlassKey = keyof typeof glass
