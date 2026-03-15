'use client'

import { useState } from 'react'
import type { WateringResult, PlantInput } from '../types'

const PLANT_FACTORS: Array<{ keywords: string[]; factor: number; type: string }> = [
  { keywords: ['cactus', 'suculenta', 'succulent', 'aloe'], factor: 0.3, type: 'cactus' },
  { keywords: ['orquídea', 'orquidea', 'orchid'], factor: 0.5, type: 'orquidea' },
  { keywords: ['helecho', 'fern', 'asplenium', 'nephrolepis'], factor: 1.8, type: 'helecho' },
  {
    keywords: ['monstera', 'pothos', 'scindapsus', 'philodendron', 'tropical', 'calathea', 'maranta'],
    factor: 1.2,
    type: 'tropical',
  },
  { keywords: ['árbol', 'arbol', 'ficus', 'palmera', 'palm', 'bonsai'], factor: 0.8, type: 'arbol' },
  {
    keywords: ['hierba', 'herb', 'albahaca', 'basilico', 'menta', 'perejil', 'romero', 'tomillo'],
    factor: 1.5,
    type: 'hierba',
  },
]

const POT_SIZE_FACTORS: Record<string, number> = {
  pequeño: 0.7,
  pequeno: 0.7,
  mediano: 1.0,
  grande: 1.4,
  'muy grande': 1.8,
  muy_grande: 1.8,
}

const SUBSTRATE_FACTORS: Record<string, number> = {
  cactus: 0.6,
  arena: 0.7,
  universal: 1.0,
  turba: 1.3,
  orquídeas: 0.8,
  orquideas: 0.8,
}

const WATER_AMOUNTS: Record<string, number> = {
  pequeño: 100,
  pequeno: 100,
  mediano: 250,
  grande: 500,
  'muy grande': 800,
  muy_grande: 800,
}

function detectPlantType(name: string, species?: string): { factor: number; type: string } {
  const combined = `${name} ${species ?? ''}`.toLowerCase()
  for (const entry of PLANT_FACTORS) {
    if (entry.keywords.some((kw) => combined.includes(kw))) {
      return { factor: entry.factor, type: entry.type }
    }
  }
  return { factor: 1.0, type: 'default' }
}

function getTips(plantType: string, potSubstrate: string): string[] {
  const tips: string[] = []

  if (plantType === 'cactus') {
    tips.push('Deja que el sustrato se seque completamente entre riegos')
    tips.push('En invierno reduce el riego a una vez al mes o menos')
    tips.push('Usa siempre maceta con agujero de drenaje')
  } else if (plantType === 'helecho') {
    tips.push('Mantén la tierra ligeramente húmeda en todo momento')
    tips.push('Pulveriza las hojas regularmente para aumentar la humedad')
    tips.push('Evita que el sustrato se seque por completo')
  } else if (plantType === 'orquidea') {
    tips.push('Riega sumergiendo la maceta 10 min y deja drenar completamente')
    tips.push('Nunca dejes agua estancada en el plato de la maceta')
    tips.push('Usa agua sin cal a temperatura ambiente')
  } else if (plantType === 'tropical') {
    tips.push('Comprueba la humedad introduciendo el dedo 2cm en la tierra')
    tips.push('Riega cuando los primeros 2-3 cm de tierra estén secos')
    tips.push('Pulveriza las hojas en verano para replicar el ambiente tropical')
  } else if (plantType === 'arbol') {
    tips.push('Riega profusamente pero espera a que la superficie esté seca')
    tips.push('Ajusta la frecuencia según la estación del año')
    tips.push('Las plantas más grandes toleran mejor la sequía')
  } else if (plantType === 'hierba') {
    tips.push('Las hierbas aromáticas prefieren la tierra ligeramente húmeda')
    tips.push('Riega preferiblemente por la mañana para prevenir hongos')
    tips.push('Comprueba la humedad a diario en verano')
  } else {
    tips.push('Comprueba la humedad introduciendo el dedo 2cm en la tierra')
    tips.push('Riega cuando los primeros centímetros estén secos')
    tips.push('Reduce el riego en invierno cuando el crecimiento es menor')
  }

  if (potSubstrate === 'turba') {
    tips.push('El sustrato de turba retiene mucho agua — riega con moderación')
  } else if (potSubstrate === 'arena' || potSubstrate === 'cactus') {
    tips.push('El sustrato de drenaje rápido requiere revisiones más frecuentes')
  }

  return tips.slice(0, 4)
}

export function useWateringCalculator() {
  const [result, setResult] = useState<WateringResult | null>(null)

  const calculate = (plant: PlantInput): WateringResult => {
    const { factor: plantFactor, type: plantType } = detectPlantType(plant.name, plant.species)

    const potSizeKey = plant.potSize.toLowerCase()
    const substrateKey = plant.potSubstrate.toLowerCase()

    const potSizeFactor = POT_SIZE_FACTORS[potSizeKey] ?? 1.0
    const substrateFactor = SUBSTRATE_FACTORS[substrateKey] ?? 1.0

    const rawFrequency = 7 / (plantFactor * potSizeFactor * substrateFactor)
    const frequencyDays = Math.min(30, Math.max(1, Math.round(rawFrequency)))

    const amountMl = WATER_AMOUNTS[potSizeKey] ?? 250

    const tips = getTips(plantType, substrateKey)

    const nextWateringDate = new Date()
    nextWateringDate.setDate(nextWateringDate.getDate() + frequencyDays)

    const calculated: WateringResult = {
      frequencyDays,
      amountMl,
      tips,
      nextWatering: nextWateringDate.toISOString(),
    }

    setResult(calculated)
    return calculated
  }

  const reset = () => setResult(null)

  return { calculate, result, reset }
}
