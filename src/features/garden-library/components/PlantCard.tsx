'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Leaf, Droplets } from 'lucide-react'
import { GlassCard } from '@/shared/components/GlassCard'
import { cn } from '@/shared/lib/utils'
import type { Plant } from '../types'

interface PlantCardProps {
  plant: Plant
  className?: string
}

export function PlantCard({ plant, className }: PlantCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/plants/${plant.id}`)
  }

  return (
    <GlassCard
      hover
      onClick={handleClick}
      className={cn('flex flex-col overflow-hidden', className)}
    >
      {/* Photo */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl bg-emerald-500/10">
        {plant.main_photo_url ? (
          <Image
            src={plant.main_photo_url}
            alt={plant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/20">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-white font-semibold text-sm leading-tight line-clamp-1">{plant.name}</p>
        {plant.species && (
          <p className="text-white/50 text-xs italic line-clamp-1">{plant.species}</p>
        )}

        {/* Watering badge */}
        {plant.watering_frequency_days && (
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-400/20 rounded-full px-2.5 py-0.5">
              <Droplets className="w-3 h-3 text-blue-300" />
              <span className="text-blue-300 text-xs">
                Cada {plant.watering_frequency_days}d
              </span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
