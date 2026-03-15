'use client'

import { Droplets, Calendar, CheckCircle } from 'lucide-react'
import { GlassCard } from '@/shared/components/GlassCard'
import { GlassButton } from '@/shared/components/GlassButton'
import type { WateringResult } from '../types'

interface WateringResultCardProps {
  result: WateringResult
  plantName: string
  plantId?: string
  onSaveToPlant?: () => Promise<void>
  isSaving?: boolean
}

function formatNextWatering(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function WateringResultCard({
  result,
  plantName,
  plantId,
  onSaveToPlant,
  isSaving = false,
}: WateringResultCardProps) {
  return (
    <GlassCard className="p-6 space-y-6" highlight>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide">Resultado para</p>
          <p className="text-white font-semibold">{plantName}</p>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4 text-center">
          <p className="text-5xl font-bold text-blue-300 leading-none">{result.frequencyDays}</p>
          <p className="text-blue-300/70 text-sm mt-2">
            {result.frequencyDays === 1 ? 'día entre riegos' : 'días entre riegos'}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-4 text-center">
          <p className="text-5xl font-bold text-emerald-300 leading-none">{result.amountMl}</p>
          <p className="text-emerald-300/70 text-sm mt-2">ml por riego</p>
        </div>
      </div>

      {/* Next watering date */}
      <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3">
        <Calendar className="w-4 h-4 text-white/40 shrink-0" />
        <div>
          <p className="text-white/40 text-xs">Próximo riego</p>
          <p className="text-white text-sm font-medium capitalize">
            {formatNextWatering(result.nextWatering)}
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-2">
        <p className="text-white/50 text-xs uppercase tracking-wide">Consejos</p>
        <ul className="space-y-2">
          {result.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <Droplets className="w-4 h-4 text-blue-400/60 shrink-0 mt-0.5" />
              <span className="text-white/70 text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Save button */}
      {plantId && onSaveToPlant && (
        <GlassButton
          variant="secondary"
          onClick={onSaveToPlant}
          loading={isSaving}
          className="w-full"
        >
          <span className="flex items-center gap-2 justify-center">
            <CheckCircle className="w-4 h-4" />
            Guardar en perfil de planta
          </span>
        </GlassButton>
      )}
    </GlassCard>
  )
}
