import { streamText } from 'ai'
import { openai, MODELS } from '@/lib/ai/openrouter'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPT = `Eres El Jardinero, un experto en botánica y cuidado de plantas con personalidad amigable y apasionada. Conoces el jardín del usuario.

Cuando el usuario pregunte sobre sus plantas, responde con base en la información disponible.
Cuando el usuario quiera registrar una acción (regar, abonar, podar), ayúdale a hacerlo.
Siempre responde en español de manera cálida y personalizada.
Da consejos concretos y prácticos.

Sé proactivo: si ves que el usuario menciona una planta, pregunta si necesita ayuda para cuidarla.`

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const { messages, userId } = body as { messages?: unknown[]; userId?: string }

    if (!userId) {
      return Response.json({ error: 'userId es requerido' }, { status: 400 })
    }

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'messages es requerido' }, { status: 400 })
    }

    const result = streamText({
      model: openai(MODELS.chat),
      system: SYSTEM_PROMPT,
      messages: messages as any,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error en El Jardinero:', error)
    return Response.json(
      { error: 'Error interno del servidor. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
