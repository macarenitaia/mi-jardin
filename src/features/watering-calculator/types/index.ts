export interface WateringResult {
  frequencyDays: number
  amountMl: number
  tips: string[]
  nextWatering: string
}

export interface WateringCalculation {
  plantId?: string
  plantName: string
  species?: string
  potSize: string
  potSubstrate: string
  result: WateringResult
  calculatedAt: string
}

export interface PlantInput {
  name: string
  species?: string
  potSize: string
  potSubstrate: string
}
