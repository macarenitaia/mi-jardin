'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Leaf, Droplets, Scissors, Package, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { GlassCard } from '@/shared/components/GlassCard'
import type { ReminderWithUrgency } from '../types'
import type { CareType } from '@/features/plant-profile/types'

interface ReminderCardProps {
  reminder: ReminderWithUrgency
  onComplete: (
    reminderId: string,
    plantId: string,
    careType: CareType,
    frequencyDays: number
  ) => Promise<void>
}

const REMINDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  watering: Droplets,
  fertilizing: Leaf,
  pruning: Scissors,
  repotting: Package,
  other: MoreHorizontal,
}

const REMINDER_LABELS: Record<string, string> = {
  watering: 'Riego',
  fertilizing: 'Abono',
  pruning: 'Poda',
  repotting: 'Trasplante',
  other: 'Otro',
}

const REMINDER_ICON_COLORS: Record<string, string> = {
  watering: 'text-blue-300',
  fertilizing: 'text-emerald-300',
  pruning: 'text-amber-300',
  repotting: 'text-orange-300',
  other: 'text-white/60',
}

function UrgencyBadge({ daysUntil, isOverdue }: { daysUntil: number; isOverdue: boolean }) {
  if (isOverdue) {
    const absDays = Math.abs(daysUntil)
    return (
      <span className="rounded-full px-3 py-1 text-xs font-medium bg-red-500/20 border border-red-400/30 text-red-300">
        Hace {absDays} {absDays === 1 ? 'día' : 'días'}
      </span>
    )
  }

  if (daysUntil === 0) {
    return (
      <span className="rounded-full px-3 py-1 text-xs font-medium bg-amber-500/20 border border-amber-400/30 text-amber-300">
        ¡Hoy!
      </span>
    )
  }

  if (daysUntil <= 3) {
    return (
      <span className="rounded-full px-3 py-1 text-xs font-medium bg-orange-500/20 border border-orange-400/30 text-orange-300">
        En {daysUntil} {daysUntil === 1 ? 'día' : 'días'}
      </span>
    )
  }

  return (
    <span className="rounded-full px-3 py-1 text-xs font-medium bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
      En {daysUntil} días
    </span>
  )
}

export function ReminderCard({ reminder, onComplete }: ReminderCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const Icon = REMINDER_ICONS[reminder.reminder_type] ?? MoreHorizontal
  const iconColor = REMINDER_ICON_COLORS[reminder.reminder_type] ?? 'text-white/60'
  const label = REMINDER_LABELS[reminder.reminder_type] ?? 'Otro'

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await onComplete(
        reminder.id,
        reminder.plant_id,
        reminder.reminder_type as CareType,
        reminder.frequency_days
      )
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <GlassCard hover className="p-4">
      <div className="flex items-center gap-4">
        {/* Plant photo or leaf icon */}
        <div className="shrink-0">
          {reminder.plant?.main_photo_url ? (
            <Image
              src={reminder.plant.main_photo_url}
              alt={reminder.plant.name ?? ''}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400/60" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">
            {reminder.plant?.name ?? 'Planta desconocida'}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Icon className={cn('w-3.5 h-3.5', iconColor)} />
            <span className="text-white/50 text-xs">{label}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/40 text-xs">cada {reminder.frequency_days} días</span>
          </div>
        </div>

        {/* Badge + Action */}
        <div className="flex items-center gap-3 shrink-0">
          <UrgencyBadge daysUntil={reminder.daysUntil} isOverdue={reminder.isOverdue} />

          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleting}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium',
              'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300',
              'hover:bg-emerald-500/30 hover:border-emerald-400/50 hover:text-emerald-200',
              'transition-all duration-200 cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isCompleting ? (
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            Hecho
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
