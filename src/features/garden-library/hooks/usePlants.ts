'use client'

import { useState, useEffect, useCallback } from 'react'
import { plantsService } from '../services/plantsService'
import type { Plant, PlantFormData } from '../types'

export function usePlants(userId: string) {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlants = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await plantsService.getPlants(userId)
      setPlants(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las plantas')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) fetchPlants()
  }, [userId, fetchPlants])

  const createPlant = useCallback(
    async (data: PlantFormData, photoFile?: File): Promise<Plant> => {
      // Create plant first (without photo URL)
      const plant = await plantsService.createPlant(userId, data)

      if (photoFile) {
        // Upload photo now that we have the plant id
        const photoUrl = await plantsService.uploadPlantPhoto(photoFile, userId, plant.id)
        // Update plant with the photo URL
        const updated = await plantsService.updatePlant(plant.id, { ...data, main_photo_url: photoUrl })
        setPlants((prev) => [updated, ...prev])
        return updated
      }

      setPlants((prev) => [plant, ...prev])
      return plant
    },
    [userId]
  )

  const deletePlant = useCallback(async (id: string): Promise<void> => {
    await plantsService.deletePlant(id)
    setPlants((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    plants,
    isLoading,
    error,
    refetch: fetchPlants,
    createPlant,
    deletePlant,
  }
}
