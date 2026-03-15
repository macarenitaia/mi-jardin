import { generateObject } from 'ai'
import { openai, MODELS } from '@/lib/ai/openrouter'
import { z } from 'zod'

const bodySchema = z.object({
  imageBase64: z.string().min(1),
})

const identificationSchema = z.object({
  commonName: z.string(),
  scientificName: z.string(),
  confidence: z.enum(['alta', 'media', 'baja']),
  description: z.string(),
  wateringFrequency: z.string(),
  wateringFrequencyDays: z.number().int().positive(),
  sunlight: z.string(),
  humidity: z.string(),
  difficulty: z.enum(['fácil', 'moderada', 'difícil']),
  careNotes: z.string(),
  commonProblems: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: 'imageBase64 es requerido' }, { status: 400 })
    }

    const { imageBase64 } = parsed.data

    const { object } = await generateObject({
      model: openai(MODELS.vision),
      schema: identificationSchema,
      messages: [
        {
          role: 'system',
          content:
            'Eres un botánico experto. Analiza la imagen de la planta y proporciona información detallada y precisa. Si no puedes identificar la planta con certeza, indica confianza "baja" pero proporciona tu mejor estimación. Responde siempre en español.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Identifica esta planta y proporciona información detallada sobre su cuidado. Incluye nombre común, nombre científico, nivel de confianza en la identificación, descripción, frecuencia de riego (texto descriptivo y número de días), necesidades de luz y humedad, dificultad de cuidado, consejo principal de cuidado y problemas frecuentes.',
            },
            {
              type: 'image',
              image: imageBase64,
            },
          ],
        },
      ],
    })

    return Response.json({ result: object })
  } catch (error) {
    console.error('Error identificando planta:', error)
    return Response.json(
      { error: 'No se pudo identificar la planta. Intenta con otra foto.' },
      { status: 500 }
    )
  }
}
