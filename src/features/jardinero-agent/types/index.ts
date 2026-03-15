// Chat types
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  toolInvocations?: ToolInvocation[]
  createdAt?: Date
}

export interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  state: 'call' | 'result'
  result?: unknown
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  messages: Message[]
  created_at: string
  updated_at: string
}

// Tool result types
export interface JardineroToolResult {
  success: boolean
  data?: unknown
  message: string
}

export interface PlantSummary {
  id: string
  name: string
  species?: string
  watering_frequency_days?: number
  location?: string
}

export interface CareLogEntry {
  id: string
  care_type: string
  notes?: string
  performed_at: string
}

export interface ReminderWithPlant {
  id: string
  reminder_type: string
  frequency_days: number
  next_reminder_at: string
  is_active: boolean
  plant: {
    id: string
    name: string
    species?: string
  }
  daysUntil: number
}
