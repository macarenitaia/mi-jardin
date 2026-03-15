'use client'

import { useState } from 'react'
import { identificationService } from '../services/identificationService'
import type { IdentificationResult } from '../types'

export function useIdentification() {
  const [result, setResult] = useState<IdentificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const identify = async (imageBase64: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const identified = await identificationService.identifyPlant(imageBase64)
      setResult(identified)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setIsLoading(false)
  }

  return { identify, result, isLoading, error, reset }
}
