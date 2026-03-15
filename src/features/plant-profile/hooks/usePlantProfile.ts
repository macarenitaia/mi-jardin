'use client'

import { useState, useEffect, useCallback } from 'react'
import { plantsService } from '@/features/garden-library/services/plantsService'
import { plantProfileService } from '../services/plantProfileService'
import type { Plant } from '@/features/garden-library/types'
import type { PlantPhoto, CareLog, CareType } from '../types'

interface UsePlantProfileReturn {
  plant: Plant | null
  photos: PlantPhoto[]
  careLogs: CareLog[]
  isLoading: boolean
  error: string | null
  addCareLog: (careType: CareType, notes?: string) => Promise<void>
  addPhoto: (file: File, notes?: string) => Promise<void>
  refetch: () => Promise<void>
}

export function usePlantProfile(plantId: string, userId: string): UsePlantProfileReturn {
  const [plant, setPlant] = useState<Plant | null>(null)
  const [photos, setPhotos] = useState<PlantPhoto[]>([])
  const [careLogs, setCareLogs] = useState<CareLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [plantData, photosData, careLogsData] = await Promise.all([
        plantsService.getPlant(plantId),
        plantProfileService.getPlantPhotos(plantId),
        plantProfileService.getCareLogs(plantId),
      ])
      setPlant(plantData)
      setPhotos(photosData)
      setCareLogs(careLogsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el perfil de la planta')
    } finally {
      setIsLoading(false)
    }
  }, [plantId])

  useEffect(() => {
    if (plantId) fetchAll()
  }, [plantId, fetchAll])

  const addCareLog = useCallback(
    async (careType: CareType, notes?: string) => {
      const log = await plantProfileService.addCareLog(plantId, userId, careType, notes)
      setCareLogs((prev) => [log, ...prev])
    },
    [plantId, userId]
  )

  const addPhoto = useCallback(
    async (file: File, notes?: string) => {
      const photoUrl = await plantProfileService.uploadPlantPhoto(file, userId, plantId)
      const photo = await plantProfileService.addPlantPhoto(plantId, userId, photoUrl, notes)
      setPhotos((prev) => [photo, ...prev])
    },
    [plantId, userId]
  )

  return {
    plant,
    photos,
    careLogs,
    isLoading,
    error,
    addCareLog,
    addPhoto,
    refetch: fetchAll,
  }
}
