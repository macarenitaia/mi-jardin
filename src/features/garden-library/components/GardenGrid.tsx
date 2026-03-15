'use client'

import { useState } from 'react'
import { Plus, Leaf } from 'lucide-react'
import { GlassButton } from '@/shared/components/GlassButton'
import { cn } from '@/shared/lib/utils'
import { usePlants } from '../hooks/usePlants'
import { PlantCard } from './PlantCard'
import { AddPlantModal } from './AddPlantModal'
import type { PlantFormData } from '../types'

interface GardenGridProps {
  userId: string
}

function SkeletonCard() {
  return (
    <div className="bg-white/[0.08] border border-white/[0.15] rounded-3xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/[0.06]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/[0.08] rounded-full w-3/4" />
        <div className="h-2.5 bg-white/[0.05] rounded-full w-1/2" />
      </div>
    </div>
  )
}

export function GardenGrid({ userId }: GardenGridProps) {
  const { plants, isLoading, error, createPlant } = usePlants(userId)
  const [showModal, setShowModal] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAdd = async (data: PlantFormData, photoFile?: File) => {
    setAddError(null)
    try {
      await createPlant(data, photoFile)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Error al añadir la planta')
      throw err
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-400 text-center">{error}</p>
        <GlassButton variant="secondary" size="sm" onClick={() => window.location.reload()}>
          Reintentar
        </GlassButton>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-emerald-400/60" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">Tu jardín está vacío</p>
            <p className="text-white/50 text-sm mt-1">
              Añade tu primera planta para empezar a cuidarla
            </p>
          </div>
          <GlassButton onClick={() => setShowModal(true)}>Añade tu primera planta</GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      {/* FAB */}
      {!isLoading && plants.length > 0 && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={cn(
            'fixed bottom-8 right-8 z-40',
            'w-14 h-14 rounded-full',
            'bg-gradient-to-br from-emerald-500 to-teal-500',
            'shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
            'border border-emerald-400/40',
            'flex items-center justify-center',
            'hover:-translate-y-0.5 hover:scale-105 active:scale-95',
            'transition-all duration-300 cursor-pointer'
          )}
          aria-label="Añadir planta"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <AddPlantModal
          onClose={() => { setShowModal(false); setAddError(null) }}
          onAdd={handleAdd}
        />
      )}

      {/* Add error toast */}
      {addError && (
        <div className="fixed bottom-24 right-8 z-50 bg-red-500/20 border border-red-400/30 rounded-2xl px-4 py-3 text-red-300 text-sm max-w-xs">
          {addError}
        </div>
      )}
    </div>
  )
}
