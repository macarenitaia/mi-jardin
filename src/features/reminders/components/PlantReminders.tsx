'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, Plus, X, Droplets, Leaf, Scissors, Package, MoreHorizontal, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { GlassButton } from '@/shared/components/GlassButton'
import { glass } from '@/shared/lib/glass'
import { remindersService } from '../services/remindersService'
import type { Reminder, ReminderType } from '../types'

interface PlantRemindersProps {
  plantId: string
  userId: string
}

const REMINDER_OPTIONS: { value: ReminderType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { value: 'watering', label: 'Riego', icon: Droplets, color: 'text-blue-300' },
  { value: 'fertilizing', label: 'Abono', icon: Leaf, color: 'text-emerald-300' },
  { value: 'pruning', label: 'Poda', icon: Scissors, color: 'text-amber-300' },
  { value: 'repotting', label: 'Trasplante', icon: Package, color: 'text-orange-300' },
  { value: 'other', label: 'Otro', icon: MoreHorizontal, color: 'text-white/60' },
]

const ICON_MAP: Record<ReminderType, React.ComponentType<{ className?: string }>> = {
  watering: Droplets,
  fertilizing: Leaf,
  pruning: Scissors,
  repotting: Package,
  other: MoreHorizontal,
}

const COLOR_MAP: Record<ReminderType, string> = {
  watering: 'text-blue-300',
  fertilizing: 'text-emerald-300',
  pruning: 'text-amber-300',
  repotting: 'text-orange-300',
  other: 'text-white/60',
}

const LABEL_MAP: Record<ReminderType, string> = {
  watering: 'Riego',
  fertilizing: 'Abono',
  pruning: 'Poda',
  repotting: 'Trasplante',
  other: 'Otro',
}

function daysUntilLabel(nextReminderAt: string): string {
  const now = new Date()
  const next = new Date(nextReminderAt)
  const diffMs = next.getTime() - now.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (days < 0) return `Vencido hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''}`
  if (days === 0) return '¡Hoy!'
  return `En ${days} día${days !== 1 ? 's' : ''}`
}

const inputClass =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-400/50 transition-all duration-200'

export function PlantReminders({ plantId, userId }: PlantRemindersProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<ReminderType>('watering')
  const [formFrequency, setFormFrequency] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchReminders = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await remindersService.getPlantReminders(plantId, userId)
      setReminders(data)
    } catch {
      // silently fail
    } finally {
      setIsLoading(false)
    }
  }, [plantId, userId])

  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const days = parseInt(formFrequency)
    if (!days || days < 1) return
    setIsSaving(true)
    try {
      const reminder = await remindersService.createReminder(plantId, userId, formType, days)
      setReminders((prev) => [...prev, reminder])
      setShowForm(false)
      setFormFrequency('')
      setFormType('watering')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await remindersService.deleteReminder(id)
      setReminders((prev) => prev.filter((r) => r.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const activeReminders = reminders.filter((r) => r.is_active)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-white/40" />
          <h3 className="text-white/60 text-xs font-medium uppercase tracking-wide">Recordatorios</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium',
            'bg-emerald-500/10 border border-emerald-400/20 text-emerald-300',
            'hover:bg-emerald-500/20 hover:border-emerald-400/40',
            'transition-all duration-200 cursor-pointer'
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-white/[0.04] rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && activeReminders.length === 0 && (
        <p className="text-white/30 text-xs py-2">
          Sin recordatorios activos. Añade uno para no olvidar el cuidado de tu planta.
        </p>
      )}

      {/* Reminder list */}
      {!isLoading && activeReminders.length > 0 && (
        <div className="space-y-2">
          {activeReminders.map((reminder) => {
            const Icon = ICON_MAP[reminder.reminder_type]
            const iconColor = COLOR_MAP[reminder.reminder_type]
            const label = LABEL_MAP[reminder.reminder_type]
            const isDeleting = deletingId === reminder.id

            return (
              <div
                key={reminder.id}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5"
              >
                <Icon className={cn('w-4 h-4 shrink-0', iconColor)} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-medium">{label}</p>
                  <p className="text-white/40 text-xs">
                    Cada {reminder.frequency_days} días · {daysUntilLabel(reminder.next_reminder_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(reminder.id)}
                  disabled={isDeleting}
                  className="p-1 rounded-lg text-white/30 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer disabled:opacity-40"
                  aria-label="Eliminar recordatorio"
                >
                  {isDeleting ? (
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Reminder Modal */}
      {showForm && (
        <div
          className={cn(glass.overlay, 'flex items-center justify-center p-4')}
          onClick={() => setShowForm(false)}
        >
          <div
            className={cn(glass.modal, 'w-full max-w-sm p-6 space-y-5')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base">Añadir recordatorio</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl hover:bg-white/[0.08] text-white/50 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wide">
                  Tipo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REMINDER_OPTIONS.map((opt) => {
                    const OptIcon = opt.icon
                    const isSelected = formType === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormType(opt.value)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer',
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400/40 text-white'
                            : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white'
                        )}
                      >
                        <OptIcon className={cn('w-4 h-4', isSelected ? opt.color : 'text-current')} />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="reminder-frequency"
                  className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide"
                >
                  Frecuencia (días)
                </label>
                <input
                  id="reminder-frequency"
                  type="number"
                  min={1}
                  max={365}
                  value={formFrequency}
                  onChange={(e) => setFormFrequency(e.target.value)}
                  placeholder="Ej: 7"
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex gap-3 pt-1">
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </GlassButton>
                <GlassButton type="submit" size="sm" className="flex-1" loading={isSaving}>
                  Guardar
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
