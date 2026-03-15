import type { LightLevel, LightRecommendation } from '../types'

/**
 * Clasificación de niveles de luz en lux
 */
export const LIGHT_LEVELS = {
  muy_baja: { min: 0, max: 500, label: 'Sombra profunda', color: 'gray' },
  baja: { min: 500, max: 1000, label: 'Sombra parcial', color: 'blue' },
  media: { min: 1000, max: 5000, label: 'Luz indirecta brillante', color: 'green' },
  alta: { min: 5000, max: 20000, label: 'Luz directa filtrada', color: 'yellow' },
  muy_alta: { min: 20000, max: Infinity, label: 'Sol directo', color: 'orange' },
} as const

/**
 * Recomendaciones de plantas por nivel de luz
 */
export const PLANT_RECOMMENDATIONS: LightRecommendation[] = [
  {
    plantType: 'Plantas de sombra',
    minLux: 0,
    maxLux: 1000,
    recommendation: 'Ideal para espacios interiores con poca luz natural',
    examples: ['Helechos', 'Pothos', 'Sansevieria', 'Calathea', 'Aglaonema'],
  },
  {
    plantType: 'Plantas de luz indirecta',
    minLux: 1000,
    maxLux: 5000,
    recommendation: 'Perfectas para cerca de ventanas sin sol directo',
    examples: ['Monstera', 'Filodendro', 'Pilea', 'Ficus', 'Orquídeas'],
  },
  {
    plantType: 'Plantas de sol parcial',
    minLux: 5000,
    maxLux: 20000,
    recommendation: 'Requieren algunas horas de sol directo al día',
    examples: ['Suculentas', 'Cactus', 'Albahaca', 'Menta', 'Perejil'],
  },
  {
    plantType: 'Plantas de pleno sol',
    minLux: 20000,
    maxLux: Infinity,
    recommendation: 'Necesitan sol directo la mayor parte del día',
    examples: ['Tomates', 'Pimientos', 'Romero', 'Lavanda', 'Crasas'],
  },
]

/**
 * Clasifica un valor de lux en un nivel de luz
 */
export function classifyLightLevel(lux: number): LightLevel {
  if (lux < 500) return 'muy_baja'
  if (lux < 1000) return 'baja'
  if (lux < 5000) return 'media'
  if (lux < 20000) return 'alta'
  return 'muy_alta'
}

/**
 * Obtiene la configuración de un nivel de luz
 */
export function getLightLevelConfig(level: LightLevel) {
  return LIGHT_LEVELS[level]
}

/**
 * Obtiene recomendaciones de plantas para un nivel de luz específico
 */
export function getRecommendationsForLight(lux: number): LightRecommendation[] {
  return PLANT_RECOMMENDATIONS.filter(
    (rec) => lux >= rec.minLux && lux < rec.maxLux
  )
}

/**
 * Genera un mensaje de recomendación basado en el nivel de luz
 */
export function generateRecommendation(lux: number, level: LightLevel): string {
  const config = getLightLevelConfig(level)
  const recommendations = getRecommendationsForLight(lux)

  if (recommendations.length === 0) {
    return `Nivel de luz: ${config.label} (${lux} lux)`
  }

  const primaryRec = recommendations[0]
  return `${config.label} - ${primaryRec.recommendation}`
}

/**
 * Obtiene el color asociado a un nivel de luz para UI
 */
export function getLightLevelColor(level: LightLevel): {
  bg: string
  border: string
  text: string
  gradient: string
} {
  const colorMap = {
    muy_baja: {
      bg: 'bg-gray-400',
      border: 'border-gray-500',
      text: 'text-gray-900',
      gradient: 'from-gray-300 to-gray-500',
    },
    baja: {
      bg: 'bg-blue-400',
      border: 'border-blue-600',
      text: 'text-blue-900',
      gradient: 'from-blue-300 to-blue-500',
    },
    media: {
      bg: 'bg-green-400',
      border: 'border-green-600',
      text: 'text-green-900',
      gradient: 'from-green-300 to-green-500',
    },
    alta: {
      bg: 'bg-yellow-400',
      border: 'border-yellow-600',
      text: 'text-yellow-900',
      gradient: 'from-yellow-300 to-yellow-500',
    },
    muy_alta: {
      bg: 'bg-orange-400',
      border: 'border-orange-600',
      text: 'text-orange-900',
      gradient: 'from-orange-300 to-orange-500',
    },
  }

  return colorMap[level]
}
