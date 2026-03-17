import { streamText, tool } from 'ai'
import { openai, MODELS } from '@/lib/ai/openrouter'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const SYSTEM_PROMPT = `Eres El Jardinero, un experto en botánica y cuidado de plantas con personalidad amigable y apasionada.

IMPORTANTE: Tienes acceso a herramientas para consultar y gestionar el jardín del usuario. Úsalas SIEMPRE que el usuario pregunte sobre:
- Sus plantas
- Qué necesita regar
- Cuándo regó una planta
- Historial de cuidados
- Estado del jardín

Cuando el usuario pregunte "¿qué plantas tengo?" o "¿qué me toca regar hoy?", USA las herramientas disponibles.

Personalidad:
- Cálido y apasionado por las plantas
- Concreto y práctico en los consejos
- Proactivo: sugiere acciones cuando veas oportunidades

Siempre responde en español.`

export async function POST(request: Request) {
  try {
    console.log('[JARDINERO API] Request received')
    const body: unknown = await request.json()
    const { messages, userId } = body as { messages?: unknown[]; userId?: string }

    if (!userId) {
      return Response.json({ error: 'userId es requerido' }, { status: 400 })
    }

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'messages es requerido' }, { status: 400 })
    }

    console.log('[JARDINERO API] User:', userId, 'Messages:', messages.length)

    const supabase = await createClient()

    const result = streamText({
      model: openai(MODELS.chat),
      system: SYSTEM_PROMPT,
      messages: messages as any,
      tools: {
        getMyPlants: tool({
          description:
            'Obtiene la lista de todas las plantas del usuario con su información (nombre, especie, frecuencia de riego, última vez que se regó, etc.)',
          parameters: z.object({}),
          // @ts-expect-error: Vercel AI SDK overloads mismatch with empty zod object
          execute: async (_args) => {
            console.log('[TOOL] getMyPlants called for user:', userId)

            const { data: plants, error } = await supabase
              .from('plants')
              .select('id, name, species, watering_frequency_days, location, notes')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })

            if (error) {
              console.error('[TOOL] getMyPlants error:', error)
              return { error: 'No se pudieron obtener las plantas' }
            }

            console.log('[TOOL] getMyPlants found:', plants?.length || 0, 'plants')
            return { plants: plants || [] }
          },
        }),

        getPlantsNeedingWater: tool({
          description:
            'Obtiene las plantas que necesitan ser regadas HOY basándose en la última vez que fueron regadas y su frecuencia de riego configurada',
          parameters: z.object({}),
          // @ts-expect-error: Vercel AI SDK overloads mismatch with empty zod object
          execute: async (_args) => {
            console.log('[TOOL] getPlantsNeedingWater called for user:', userId)

            // Get plants with their last watering
            const { data: plants, error: plantsError } = await supabase
              .from('plants')
              .select('id, name, species, watering_frequency_days, location')
              .eq('user_id', userId)
              .not('watering_frequency_days', 'is', null)

            if (plantsError) {
              console.error('[TOOL] getPlantsNeedingWater plants error:', plantsError)
              return { error: 'No se pudieron obtener las plantas' }
            }

            if (!plants || plants.length === 0) {
              return { plantsNeedingWater: [] }
            }

            // For each plant, get the last watering
            const plantsWithWateringInfo = await Promise.all(
              plants.map(async (plant) => {
                const { data: lastWatering } = await supabase
                  .from('care_logs')
                  .select('performed_at')
                  .eq('plant_id', plant.id)
                  .eq('care_type', 'watering')
                  .order('performed_at', { ascending: false })
                  .limit(1)
                  .single()

                const lastWateredDate = lastWatering?.performed_at
                  ? new Date(lastWatering.performed_at)
                  : null

                const today = new Date()
                const daysSinceWatering = lastWateredDate
                  ? Math.floor((today.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24))
                  : 999 // If never watered, consider it needs water

                const needsWater = daysSinceWatering >= (plant.watering_frequency_days || 7)

                return {
                  ...plant,
                  lastWatered: lastWateredDate?.toISOString() || null,
                  daysSinceWatering,
                  needsWater,
                }
              })
            )

            const plantsNeedingWater = plantsWithWateringInfo.filter((p) => p.needsWater)

            console.log(
              '[TOOL] getPlantsNeedingWater found:',
              plantsNeedingWater.length,
              'plants needing water'
            )
            return { plantsNeedingWater }
          },
        }),

        getCareHistory: tool({
          description:
            'Obtiene el historial de cuidados de una planta específica (riego, fertilización, poda, etc.)',
          parameters: z.object({
            plantName: z.string().describe('Nombre de la planta'),
          }),
          // @ts-expect-error: Vercel AI SDK overloads mismatch with zod typing
          execute: async ({ plantName }) => {
            console.log('[TOOL] getCareHistory called for plant:', plantName)

            // First find the plant by name
            const { data: plant } = await supabase
              .from('plants')
              .select('id, name')
              .eq('user_id', userId)
              .ilike('name', `%${plantName}%`)
              .limit(1)
              .single()

            if (!plant) {
              return { error: `No encontré ninguna planta con el nombre "${plantName}"` }
            }

            // Get care history
            const { data: careLogs, error } = await supabase
              .from('care_logs')
              .select('care_type, notes, performed_at')
              .eq('plant_id', plant.id)
              .order('performed_at', { ascending: false })
              .limit(20)

            if (error) {
              console.error('[TOOL] getCareHistory error:', error)
              return { error: 'No se pudo obtener el historial' }
            }

            console.log('[TOOL] getCareHistory found:', careLogs?.length || 0, 'logs')
            return { plantName: plant.name, careHistory: careLogs || [] }
          },
        }),
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[JARDINERO API] Error:', error)
    return Response.json(
      { error: 'Error interno del servidor. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
