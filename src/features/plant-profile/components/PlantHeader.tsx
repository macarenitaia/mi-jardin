'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Leaf,
  MapPin,
  Droplets,
  Sprout,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { GlassButton } from '@/shared/components/GlassButton'
import { glass } from '@/shared/lib/glass'
import { cn } from '@/shared/lib/utils'
import { plantsService } from '@/features/garden-library/services/plantsService'
import { PlantReminders } from '@/features/reminders/components/PlantReminders'
import type { Plant, PlantFormData } from '@/features/garden-library/types'

interface PlantHeaderProps {
  plant: Plant
  userId: string
  onUpdate: () => Promise<void>
}

const inputClass =
  'w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-400/50 transition-all duration-200'
const labelClass = 'block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide'

export function PlantHeader({ plant, userId, onUpdate }: PlantHeaderProps) {
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState<Partial<PlantFormData>>({
    name: plant.name,
    species: plant.species ?? '',
    location: plant.location ?? '',
    pot_size: plant.pot_size ?? '',
    pot_substrate: plant.pot_substrate ?? '',
    watering_frequency_days: plant.watering_frequency_days,
    fertilizing_frequency_days: plant.fertilizing_frequency_days,
    notes: plant.notes ?? '',
  })

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await plantsService.deletePlant(plant.id)
      router.push('/plants')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await plantsService.updatePlant(plant.id, editForm)
      await onUpdate()
      setShowEditModal(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === 'watering_frequency_days' || name === 'fertilizing_frequency_days'
          ? value === ''
            ? undefined
            : parseInt(value)
          : value,
    }))
  }

  return (
    <>
      <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl shadow-xl overflow-hidden">
        {/* Photo */}
        <div className="relative h-48 md:h-64 bg-emerald-500/10">
          {plant.main_photo_url ? (
            <Image
              src={plant.main_photo_url}
              alt={plant.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center">
                <Leaf className="w-10 h-10 text-emerald-400/60" />
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all cursor-pointer"
              aria-label="Editar planta"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm border border-red-400/30 text-red-300 transition-all cursor-pointer"
              aria-label="Borrar planta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 space-y-4">
          {/* Name + species */}
          <div>
            <h1 className="text-white font-bold text-2xl leading-tight">{plant.name}</h1>
            {plant.species && (
              <p className="text-white/50 italic text-sm mt-0.5">{plant.species}</p>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-2">
            {plant.location && (
              <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white/70 text-xs">{plant.location}</span>
              </div>
            )}
            {plant.pot_size && (
              <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1.5">
                <Sprout className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white/70 text-xs capitalize">{plant.pot_size}</span>
              </div>
            )}
            {plant.pot_substrate && (
              <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1.5">
                <span className="text-white/70 text-xs">{plant.pot_substrate}</span>
              </div>
            )}
          </div>

          {/* Frequency badges */}
          <div className="flex flex-wrap gap-2">
            {plant.watering_frequency_days && (
              <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full px-3 py-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-blue-300 text-xs">Riego cada {plant.watering_frequency_days} días</span>
              </div>
            )}
            {plant.fertilizing_frequency_days && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-300 text-xs">Abono cada {plant.fertilizing_frequency_days} días</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {plant.notes && (
            <p className="text-white/50 text-sm leading-relaxed border-t border-white/[0.08] pt-3">
              {plant.notes}
            </p>
          )}

          {/* Reminders */}
          <div className="border-t border-white/[0.08] pt-4">
            <PlantReminders plantId={plant.id} userId={userId} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className={cn(glass.overlay, 'flex items-center justify-center p-4')}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className={cn(glass.modal, 'w-full max-w-lg max-h-[90vh] flex flex-col')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
              <h2 className="text-white font-bold text-lg">Editar planta</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl hover:bg-white/[0.08] text-white/50 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5">
              <form id="edit-plant-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="edit-name">
                    Nombre <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    value={editForm.name ?? ''}
                    onChange={handleEditChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="edit-species">Especie</label>
                  <input id="edit-species" name="species" type="text" value={editForm.species ?? ''} onChange={handleEditChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="edit-location">Ubicación</label>
                  <input id="edit-location" name="location" type="text" value={editForm.location ?? ''} onChange={handleEditChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="edit-pot_size">Tamaño del macetero</label>
                  <select id="edit-pot_size" name="pot_size" value={editForm.pot_size ?? ''} onChange={handleEditChange} className={inputClass}>
                    <option value="">Selecciona tamaño</option>
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                    <option value="muy grande">Muy grande</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="edit-pot_substrate">Sustrato</label>
                  <input id="edit-pot_substrate" name="pot_substrate" type="text" value={editForm.pot_substrate ?? ''} onChange={handleEditChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="edit-watering">Frecuencia de riego (días)</label>
                  <input id="edit-watering" name="watering_frequency_days" type="number" min={1} value={editForm.watering_frequency_days ?? ''} onChange={handleEditChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="edit-fertilizing">Frecuencia de abono (días)</label>
                  <input id="edit-fertilizing" name="fertilizing_frequency_days" type="number" min={1} value={editForm.fertilizing_frequency_days ?? ''} onChange={handleEditChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="edit-notes">Notas</label>
                  <textarea id="edit-notes" name="notes" rows={3} value={editForm.notes ?? ''} onChange={handleEditChange} className={cn(inputClass, 'resize-none')} />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-white/[0.08] flex gap-3 justify-end">
              <GlassButton type="button" variant="secondary" size="sm" onClick={() => setShowEditModal(false)}>
                Cancelar
              </GlassButton>
              <GlassButton type="submit" form="edit-plant-form" size="sm" loading={isSaving}>
                Guardar cambios
              </GlassButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div
          className={cn(glass.overlay, 'flex items-center justify-center p-4')}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className={cn(glass.modal, 'w-full max-w-sm p-6 space-y-4')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg">¿Borrar planta?</h3>
              <p className="text-white/50 text-sm">
                Esta acción eliminará permanentemente <strong className="text-white">{plant.name}</strong> y todos sus registros. No se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3">
              <GlassButton
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </GlassButton>
              <GlassButton
                variant="danger"
                className="flex-1"
                loading={isDeleting}
                onClick={handleDelete}
              >
                Borrar
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
