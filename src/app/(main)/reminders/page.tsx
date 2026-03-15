'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import { useReminders } from '@/features/reminders/hooks/useReminders'
import { ReminderCard } from '@/features/reminders/components/ReminderCard'
import type { ReminderWithUrgency } from '@/features/reminders/types'
import type { CareType } from '@/features/plant-profile/types'

function ReminderSkeleton() {
  return (
    <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/[0.08]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/[0.08] rounded-full w-2/5" />
          <div className="h-3 bg-white/[0.06] rounded-full w-1/4" />
        </div>
        <div className="h-6 bg-white/[0.08] rounded-full w-20" />
      </div>
    </div>
  )
}

export default function RemindersPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  if (!userId) {
    return (
      <div className="p-6 lg:p-8 space-y-4">
        <div className="h-8 bg-white/[0.08] rounded-full w-48 animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <ReminderSkeleton key={i} />
        ))}
      </div>
    )
  }

  return <RemindersContent userId={userId} />
}

function RemindersContent({ userId }: { userId: string }) {
  const { reminders, isLoading, error, completeReminder } = useReminders(userId)

  const handleComplete = async (
    reminderId: string,
    plantId: string,
    careType: CareType,
    frequencyDays: number
  ) => {
    await completeReminder(reminderId, plantId, careType, frequencyDays)
  }

  const overdue = reminders.filter((r) => r.isOverdue && r.is_active)
  const upcoming = reminders.filter((r) => !r.isOverdue && r.is_active)
  const overdueCount = overdue.length

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Recordatorios</h1>
          {overdueCount > 0 && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-red-500/20 border border-red-400/30 text-red-300">
              {overdueCount} vencido{overdueCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ReminderSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="bg-red-500/10 border border-red-400/20 rounded-2xl p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && reminders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.06] border border-white/[0.10] flex items-center justify-center">
            <Bell className="w-8 h-8 text-white/20" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">Sin recordatorios</p>
            <p className="text-white/40 text-sm mt-1">
              Configura recordatorios desde el perfil de cada planta
            </p>
          </div>
        </div>
      )}

      {/* Overdue section */}
      {!isLoading && overdue.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-red-400/20" />
            <span className="text-red-300 text-xs font-medium uppercase tracking-wide px-2">
              Vencidos
            </span>
            <div className="h-px flex-1 bg-red-400/20" />
          </div>
          {overdue.map((reminder: ReminderWithUrgency) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={handleComplete}
            />
          ))}
        </section>
      )}

      {/* Upcoming section */}
      {!isLoading && upcoming.length > 0 && (
        <section className="space-y-3">
          {overdue.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-white/40 text-xs font-medium uppercase tracking-wide px-2">
                Próximos
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>
          )}
          {upcoming.map((reminder: ReminderWithUrgency) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={handleComplete}
            />
          ))}
        </section>
      )}
    </div>
  )
}
