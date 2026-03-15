import { createOpenAI } from '@ai-sdk/openai'

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const MODELS = {
  // Chat rápido
  fast: 'gpt-4o-mini',

  // Vision — analizar fotos de plantas
  vision: 'gpt-4o',

  // Chat — para El Jardinero (agente conversacional)
  chat: 'gpt-4o',

  // Potente — para análisis complejos
  powerful: 'gpt-4o',
} as const

export type ModelKey = keyof typeof MODELS
