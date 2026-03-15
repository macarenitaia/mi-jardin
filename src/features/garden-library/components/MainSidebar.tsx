'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Leaf,
  Search,
  AlertCircle,
  Bell,
  Droplets,
  Sun,
  MessageCircle,
  LogOut,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { authService } from '@/features/auth/services/authService'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/plants', icon: Leaf, label: 'Mi Jardín' },
  { href: '/identify', icon: Search, label: 'Identificar' },
  { href: '/diagnose', icon: AlertCircle, label: 'Diagnosticar' },
  { href: '/reminders', icon: Bell, label: 'Recordatorios' },
  { href: '/watering', icon: Droplets, label: 'Calculadora' },
  { href: '/light', icon: Sun, label: 'Luz' },
  { href: '/jardinero', icon: MessageCircle, label: 'El Jardinero' },
]

export function MainSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authService.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-20 lg:w-64 bg-black/20 backdrop-blur-2xl border-r border-white/10 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="hidden lg:block">
            <p className="text-white font-bold text-sm leading-tight">Mi Jardín</p>
            <p className="text-white/40 text-xs">Tu jardín inteligente</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/plants' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-white/[0.12] border border-white/[0.15] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              )}
              title={label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block text-sm font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 lg:p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
