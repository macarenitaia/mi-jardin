export interface IdentificationResult {
  commonName: string
  scientificName: string
  confidence: 'alta' | 'media' | 'baja'
  description: string
  wateringFrequency: string
  wateringFrequencyDays: number
  sunlight: string
  humidity: string
  difficulty: 'fácil' | 'moderada' | 'difícil'
  careNotes: string
  commonProblems: string[]
}
