export type ReminderType = 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'other'

export interface Reminder {
  id: string
  plant_id: string
  user_id: string
  reminder_type: ReminderType
  frequency_days: number
  next_reminder_at: string
  is_active: boolean
  created_at: string
  plant?: {
    id: string
    name: string
    species?: string
    main_photo_url?: string
  }
}

export interface ReminderWithUrgency extends Reminder {
  daysUntil: number
  isOverdue: boolean
}
