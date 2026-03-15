'use client'

import { useState } from 'react'
import { diagnosisService } from '../services/diagnosisService'
import type { DiagnosisResult } from '../types'

export function useDiagnosis() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const diagnose = async (imageBase64: string, plantName?: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const diagnosed = await diagnosisService.diagnoseDisease(imageBase64, plantName)
      setResult(diagnosed)
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

  return { diagnose, result, isLoading, error, reset }
}
