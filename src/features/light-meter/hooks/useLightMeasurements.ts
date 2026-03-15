'use client'

import { useState, useCallback } from 'react'
import { measurementsService } from '../services/measurementsService'
import type { LightMeasurement, LightLevel } from '../types'

export function useLightMeasurements(userId: string) {
  const [measurements, setMeasurements] = useState<LightMeasurement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar todas las mediciones del usuario
  const loadMeasurements = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await measurementsService.getMeasurements(userId)
      setMeasurements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mediciones')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Cargar mediciones de una planta específica
  const loadPlantMeasurements = useCallback(async (plantId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await measurementsService.getPlantMeasurements(plantId)
      setMeasurements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mediciones de la planta')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Crear nueva medición
  const createMeasurement = useCallback(
    async (
      lux: number,
      level: LightLevel,
      location?: string,
      recommendation?: string,
      plantId?: string
    ) => {
      try {
        setIsLoading(true)
        setError(null)
        const newMeasurement = await measurementsService.createMeasurement(
          userId,
          lux,
          level,
          location,
          recommendation,
          plantId
        )
        setMeasurements((prev) => [newMeasurement, ...prev])
        return newMeasurement
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al guardar medición')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [userId]
  )

  // Eliminar medición
  const deleteMeasurement = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await measurementsService.deleteMeasurement(id)
      setMeasurements((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar medición')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Obtener estadísticas de luz de una planta
  const getPlantStats = useCallback(async (plantId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      return await measurementsService.getPlantLightStats(plantId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estadísticas')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    measurements,
    isLoading,
    error,
    loadMeasurements,
    loadPlantMeasurements,
    createMeasurement,
    deleteMeasurement,
    getPlantStats,
  }
}
