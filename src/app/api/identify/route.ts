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
    console.log('[IDENTIFY API] Request received')

    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      console.error('[IDENTIFY API] Validation failed:', parsed.error)
      return Response.json({ error: 'imageBase64 es requerido' }, { status: 400 })
    }

    let { imageBase64 } = parsed.data
    console.log('[IDENTIFY API] Image received, base64 length:', imageBase64.length)

    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    // Vercel AI SDK requires pure base64, not data URLs
    if (imageBase64.startsWith('data:')) {
      const base64Index = imageBase64.indexOf('base64,')
      if (base64Index !== -1) {
        imageBase64 = imageBase64.substring(base64Index + 7)
        console.log('[IDENTIFY API] Removed data URL prefix, new length:', imageBase64.length)
      }
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('[IDENTIFY API] OPENAI_API_KEY not found in environment')
      return Response.json(
        { error: 'API key no configurada. Contacta al administrador.' },
        { status: 500 }
      )
    }

    console.log('[IDENTIFY API] Calling OpenAI Vision API...')
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

    console.log('[IDENTIFY API] Success! Identified:', object.commonName)
    return Response.json({ result: object })
  } catch (error) {
    console.error('[IDENTIFY API] ERROR:', error)

    // More detailed error message
    let errorMessage = 'No se pudo identificar la planta. Intenta con otra foto.'

    if (error instanceof Error) {
      console.error('[IDENTIFY API] Error details:', error.message, error.stack)

      // Check for common errors
      if (error.message.includes('API key')) {
        errorMessage = 'API key inválida o no configurada'
      } else if (error.message.includes('quota')) {
        errorMessage = 'Sin créditos en la cuenta de OpenAI'
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Demasiadas solicitudes. Espera un momento.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'La solicitud tardó demasiado. Intenta de nuevo.'
      }
    }

    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
