'use client'

import { GlassCard } from '@/shared/components/GlassCard'
import { usePlantProfile } from '../hooks/usePlantProfile'
import { PlantHeader } from './PlantHeader'
import { QuickActions } from './QuickActions'
import { CareLogList } from './CareLogList'
import { PhotoTimeline } from './PhotoTimeline'
import type { CareType } from '../types'

interface PlantProfileClientProps {
  plantId: string
  userId: string
}

export function PlantProfileClient({ plantId, userId }: PlantProfileClientProps) {
  const { plant, photos, careLogs, isLoading, error, addCareLog, addPhoto, refetch } =
    usePlantProfile(plantId, userId)

  const handleCareLog = async (careType: CareType) => {
    await addCareLog(careType)
  }

  const handleAddPhoto = async (file: File) => {
    await addPhoto(file)
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-4">
        {/* Header skeleton */}
        <div className="bg-white/[0.08] border border-white/[0.15] rounded-3xl overflow-hidden animate-pulse">
          <div className="h-48 bg-white/[0.06]" />
          <div className="p-5 space-y-3">
            <div className="h-6 bg-white/[0.08] rounded-full w-2/5" />
            <div className="h-4 bg-white/[0.05] rounded-full w-1/4" />
          </div>
        </div>
        {/* Actions skeleton */}
        <div className="bg-white/[0.08] border border-white/[0.15] rounded-3xl p-4 animate-pulse">
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/[0.06] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !plant) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <p className="text-white font-semibold">Planta no encontrada</p>
          <p className="text-white/50 text-sm">{error ?? 'No se encontró la planta solicitada'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-2xl mx-auto">
      {/* Plant Header */}
      <PlantHeader plant={plant} userId={userId} onUpdate={refetch} />

      {/* Quick Actions */}
      <GlassCard className="p-5 space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide text-white/60">
          Acciones rápidas
        </h2>
        <QuickActions plantId={plantId} userId={userId} onAction={handleCareLog} />
      </GlassCard>

      {/* Care Log */}
      <GlassCard className="p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide text-white/60">
          Historial de cuidados
        </h2>
        <CareLogList careLogs={careLogs} />
      </GlassCard>

      {/* Photo Timeline */}
      <GlassCard className="p-5 space-y-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide text-white/60">
          Galería de fotos
        </h2>
        <PhotoTimeline photos={photos} onAddPhoto={handleAddPhoto} />
      </GlassCard>
    </div>
  )
}
