import { createClient } from '@/lib/supabase/client'
import type { LightMeasurement, LightLevel } from '../types'

export const measurementsService = {
  /**
   * Obtiene todas las mediciones de luz del usuario
   */
  async getMeasurements(userId: string): Promise<LightMeasurement[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('light_readings')
      .select('*')
      .eq('user_id', userId)
      .order('measured_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  /**
   * Obtiene las mediciones de una planta específica
   */
  async getPlantMeasurements(plantId: string): Promise<LightMeasurement[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('light_readings')
      .select('*')
      .eq('plant_id', plantId)
      .order('measured_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  /**
   * Crea una nueva medición de luz
   */
  async createMeasurement(
    userId: string,
    lux: number,
    level: LightLevel,
    location?: string,
    recommendation?: string,
    plantId?: string
  ): Promise<LightMeasurement> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('light_readings')
      .insert({
        user_id: userId,
        plant_id: plantId ?? null,
        lux_value: lux,
        light_level: level,
        location_description: location ?? null,
        recommendation: recommendation ?? null,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  /**
   * Elimina una medición
   */
  async deleteMeasurement(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('light_readings')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },

  /**
   * Obtiene la última medición de una planta
   */
  async getLatestPlantMeasurement(plantId: string): Promise<LightMeasurement | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('light_readings')
      .select('*')
      .eq('plant_id', plantId)
      .order('measured_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }
    return data
  },

  /**
   * Obtiene estadísticas de luz de una planta
   */
  async getPlantLightStats(plantId: string): Promise<{
    average: number
    min: number
    max: number
    count: number
  } | null> {
    const measurements = await this.getPlantMeasurements(plantId)

    if (measurements.length === 0) return null

    const luxValues = measurements.map(m => m.lux_value)
    return {
      average: Math.round(luxValues.reduce((a, b) => a + b, 0) / luxValues.length),
      min: Math.min(...luxValues),
      max: Math.max(...luxValues),
      count: measurements.length,
    }
  },
}
