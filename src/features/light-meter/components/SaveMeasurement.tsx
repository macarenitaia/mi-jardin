'use client'

import { useState } from 'react'
import type { LightLevel } from '../types'
import type { Plant } from '@/features/garden-library/types'

interface SaveMeasurementProps {
  lux: number
  level: LightLevel
  recommendation: string
  plants: Plant[]
  onSave: (
    lux: number,
    level: LightLevel,
    location: string,
    recommendation: string,
    plantId?: string
  ) => Promise<void>
}

export function SaveMeasurement({
  lux,
  level,
  recommendation,
  plants,
  onSave,
}: SaveMeasurementProps) {
  const [location, setLocation] = useState('')
  const [selectedPlantId, setSelectedPlantId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await onSave(
        lux,
        level,
        location,
        recommendation,
        selectedPlantId || undefined
      )
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setLocation('')
      setSelectedPlantId('')
    } catch (error) {
      console.error('Error al guardar medición:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-xl font-black text-black mb-4">
        Guardar Medición
      </h3>

      <div className="space-y-4">
        {/* Selector de planta */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Planta (opcional)
          </label>
          <select
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="w-full px-4 py-3 bg-white border-4 border-black rounded-lg font-bold focus:outline-none focus:ring-4 focus:ring-green-400"
          >
            <option value="">Sin planta específica</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Ventana norte, balcón, interior..."
            className="w-full px-4 py-3 bg-white border-4 border-black rounded-lg font-bold focus:outline-none focus:ring-4 focus:ring-green-400"
          />
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          disabled={isSaving || !location}
          className="w-full px-6 py-3 bg-green-400 text-black font-black border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Guardando...' : 'Guardar Medición'}
        </button>

        {/* Mensaje de éxito */}
        {showSuccess && (
          <div className="p-4 bg-green-400 border-4 border-black rounded-lg">
            <p className="text-black font-bold text-center">
              ✓ Medición guardada correctamente
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
