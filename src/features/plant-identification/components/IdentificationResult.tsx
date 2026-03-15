'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Droplets, Sun, Wind, Star, ChevronDown, ChevronUp, Leaf } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { GlassCard } from '@/shared/components/GlassCard'
import { GlassButton } from '@/shared/components/GlassButton'
import { plantsService } from '@/features/garden-library/services/plantsService'
import { createClient } from '@/lib/supabase/client'
import type { IdentificationResult } from '../types'

interface IdentificationResultProps {
  result: IdentificationResult
  onReset: () => void
}

const confidenceConfig = {
  alta: { label: 'Alta confianza', className: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' },
  media: { label: 'Confianza media', className: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300' },
  baja: { label: 'Baja confianza', className: 'bg-red-500/20 border-red-400/40 text-red-300' },
}

const difficultyConfig = {
  fácil: { label: 'Fácil', className: 'text-emerald-400' },
  moderada: { label: 'Moderada', className: 'text-yellow-400' },
  difícil: { label: 'Difícil', className: 'text-red-400' },
}

const LOCATION_OPTIONS = [
  { value: 'sala', label: 'Sala' },
  { value: 'terraza', label: 'Terraza' },
  { value: 'balcón', label: 'Balcón' },
  { value: 'jardín', label: 'Jardín' },
  { value: 'otro', label: 'Otro' },
]

export function IdentificationResult({ result, onReset }: IdentificationResultProps) {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [customName, setCustomName] = useState(result.commonName)
  const [location, setLocation] = useState('sala')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const conf = confidenceConfig[result.confidence]
  const diff = difficultyConfig[result.difficulty]

  const handleAddToGarden = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setSaveError('Debes iniciar sesión para guardar plantas')
        return
      }

      await plantsService.createPlant(user.id, {
        name: customName.trim() || result.commonName,
        species: result.scientificName,
        location,
        watering_frequency_days: result.wateringFrequencyDays,
        notes: `${result.description}\n\nCuidados: ${result.careNotes}`,
      })

      router.push('/plants')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar la planta'
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <GlassCard className="p-6" highlight>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white truncate">{result.commonName}</h2>
            <p className="text-white/50 italic text-sm mt-0.5">{result.scientificName}</p>
          </div>
          <span
            className={cn(
              'shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border',
              conf.className
            )}
          >
            {conf.label}
          </span>
        </div>

        <p className="text-white/70 text-sm leading-relaxed">{result.description}</p>
      </GlassCard>

      {/* Care grid */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-white/50 text-xs uppercase tracking-wide">Riego</span>
          </div>
          <p className="text-white text-sm font-medium">{result.wateringFrequency}</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-white/50 text-xs uppercase tracking-wide">Luz</span>
          </div>
          <p className="text-white text-sm font-medium">{result.sunlight}</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-teal-400" />
            <span className="text-white/50 text-xs uppercase tracking-wide">Humedad</span>
          </div>
          <p className="text-white text-sm font-medium">{result.humidity}</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-white/50 text-xs uppercase tracking-wide">Dificultad</span>
          </div>
          <p className={cn('text-sm font-medium', diff.className)}>{diff.label}</p>
        </GlassCard>
      </div>

      {/* Care notes */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <h3 className="text-white font-semibold text-sm">Cuidados principales</h3>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">{result.careNotes}</p>
      </GlassCard>

      {/* Common problems */}
      {result.commonProblems.length > 0 && (
        <GlassCard className="p-5">
          <h3 className="text-white font-semibold text-sm mb-3">Problemas frecuentes</h3>
          <ul className="space-y-2">
            {result.commonProblems.map((problem, i) => (
              <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                <span>{problem}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Add to garden form */}
      {showAddForm && (
        <GlassCard className="p-5" highlight>
          <h3 className="text-white font-semibold mb-4">Añadir a mi jardín</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Nombre personalizado</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-white/[0.08] border border-white/[0.15] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.12] transition-all"
                placeholder={result.commonName}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1.5">Ubicación</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/[0.08] border border-white/[0.15] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.12] transition-all appearance-none cursor-pointer"
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {saveError && (
              <p className="text-red-400 text-xs">{saveError}</p>
            )}

            <div className="flex gap-3 pt-1">
              <GlassButton
                variant="primary"
                size="md"
                loading={isSaving}
                onClick={handleAddToGarden}
                className="flex-1"
              >
                Confirmar
              </GlassButton>
              <GlassButton
                variant="secondary"
                size="md"
                onClick={() => setShowAddForm(false)}
                disabled={isSaving}
              >
                Cancelar
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!showAddForm && (
          <GlassButton
            variant="primary"
            size="md"
            onClick={() => setShowAddForm(true)}
            className="flex-1"
          >
            Añadir a mi jardín
          </GlassButton>
        )}
        <GlassButton
          variant="secondary"
          size="md"
          onClick={onReset}
          className={showAddForm ? 'flex-1' : ''}
        >
          Identificar otra
        </GlassButton>
      </div>
    </div>
  )
}
