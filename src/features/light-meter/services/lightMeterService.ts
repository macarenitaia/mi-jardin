import { createClient } from '@/lib/supabase/client'
import type { LightLevelKey, LightAdequacyResult } from '../types'

export const LIGHT_LEVELS_GLASS = {
  very_low: {
    label: 'Muy baja',
    lux: '< 500 lux',
    icon: '🌑',
    description: 'Interior sin ventanas directas',
  },
  low: {
    label: 'Baja',
    lux: '500-2000 lux',
    icon: '🌒',
    description: 'Interior con ventana lejana',
  },
  medium: {
    label: 'Media',
    lux: '2000-10000 lux',
    icon: '🌓',
    description: 'Junto a ventana orientada al norte',
  },
  high: {
    label: 'Alta',
    lux: '10000-50000 lux',
    icon: '🌔',
    description: 'Junto a ventana sur/este, luz directa breve',
  },
  very_high: {
    label: 'Muy alta',
    lux: '> 50000 lux',
    icon: '☀️',
    description: 'Exterior a pleno sol',
  },
} as const satisfies Record<LightLevelKey, { label: string; lux: string; icon: string; description: string }>

type PlantType = 'cactus' | 'tropical' | 'helecho' | 'orquidea' | 'arbol' | 'hierba' | 'default'

function detectPlantType(name: string, species?: string): PlantType {
  const combined = `${name} ${species ?? ''}`.toLowerCase()
  if (['cactus', 'suculenta', 'succulent', 'aloe'].some((k) => combined.includes(k))) return 'cactus'
  if (
    ['monstera', 'pothos', 'scindapsus', 'philodendron', 'tropical', 'calathea', 'maranta'].some(
      (k) => combined.includes(k)
    )
  )
    return 'tropical'
  if (['helecho', 'fern', 'asplenium', 'nephrolepis'].some((k) => combined.includes(k)))
    return 'helecho'
  if (['orquídea', 'orquidea', 'orchid'].some((k) => combined.includes(k))) return 'orquidea'
  if (['árbol', 'arbol', 'ficus', 'palmera', 'palm', 'bonsai'].some((k) => combined.includes(k)))
    return 'arbol'
  if (
    ['hierba', 'herb', 'albahaca', 'menta', 'perejil', 'romero', 'tomillo'].some((k) =>
      combined.includes(k)
    )
  )
    return 'hierba'
  return 'default'
}

export function getLightAdequacy(
  lightLevel: LightLevelKey,
  plantName: string,
  species?: string
): LightAdequacyResult {
  const plantType = detectPlantType(plantName, species)

  const adequate: LightAdequacyResult = {
    isAdequate: true,
    message: 'La luz actual es ideal para tu planta',
    tip: 'Mantén la planta en esta ubicación y observa su crecimiento',
    suggestedLocation: 'La ubicación actual es perfecta',
  }

  const tooLow: LightAdequacyResult = {
    isAdequate: false,
    message: 'La luz es insuficiente para esta planta',
    tip: 'Mueve tu planta más cerca de una ventana sur o este',
    suggestedLocation: 'Junto a una ventana orientada al sur o al este',
  }

  if (plantType === 'cactus') {
    if (lightLevel === 'high' || lightLevel === 'very_high') return adequate
    if (lightLevel === 'medium') {
      return {
        isAdequate: false,
        message: 'Tu cactus necesita más luz solar directa',
        tip: 'Colócalo en el exterior o junto a la ventana más soleada',
        suggestedLocation: 'Exterior a pleno sol o ventana sur muy soleada',
      }
    }
    return tooLow
  }

  if (plantType === 'tropical') {
    if (lightLevel === 'medium' || lightLevel === 'high') return adequate
    if (lightLevel === 'very_high') {
      return {
        isAdequate: false,
        message: 'El sol directo intenso puede quemar las hojas tropicales',
        tip: 'Usa una cortina traslúcida o aleja la planta del cristal',
        suggestedLocation: 'Interior con luz brillante pero sin sol directo',
      }
    }
    return tooLow
  }

  if (plantType === 'helecho') {
    if (lightLevel === 'low' || lightLevel === 'medium') return adequate
    if (lightLevel === 'high' || lightLevel === 'very_high') {
      return {
        isAdequate: false,
        message: 'Los helechos no toleran el sol directo — las hojas se quemarán',
        tip: 'Coloca el helecho alejado de ventanas directas, en zona de sombra luminosa',
        suggestedLocation: 'Interior umbrío o junto a ventana norte',
      }
    }
    return {
      isAdequate: false,
      message: 'La luz es muy baja incluso para un helecho',
      tip: 'Acércalo un poco más a una fuente de luz natural indirecta',
      suggestedLocation: 'Interior con algo de luz natural filtrada',
    }
  }

  if (plantType === 'orquidea') {
    if (lightLevel === 'medium') return adequate
    if (lightLevel === 'very_low' || lightLevel === 'low') {
      return {
        isAdequate: false,
        message: 'Tu orquídea necesita más luz para florecer',
        tip: 'Acércala a una ventana este con luz matutina suave',
        suggestedLocation: 'Junto a ventana este con luz matutina',
      }
    }
    return {
      isAdequate: false,
      message: 'La luz directa intensa marchitará las flores de la orquídea',
      tip: 'Filtra la luz con una cortina fina o retira la planta del cristal',
      suggestedLocation: 'Ventana norte o ventana este con cortina',
    }
  }

  if (plantType === 'arbol') {
    if (lightLevel === 'medium' || lightLevel === 'high' || lightLevel === 'very_high')
      return adequate
    return tooLow
  }

  if (plantType === 'hierba') {
    if (lightLevel === 'high' || lightLevel === 'very_high') return adequate
    if (lightLevel === 'medium') {
      return {
        isAdequate: false,
        message: 'Las hierbas aromáticas prefieren luz solar directa',
        tip: 'Acércalas a la ventana más soleada para mejor sabor y aroma',
        suggestedLocation: 'Ventana sur o exterior en balcón soleado',
      }
    }
    return tooLow
  }

  // Default
  if (lightLevel === 'medium' || lightLevel === 'high') return adequate
  if (lightLevel === 'very_high') {
    return {
      isAdequate: false,
      message: 'La luz directa puede dañar las hojas de esta planta',
      tip: 'Aleja tu planta de la luz directa del sol o usa una cortina traslúcida',
      suggestedLocation: 'Interior con luz indirecta brillante',
    }
  }
  return tooLow
}

export async function saveLightReadingForPlant(
  plantId: string,
  userId: string,
  lightLevel: LightLevelKey,
  recommendation?: string
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('light_readings').insert({
    plant_id: plantId,
    user_id: userId,
    lux_value: null,
    light_level: lightLevel,
    location_description: null,
    recommendation: recommendation ?? null,
    measured_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
}
