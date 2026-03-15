'use client'

import { Droplets, Leaf, Scissors, Package, Pill, MoreHorizontal } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { CareLog, CareType } from '../types'

interface CareLogListProps {
  careLogs: CareLog[]
}

const CARE_CONFIG: Record<
  CareType,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  watering: {
    icon: Droplets,
    label: 'Riego',
    color: 'text-blue-300 bg-blue-500/10 border-blue-400/20',
  },
  fertilizing: {
    icon: Leaf,
    label: 'Abono',
    color: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
  },
  pruning: {
    icon: Scissors,
    label: 'Poda',
    color: 'text-amber-300 bg-amber-500/10 border-amber-400/20',
  },
  repotting: {
    icon: Package,
    label: 'Trasplante',
    color: 'text-orange-300 bg-orange-500/10 border-orange-400/20',
  },
  treatment: {
    icon: Pill,
    label: 'Tratamiento',
    color: 'text-purple-300 bg-purple-500/10 border-purple-400/20',
  },
  other: {
    icon: MoreHorizontal,
    label: 'Otro',
    color: 'text-white/50 bg-white/[0.05] border-white/10',
  },
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }
  if (diffDays > 1) return `hace ${diffDays} días`
  if (diffDays === 1) return 'ayer'
  if (diffHours > 1) return `hace ${diffHours} horas`
  if (diffHours === 1) return 'hace 1 hora'
  if (diffMins > 1) return `hace ${diffMins} minutos`
  return 'hace un momento'
}

export function CareLogList({ careLogs }: CareLogListProps) {
  if (careLogs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-white/40 text-sm">Sin registros de cuidados todavía</p>
        <p className="text-white/25 text-xs mt-1">
          Usa los botones de acción rápida para registrar cuidados
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {careLogs.map((log) => {
        const config = CARE_CONFIG[log.care_type] ?? CARE_CONFIG.other
        const Icon = config.icon

        return (
          <div
            key={log.id}
            className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3"
          >
            {/* Icon */}
            <div
              className={cn(
                'w-9 h-9 rounded-xl border flex items-center justify-center shrink-0',
                config.color
              )}
            >
              <Icon className="w-4 h-4" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{config.label}</p>
              {log.notes && (
                <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{log.notes}</p>
              )}
            </div>

            {/* Time */}
            <p className="text-white/30 text-xs shrink-0">{timeAgo(log.performed_at)}</p>
          </div>
        )
      })}
    </div>
  )
}
