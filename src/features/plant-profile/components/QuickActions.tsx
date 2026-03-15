'use client'

import { useState } from 'react'
import { Droplets, Leaf, Scissors, Package } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { remindersService } from '@/features/reminders/services/remindersService'
import type { CareType } from '../types'
import type { ReminderType } from '@/features/reminders/types'

interface Action {
  careType: CareType
  label: string
  emoji: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  activeColor: string
}

const ACTIONS: Action[] = [
  {
    careType: 'watering',
    label: 'Regar',
    emoji: '💧',
    icon: Droplets,
    color: 'bg-blue-500/10 border-blue-400/20 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/40',
    activeColor: 'bg-blue-500/30 border-blue-400/60 text-blue-200',
  },
  {
    careType: 'fertilizing',
    label: 'Abonar',
    emoji: '🌱',
    icon: Leaf,
    color: 'bg-emerald-500/10 border-emerald-400/20 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/40',
    activeColor: 'bg-emerald-500/30 border-emerald-400/60 text-emerald-200',
  },
  {
    careType: 'pruning',
    label: 'Podar',
    emoji: '✂️',
    icon: Scissors,
    color: 'bg-amber-500/10 border-amber-400/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/40',
    activeColor: 'bg-amber-500/30 border-amber-400/60 text-amber-200',
  },
  {
    careType: 'repotting',
    label: 'Trasplantar',
    emoji: '📦',
    icon: Package,
    color: 'bg-orange-500/10 border-orange-400/20 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400/40',
    activeColor: 'bg-orange-500/30 border-orange-400/60 text-orange-200',
  },
]

interface QuickActionsProps {
  plantId: string
  userId: string
  onAction: (careType: CareType) => Promise<void>
}

interface Feedback {
  careType: CareType
  message: string
}

const FEEDBACK_MESSAGES: Record<CareType, string> = {
  watering: '¡Regada! 💧',
  fertilizing: '¡Abonada! 🌱',
  pruning: '¡Podada! ✂️',
  repotting: '¡Trasplantada! 📦',
  treatment: '¡Tratada!',
  other: '¡Registrado!',
}

export function QuickActions({ plantId, userId, onAction }: QuickActionsProps) {
  const [loading, setLoading] = useState<CareType | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const CARE_TO_REMINDER: Partial<Record<CareType, ReminderType>> = {
    watering: 'watering',
    fertilizing: 'fertilizing',
    pruning: 'pruning',
    repotting: 'repotting',
  }

  const handleAction = async (action: Action) => {
    if (loading) return
    setLoading(action.careType)
    try {
      await onAction(action.careType)

      // Update matching active reminder if one exists
      const reminderType = CARE_TO_REMINDER[action.careType]
      if (reminderType) {
        try {
          const reminder = await remindersService.findActiveReminderByType(
            plantId,
            userId,
            reminderType
          )
          if (reminder) {
            await remindersService.updateNextReminder(reminder.id, reminder.frequency_days)
          }
        } catch {
          // Do not block the UI if reminder update fails
        }
      }

      setFeedback({ careType: action.careType, message: FEEDBACK_MESSAGES[action.careType] })
      setTimeout(() => setFeedback(null), 2000)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="relative">
      {/* Feedback toast */}
      {feedback && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 text-white text-sm font-medium whitespace-nowrap z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          const isLoading = loading === action.careType
          const isActive = feedback?.careType === action.careType

          return (
            <button
              key={action.careType}
              type="button"
              onClick={() => handleAction(action)}
              disabled={!!loading}
              className={cn(
                'flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border',
                'transition-all duration-200 cursor-pointer',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                isActive ? action.activeColor : action.color
              )}
            >
              {isLoading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
