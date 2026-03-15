export interface Plant {
  id: string
  user_id: string
  name: string
  species?: string
  acquired_at?: string
  location?: string
  pot_size?: string
  pot_substrate?: string
  watering_frequency_days?: number
  fertilizing_frequency_days?: number
  main_photo_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface PlantFormData {
  name: string
  species?: string
  location?: string
  pot_size?: string
  pot_substrate?: string
  watering_frequency_days?: number
  fertilizing_frequency_days?: number
  notes?: string
  acquired_at?: string
}
