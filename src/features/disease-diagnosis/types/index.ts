export interface ActionStep {
  step: number
  action: string
  detail: string
}

export interface DiagnosisResult {
  isHealthy: boolean
  disease: string
  severity: 'leve' | 'moderado' | 'grave' | 'ninguno'
  symptoms: string[]
  causes: string[]
  actionPlan: ActionStep[]
  preventionTips: string[]
  urgency: 'inmediata' | 'esta semana' | 'puede esperar' | 'ninguna'
}

export interface SavedDiagnosis {
  id: string
  plant_id: string | null
  user_id: string
  photo_url: string
  diagnosis_result: DiagnosisResult
  diagnosed_at: string
}
