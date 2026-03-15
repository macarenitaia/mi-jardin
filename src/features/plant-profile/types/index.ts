export type CareType = 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'treatment' | 'other'

export interface PlantPhoto {
  id: string
  plant_id: string
  user_id: string
  photo_url: string
  taken_at: string
  notes?: string
}

export interface CareLog {
  id: string
  plant_id: string
  user_id: string
  care_type: CareType
  notes?: string
  performed_at: string
}
