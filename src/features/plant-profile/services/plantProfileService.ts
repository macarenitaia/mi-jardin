import { createClient } from '@/lib/supabase/client'
import type { PlantPhoto, CareLog, CareType } from '../types'

export const plantProfileService = {
  async getPlantPhotos(plantId: string): Promise<PlantPhoto[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('plant_photos')
      .select('*')
      .eq('plant_id', plantId)
      .order('taken_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async addPlantPhoto(
    plantId: string,
    userId: string,
    photoUrl: string,
    notes?: string
  ): Promise<PlantPhoto> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('plant_photos')
      .insert({
        plant_id: plantId,
        user_id: userId,
        photo_url: photoUrl,
        taken_at: new Date().toISOString(),
        notes: notes ?? null,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async getCareLogs(plantId: string): Promise<CareLog[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('care_logs')
      .select('*')
      .eq('plant_id', plantId)
      .order('performed_at', { ascending: false })
      .limit(20)

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async addCareLog(
    plantId: string,
    userId: string,
    careType: CareType,
    notes?: string
  ): Promise<CareLog> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('care_logs')
      .insert({
        plant_id: plantId,
        user_id: userId,
        care_type: careType,
        notes: notes ?? null,
        performed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updateMainPhoto(plantId: string, photoUrl: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('plants')
      .update({ main_photo_url: photoUrl, updated_at: new Date().toISOString() })
      .eq('id', plantId)

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
