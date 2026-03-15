import { generateObject } from 'ai'
import { openai, MODELS } from '@/lib/ai/openrouter'
import { z } from 'zod'

const bodySchema = z.object({
  imageBase64: z.string().min(1),
  plantName: z.string().optional(),
})

const actionStepSchema = z.object({
  step: z.number().int().positive(),
  action: z.string(),
  detail: z.string(),
})

const diagnosisSchema = z.object({
  isHealthy: z.boolean(),
  disease: z.string(),
  severity: z.enum(['leve', 'moderado', 'grave', 'ninguno']),
  symptoms: z.array(z.string()),
  causes: z.array(z.string()),
  actionPlan: z.array(actionStepSchema),
  preventionTips: z.array(z.string()),
  urgency: z.enum(['inmediata', 'esta semana', 'puede esperar', 'ninguna']),
})

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: 'imageBase64 es requerido' }, { status: 400 })
    }

    const { imageBase64, plantName } = parsed.data

    const plantContext = plantName
      ? `La planta es: ${plantName}. `
      : ''

    const { object } = await generateObject({
      model: openai(MODELS.vision),
      schema: diagnosisSchema,
      messages: [
        {
          role: 'system',
          content:
            'Eres un fitopatólogo experto (especialista en enfermedades de plantas). Analiza la imagen proporcionada e identifica: 1. Si la planta está enferma o tiene algún problema. 2. La enfermedad o problema específico. 3. Los síntomas visibles. 4. Las posibles causas. 5. Un plan de acción detallado paso a paso. 6. Consejos de prevención. Si la planta parece sana, indícalo claramente. Responde siempre en español con información práctica y accionable.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${plantContext}Analiza esta planta y determina si tiene alguna enfermedad o problema. Si está enferma, proporciona: nombre de la enfermedad o problema, nivel de severidad (leve/moderado/grave), síntomas visibles, causas posibles, plan de acción paso a paso con instrucciones detalladas, consejos de prevención y urgencia de atención. Si está sana, indícalo y proporciona consejos de prevención generales.`,
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
    console.error('Error diagnosticando planta:', error)
    return Response.json(
      { error: 'No se pudo diagnosticar la planta. Intenta con otra foto.' },
      { status: 500 }
    )
  }
}
