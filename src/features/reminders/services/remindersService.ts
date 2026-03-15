import { createClient } from '@/lib/supabase/client'
import type { Reminder, ReminderType } from '../types'

function calculateNextReminder(frequencyDays: number): string {
  const date = new Date()
  date.setDate(date.getDate() + frequencyDays)
  return date.toISOString()
}

export const remindersService = {
  async getReminders(userId: string): Promise<Reminder[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reminders')
      .select('*, plant:plants(id, name, species, main_photo_url)')
      .eq('user_id', userId)
      .order('next_reminder_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []) as Reminder[]
  },

  async getPlantReminders(plantId: string, userId: string): Promise<Reminder[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reminders')
      .select('*, plant:plants(id, name, species, main_photo_url)')
      .eq('plant_id', plantId)
      .eq('user_id', userId)
      .order('next_reminder_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []) as Reminder[]
  },

  async createReminder(
    plantId: string,
    userId: string,
    type: ReminderType,
    frequencyDays: number
  ): Promise<Reminder> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        plant_id: plantId,
        user_id: userId,
        reminder_type: type,
        frequency_days: frequencyDays,
        next_reminder_at: calculateNextReminder(frequencyDays),
        is_active: true,
      })
      .select('*, plant:plants(id, name, species, main_photo_url)')
      .single()

    if (error) throw new Error(error.message)
    return data as Reminder
  },

  async updateNextReminder(reminderId: string, frequencyDays: number): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('reminders')
      .update({ next_reminder_at: calculateNextReminder(frequencyDays) })
      .eq('id', reminderId)

    if (error) throw new Error(error.message)
  },

  async findActiveReminderByType(
    plantId: string,
    userId: string,
    reminderType: ReminderType
  ): Promise<Reminder | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('plant_id', plantId)
      .eq('user_id', userId)
      .eq('reminder_type', reminderType)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data as Reminder | null
  },

  async deleteReminder(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('reminders').delete().eq('id', id)

    if (error) throw new Error(error.message)
  },

  async toggleReminder(id: string, isActive: boolean): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('reminders')
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}
