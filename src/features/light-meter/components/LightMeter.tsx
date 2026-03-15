'use client'

import { useState, useEffect } from 'react'
import { Sun, Save, Leaf, CheckCircle, AlertTriangle, XCircle, MapPin, Lightbulb } from 'lucide-react'
import { GlassCard } from '@/shared/components/GlassCard'
import { GlassButton } from '@/shared/components/GlassButton'
import { cn } from '@/shared/lib/utils'
import { getLightAdequacy, saveLightReadingForPlant, LIGHT_LEVELS_GLASS } from '../services/lightMeterService'
import type { LightLevelKey, LightAdequacyResult } from '../types'
import type { Plant } from '@/features/garden-library/types'

interface LightMeterProps {
  userId: string
  plants: Plant[]
}

const LEVEL_ORDER: LightLevelKey[] = ['very_low', 'low', 'medium', 'high', 'very_high']

export function LightMeter({ userId, plants }: LightMeterProps) {
  const [selectedLightLevel, setSelectedLightLevel] = useState<LightLevelKey | null>(null)
  const [selectedPlantId, setSelectedPlantId] = useState<string>('')
  const [manualPlantName, setManualPlantName] = useState('')
  const [adequacy, setAdequacy] = useState<LightAdequacyResult | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!selectedLightLevel) {
      setAdequacy(null)
      return
    }

    const plant = plants.find((p) => p.id === selectedPlantId)
    const name = plant ? plant.name : manualPlantName

    if (!name) {
      setAdequacy(null)
      return
    }

    const result = getLightAdequacy(selectedLightLevel, name, plant?.species)
    setAdequacy(result)
    setSaveSuccess(false)
  }, [selectedLightLevel, selectedPlantId, manualPlantName, plants])

  async function handleSave() {
    if (!selectedLightLevel || !selectedPlantId) return
    setIsSaving(true)
    try {
      await saveLightReadingForPlant(
        selectedPlantId,
        userId,
        selectedLightLevel,
        adequacy?.message
      )
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error guardando medición de luz:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const activePlantName = selectedPlantId
    ? (plants.find((p) => p.id === selectedPlantId)?.name ?? '')
    : manualPlantName

  const canSave = !!selectedLightLevel && !!selectedPlantId

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Section 1: Light level selector */}
      <GlassCard className="p-5 space-y-4">
        <div>
          <p className="text-white font-semibold mb-1">¿Cuánta luz hay en la ubicación?</p>
          <p className="text-white/40 text-sm">
            Selecciona el nivel que mejor describe la situación actual
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {LEVEL_ORDER.map((key) => {
            const info = LIGHT_LEVELS_GLASS[key]
            const isSelected = selectedLightLevel === key
            return (
              <button
                key={key}
                onClick={() => setSelectedLightLevel(key)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-3xl border p-4 text-center transition-all duration-200 cursor-pointer backdrop-blur-xl',
                  isSelected
                    ? 'border-emerald-400/60 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                    : 'border-white/10 bg-white/[0.05] hover:bg-white/[0.08] hover:border-white/20'
                )}
              >
                <span className="text-3xl">{info.icon}</span>
                <span className={cn('text-sm font-semibold', isSelected ? 'text-emerald-300' : 'text-white')}>
                  {info.label}
                </span>
                <span className={cn('text-xs', isSelected ? 'text-emerald-300/70' : 'text-white/40')}>
                  {info.lux}
                </span>
                <span className={cn('text-xs leading-tight', isSelected ? 'text-emerald-300/60' : 'text-white/30')}>
                  {info.description}
                </span>
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Section 2: Plant selection */}
      <GlassCard className="p-5 space-y-4">
        <div>
          <p className="text-white font-semibold mb-1">¿Para qué planta?</p>
          <p className="text-white/40 text-sm">
            Elige una planta de tu jardín o escribe el nombre manualmente
          </p>
        </div>

        <select
          value={selectedPlantId}
          onChange={(e) => {
            setSelectedPlantId(e.target.value)
            if (e.target.value) setManualPlantName('')
          }}
          className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.12] transition-all"
        >
          <option value="" className="bg-gray-900">
            {plants.length === 0 ? '— Sin plantas en Mi Jardín —' : '— Elige una planta —'}
          </option>
          {plants.map((plant) => (
            <option key={plant.id} value={plant.id} className="bg-gray-900">
              {plant.name}
              {plant.species ? ` (${plant.species})` : ''}
            </option>
          ))}
        </select>

        {!selectedPlantId && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-white/30 text-xs">o escribe el nombre</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>
            <input
              type="text"
              value={manualPlantName}
              onChange={(e) => setManualPlantName(e.target.value)}
              placeholder="Ej: Cactus, Monstera, Helecho..."
              className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.12] transition-all"
            />
          </>
        )}

        {selectedPlantId && (
          <button
            onClick={() => setSelectedPlantId('')}
            className="text-white/30 text-xs hover:text-white/50 transition-colors cursor-pointer"
          >
            Limpiar selección
          </button>
        )}
      </GlassCard>

      {/* Recommendation */}
      {adequacy && activePlantName && (
        <div className="space-y-4">
          <AdequacyCard adequacy={adequacy} plantName={activePlantName} />

          {canSave && (
            <GlassButton variant="secondary" onClick={handleSave} loading={isSaving} className="w-full">
              <span className="flex items-center gap-2 justify-center">
                <Save className="w-4 h-4" />
                Guardar medición
              </span>
            </GlassButton>
          )}

          {!canSave && activePlantName && (
            <p className="text-white/30 text-xs text-center">
              <Leaf className="w-3 h-3 inline mr-1" />
              Selecciona una planta de tu jardín para guardar la medición
            </p>
          )}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl px-4 py-3 text-emerald-300 text-sm text-center">
          ✓ Medición de luz guardada correctamente
        </div>
      )}
    </div>
  )
}

function AdequacyCard({
  adequacy,
  plantName,
}: {
  adequacy: LightAdequacyResult
  plantName: string
}) {
  const { isAdequate, message, tip, suggestedLocation } = adequacy

  const isExcessive =
    !isAdequate &&
    (message.toLowerCase().includes('directo') ||
      message.toLowerCase().includes('intenso') ||
      message.toLowerCase().includes('quem') ||
      message.toLowerCase().includes('march'))

  const colorClasses = isAdequate
    ? 'bg-emerald-500/10 border-emerald-400/30'
    : isExcessive
    ? 'bg-red-500/10 border-red-400/30'
    : 'bg-amber-500/10 border-amber-400/30'

  const textClasses = isAdequate
    ? 'text-emerald-300'
    : isExcessive
    ? 'text-red-300'
    : 'text-amber-300'

  const Icon = isAdequate ? CheckCircle : isExcessive ? XCircle : AlertTriangle

  return (
    <div className={cn('rounded-3xl border p-5 space-y-4 backdrop-blur-xl', colorClasses)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', textClasses)} />
        <div>
          <p className={cn('text-xs uppercase tracking-wide mb-1 opacity-70', textClasses)}>
            {plantName}
          </p>
          <p className={cn('font-semibold text-sm', textClasses)}>{message}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
        <p className="text-white/60 text-sm">{tip}</p>
      </div>

      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
        <p className="text-white/50 text-sm">{suggestedLocation}</p>
      </div>
    </div>
  )
}
