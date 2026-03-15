export type LightLevel = 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta'

export interface LightReading {
  lux: number
  level: LightLevel
  timestamp: Date
}

export interface LightMeasurement {
  id: string
  plant_id: string | null
  lux_value: number
  light_level: LightLevel
  location_description: string | null
  recommendation: string | null
  measured_at: string
  user_id: string
}

export interface LightRecommendation {
  plantType: string
  minLux: number
  maxLux: number
  recommendation: string
  examples: string[]
}

export interface AmbientLightState {
  lux: number | null
  level: LightLevel | null
  isSupported: boolean
  error: string | null
  isReading: boolean
}

// Extended types for liquid glass light meter
export type LightLevelKey = 'very_low' | 'low' | 'medium' | 'high' | 'very_high'

export interface LightLevelInfo {
  label: string
  lux: string
  icon: string
  description: string
}

export interface LightAdequacyResult {
  isAdequate: boolean
  message: string
  tip: string
  suggestedLocation: string
}
