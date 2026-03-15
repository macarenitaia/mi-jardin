import { createClient } from '@/lib/supabase/client'
import type { Plant, PlantFormData } from '../types'

export const plantsService = {
  async getPlants(userId: string): Promise<Plant[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async getPlant(id: string): Promise<Plant | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }
    return data
  },

  async createPlant(userId: string, data: PlantFormData, photoUrl?: string): Promise<Plant> {
    const supabase = createClient()
    const { data: plant, error } = await supabase
      .from('plants')
      .insert({
        user_id: userId,
        name: data.name,
        species: data.species ?? null,
        acquired_at: data.acquired_at ?? null,
        location: data.location ?? null,
        pot_size: data.pot_size ?? null,
        pot_substrate: data.pot_substrate ?? null,
        watering_frequency_days: data.watering_frequency_days ?? null,
        fertilizing_frequency_days: data.fertilizing_frequency_days ?? null,
        notes: data.notes ?? null,
        main_photo_url: photoUrl ?? null,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return plant
  },

  async updatePlant(id: string, data: Partial<PlantFormData> & { main_photo_url?: string }): Promise<Plant> {
    const supabase = createClient()
    const { data: plant, error } = await supabase
      .from('plants')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return plant
  },

  async deletePlant(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('plants').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async uploadPlantPhoto(file: File, userId: string, plantId: string): Promise<string> {
    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/${plantId}/${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('plant-photos').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) throw new Error(error.message)

    const { data } = supabase.storage.from('plant-photos').getPublicUrl(path)
    return data.publicUrl
  },
}
