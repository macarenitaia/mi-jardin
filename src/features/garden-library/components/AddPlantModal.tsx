'use client'

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { X } from 'lucide-react'
import { GlassButton } from '@/shared/components/GlassButton'
import { PhotoUploader, type UploadedPhoto } from '@/shared/components/PhotoUploader'
import { glass } from '@/shared/lib/glass'
import { cn } from '@/shared/lib/utils'
import type { PlantFormData } from '../types'

const plantSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  species: z.string().optional(),
  location: z.string().optional(),
  pot_size: z.string().optional(),
  pot_substrate: z.string().optional(),
  watering_frequency_days: z.coerce.number().int().positive().optional().or(z.literal('')),
  fertilizing_frequency_days: z.coerce.number().int().positive().optional().or(z.literal('')),
  notes: z.string().optional(),
  acquired_at: z.string().optional(),
})

type FormState = {
  name: string
  species: string
  location: string
  pot_size: string
  pot_substrate: string
  watering_frequency_days: string
  fertilizing_frequency_days: string
  notes: string
  acquired_at: string
}

interface AddPlantModalProps {
  onClose: () => void
  onAdd: (data: PlantFormData, photoFile?: File) => Promise<void>
}

const inputClass =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all duration-200'

const selectClass =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all duration-200 [&>option]:bg-gray-900 [&>option]:text-white'

const labelClass = 'block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide'

export function AddPlantModal({ onClose, onAdd }: AddPlantModalProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    species: '',
    location: '',
    pot_size: '',
    pot_substrate: '',
    watering_frequency_days: '',
    fertilizing_frequency_days: '',
    notes: '',
    acquired_at: '',
  })
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handlePhotoChange = useCallback((p: UploadedPhoto | null) => {
    setPhoto(p)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const parsed = plantSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    const { watering_frequency_days, fertilizing_frequency_days, ...rest } = form
    const data: PlantFormData = {
      name: rest.name,
      species: rest.species || undefined,
      location: rest.location || undefined,
      pot_size: rest.pot_size || undefined,
      pot_substrate: rest.pot_substrate || undefined,
      notes: rest.notes || undefined,
      acquired_at: rest.acquired_at || undefined,
      watering_frequency_days: watering_frequency_days
        ? parseInt(watering_frequency_days)
        : undefined,
      fertilizing_frequency_days: fertilizing_frequency_days
        ? parseInt(fertilizing_frequency_days)
        : undefined,
    }

    setIsSubmitting(true)
    try {
      await onAdd(data, photo?.file)
      onClose()
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Error al guardar la planta' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn(glass.overlay, 'flex items-center justify-center p-4')} onClick={onClose}>
      <div
        className={cn(glass.modal, 'w-full max-w-lg max-h-[90vh] flex flex-col')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <h2 className="text-white font-bold text-lg">Nueva planta</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/[0.08] text-white/50 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form id="add-plant-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Photo */}
            <div>
              <label className={labelClass}>Foto principal</label>
              <PhotoUploader
                onPhotoChange={handlePhotoChange}
                placeholder="Sube una foto de tu planta"
                className="max-w-[180px]"
              />
            </div>

            {/* Name */}
            <div>
              <label className={labelClass} htmlFor="name">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. Monstruo de Adán"
                className={inputClass}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Species */}
            <div>
              <label className={labelClass} htmlFor="species">
                Especie
              </label>
              <input
                id="species"
                name="species"
                type="text"
                value={form.species}
                onChange={handleChange}
                placeholder="Ej. Monstera deliciosa"
                className={inputClass}
              />
            </div>

            {/* Location */}
            <div>
              <label className={labelClass} htmlFor="location">
                Ubicación
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="Ej. Salón, junto a la ventana"
                className={inputClass}
              />
            </div>

            {/* Pot size */}
            <div>
              <label className={labelClass} htmlFor="pot_size">
                Tamaño del macetero
              </label>
              <select
                id="pot_size"
                name="pot_size"
                value={form.pot_size}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Selecciona tamaño</option>
                <option value="pequeño">Pequeño (hasta 15cm)</option>
                <option value="mediano">Mediano (15-25cm)</option>
                <option value="grande">Grande (25-40cm)</option>
                <option value="muy grande">Muy grande (+40cm)</option>
              </select>
            </div>

            {/* Substrate */}
            <div>
              <label className={labelClass} htmlFor="pot_substrate">
                Sustrato
              </label>
              <input
                id="pot_substrate"
                name="pot_substrate"
                type="text"
                value={form.pot_substrate}
                onChange={handleChange}
                placeholder="Ej. Universal + perlita"
                className={inputClass}
              />
            </div>

            {/* Watering frequency */}
            <div>
              <label className={labelClass} htmlFor="watering_frequency_days">
                Frecuencia de riego (días)
              </label>
              <input
                id="watering_frequency_days"
                name="watering_frequency_days"
                type="number"
                min={1}
                value={form.watering_frequency_days}
                onChange={handleChange}
                placeholder="Ej. 7"
                className={inputClass}
              />
            </div>

            {/* Fertilizing frequency */}
            <div>
              <label className={labelClass} htmlFor="fertilizing_frequency_days">
                Frecuencia de abono (días)
              </label>
              <input
                id="fertilizing_frequency_days"
                name="fertilizing_frequency_days"
                type="number"
                min={1}
                value={form.fertilizing_frequency_days}
                onChange={handleChange}
                placeholder="Ej. 30"
                className={inputClass}
              />
            </div>

            {/* Acquired at */}
            <div>
              <label className={labelClass} htmlFor="acquired_at">
                Fecha de adquisición
              </label>
              <input
                id="acquired_at"
                name="acquired_at"
                type="date"
                value={form.acquired_at}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass} htmlFor="notes">
                Notas
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Observaciones sobre la planta..."
                className={cn(inputClass, 'resize-none')}
              />
            </div>

            {errors.form && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
                {errors.form}
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex gap-3 justify-end">
          <GlassButton type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </GlassButton>
          <GlassButton
            type="submit"
            form="add-plant-form"
            size="sm"
            loading={isSubmitting}
          >
            Añadir planta
          </GlassButton>
        </div>
      </div>
    </div>
  )
}
