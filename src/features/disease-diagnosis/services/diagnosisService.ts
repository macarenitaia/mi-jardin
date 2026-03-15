import { createClient } from '@/lib/supabase/client'
import type { DiagnosisResult, SavedDiagnosis } from '../types'

export const diagnosisService = {
  async diagnoseDisease(imageBase64: string, plantName?: string): Promise<DiagnosisResult> {
    const response = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, plantName }),
    })

    if (!response.ok) {
      const data = (await response.json()) as { error?: string }
      throw new Error(data.error ?? 'Error al diagnosticar la planta')
    }

    const data = (await response.json()) as { result: DiagnosisResult }
    return data.result
  },

  async saveDiagnosis(
    userId: string,
    result: DiagnosisResult,
    photoUrl: string,
    plantId?: string
  ): Promise<SavedDiagnosis> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('diagnoses')
      .insert({
        user_id: userId,
        plant_id: plantId ?? null,
        photo_url: photoUrl,
        diagnosis_result: result,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as SavedDiagnosis
  },

  async getPlantDiagnoses(plantId: string): Promise<SavedDiagnosis[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('plant_id', plantId)
      .order('diagnosed_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return (data ?? []) as SavedDiagnosis[]
  },
}
