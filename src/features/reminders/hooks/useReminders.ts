'use client'

import { useState, useEffect, useCallback } from 'react'
import { remindersService } from '../services/remindersService'
import { plantProfileService } from '@/features/plant-profile/services/plantProfileService'
import type { ReminderWithUrgency } from '../types'
import type { CareType } from '@/features/plant-profile/types'

function computeUrgency(nextReminderAt: string): { daysUntil: number; isOverdue: boolean } {
  const now = new Date()
  const next = new Date(nextReminderAt)
  const diffMs = next.getTime() - now.getTime()
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return { daysUntil, isOverdue: daysUntil < 0 }
}

interface UseRemindersReturn {
  reminders: ReminderWithUrgency[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  completeReminder: (
    reminderId: string,
    plantId: string,
    careType: CareType,
    frequencyDays: number
  ) => Promise<void>
}

export function useReminders(userId: string): UseRemindersReturn {
  const [reminders, setReminders] = useState<ReminderWithUrgency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReminders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await remindersService.getReminders(userId)
      const withUrgency: ReminderWithUrgency[] = data.map((r) => ({
        ...r,
        ...computeUrgency(r.next_reminder_at),
      }))
      setReminders(withUrgency)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recordatorios')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) fetchReminders()
  }, [userId, fetchReminders])

  const completeReminder = useCallback(
    async (
      reminderId: string,
      plantId: string,
      careType: CareType,
      frequencyDays: number
    ) => {
      await plantProfileService.addCareLog(plantId, userId, careType)
      await remindersService.updateNextReminder(reminderId, frequencyDays)
      await fetchReminders()
    },
    [userId, fetchReminders]
  )

  return {
    reminders,
    isLoading,
    error,
    refetch: fetchReminders,
    completeReminder,
  }
}
