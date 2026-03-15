'use client'

import { useEffect, useState } from 'react'
import { Droplets, Leaf, Edit3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { plantsService } from '@/features/garden-library/services/plantsService'
import { useWateringCalculator } from '@/features/watering-calculator/hooks/useWateringCalculator'
import { WateringResultCard } from '@/features/watering-calculator/components/WateringResultCard'
import { GlassCard } from '@/shared/components/GlassCard'
import { GlassButton } from '@/shared/components/GlassButton'
import { cn } from '@/shared/lib/utils'
import type { Plant } from '@/features/garden-library/types'

type Mode = 'garden' | 'manual'

const POT_SIZES = ['pequeño', 'mediano', 'grande', 'muy grande']
const POT_SUBSTRATES = ['universal', 'cactus', 'turba', 'orquídeas', 'arena']

export default function WateringPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  if (!userId) {
    return (
      <div className="p-6 lg:p-8 space-y-4">
        <div className="h-8 bg-white/[0.08] rounded-full w-64 animate-pulse" />
        <div className="h-48 bg-white/[0.05] rounded-3xl animate-pulse" />
      </div>
    )
  }

  return <WateringContent userId={userId} />
}

function WateringContent({ userId }: { userId: string }) {
  const [mode, setMode] = useState<Mode>('garden')
  const [plants, setPlants] = useState<Plant[]>([])
  const [loadingPlants, setLoadingPlants] = useState(true)
  const [selectedPlantId, setSelectedPlantId] = useState<string>('')
  const [manualName, setManualName] = useState('')
  const [manualSpecies, setManualSpecies] = useState('')
  const [manualPotSize, setManualPotSize] = useState('mediano')
  const [manualSubstrate, setManualSubstrate] = useState('universal')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [currentPlantName, setCurrentPlantName] = useState('')
  const [currentPlantId, setCurrentPlantId] = useState<string | undefined>()

  const { calculate, result, reset } = useWateringCalculator()

  useEffect(() => {
    plantsService
      .getPlants(userId)
      .then(setPlants)
      .catch(console.error)
      .finally(() => setLoadingPlants(false))
  }, [userId])

  // Auto-calculate when a garden plant is selected
  useEffect(() => {
    if (mode === 'garden' && selectedPlantId) {
      const plant = plants.find((p) => p.id === selectedPlantId)
      if (plant) {
        setCurrentPlantName(plant.name)
        setCurrentPlantId(plant.id)
        calculate({
          name: plant.name,
          species: plant.species,
          potSize: plant.pot_size ?? 'mediano',
          potSubstrate: plant.pot_substrate ?? 'universal',
        })
      }
    } else if (mode === 'garden' && !selectedPlantId) {
      reset()
      setCurrentPlantName('')
      setCurrentPlantId(undefined)
    }
  }, [selectedPlantId, mode, plants]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleModeChange(newMode: Mode) {
    setMode(newMode)
    reset()
    setCurrentPlantName('')
    setCurrentPlantId(undefined)
    setSelectedPlantId('')
    setSaveSuccess(false)
  }

  function handleManualCalculate() {
    if (!manualName) return
    setCurrentPlantName(manualName)
    setCurrentPlantId(undefined)
    calculate({
      name: manualName,
      species: manualSpecies || undefined,
      potSize: manualPotSize,
      potSubstrate: manualSubstrate,
    })
    setSaveSuccess(false)
  }

  async function handleSaveToPlant() {
    if (!currentPlantId || !result) return
    setIsSaving(true)
    try {
      await plantsService.updatePlant(currentPlantId, {
        watering_frequency_days: result.frequencyDays,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error guardando frecuencia de riego:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Calculadora de riego</h1>
          <p className="text-white/40 text-sm">Calcula la frecuencia perfecta para cada planta</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 p-1 bg-white/[0.05] border border-white/10 rounded-2xl">
        <button
          onClick={() => handleModeChange('garden')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
            mode === 'garden'
              ? 'bg-white/[0.12] text-white border border-white/20 shadow'
              : 'text-white/50 hover:text-white/70'
          )}
        >
          <Leaf className="w-4 h-4" />
          Mi jardín
        </button>
        <button
          onClick={() => handleModeChange('manual')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
            mode === 'manual'
              ? 'bg-white/[0.12] text-white border border-white/20 shadow'
              : 'text-white/50 hover:text-white/70'
          )}
        >
          <Edit3 className="w-4 h-4" />
          Manual
        </button>
      </div>

      {/* Garden mode */}
      {mode === 'garden' && (
        <GlassCard className="p-5 space-y-4">
          <p className="text-white/50 text-sm">Selecciona una planta de tu jardín</p>
          {loadingPlants ? (
            <div className="h-10 bg-white/[0.08] rounded-xl animate-pulse" />
          ) : plants.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No tienes plantas en tu jardín todavía</p>
              <p className="text-white/30 text-xs mt-1">Añade plantas en la sección Mi Jardín</p>
            </div>
          ) : (
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.12] transition-all"
            >
              <option value="" className="bg-gray-900">
                — Elige una planta —
              </option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id} className="bg-gray-900">
                  {plant.name}
                  {plant.species ? ` (${plant.species})` : ''}
                </option>
              ))}
            </select>
          )}
        </GlassCard>
      )}

      {/* Manual mode */}
      {mode === 'manual' && (
        <GlassCard className="p-5 space-y-4">
          <p className="text-white/50 text-sm">Introduce los datos de tu planta</p>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs uppercase tracking-wide">
              Nombre de la planta *
            </label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="Ej: Monstera deliciosa"
              className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.12] transition-all"
            />
          </div>

          {/* Species */}
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs uppercase tracking-wide">
              Especie (opcional)
            </label>
            <input
              type="text"
              value={manualSpecies}
              onChange={(e) => setManualSpecies(e.target.value)}
              placeholder="Ej: tropical, cactus, helecho..."
              className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.12] transition-all"
            />
          </div>

          {/* Pot size */}
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs uppercase tracking-wide">Tamaño macetero</label>
            <select
              value={manualPotSize}
              onChange={(e) => setManualPotSize(e.target.value)}
              className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.12] transition-all"
            >
              {POT_SIZES.map((size) => (
                <option key={size} value={size} className="bg-gray-900 capitalize">
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Substrate */}
          <div className="space-y-1.5">
            <label className="text-white/60 text-xs uppercase tracking-wide">Sustrato</label>
            <select
              value={manualSubstrate}
              onChange={(e) => setManualSubstrate(e.target.value)}
              className="w-full bg-white/[0.08] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.12] transition-all"
            >
              {POT_SUBSTRATES.map((sub) => (
                <option key={sub} value={sub} className="bg-gray-900 capitalize">
                  {sub.charAt(0).toUpperCase() + sub.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <GlassButton
            variant="primary"
            onClick={handleManualCalculate}
            disabled={!manualName}
            className="w-full"
          >
            Calcular riego
          </GlassButton>
        </GlassCard>
      )}

      {/* Save success toast */}
      {saveSuccess && (
        <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl px-4 py-3 text-emerald-300 text-sm text-center">
          ✓ Frecuencia de riego guardada en el perfil de la planta
        </div>
      )}

      {/* Result */}
      {result && (
        <WateringResultCard
          result={result}
          plantName={currentPlantName}
          plantId={currentPlantId}
          onSaveToPlant={currentPlantId ? handleSaveToPlant : undefined}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}
