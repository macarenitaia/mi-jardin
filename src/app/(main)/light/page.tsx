import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LightMeter } from '@/features/light-meter/components/LightMeter'

export default async function LightPage() {
  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener plantas del usuario para el selector
  const { data: plants } = await supabase
    .from('plants')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/20 flex items-center justify-center">
          <span className="text-lg">☀️</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Medidor de luz</h1>
          <p className="text-white/40 text-sm">Evalúa si la luz es adecuada para tu planta</p>
        </div>
      </div>

      <LightMeter userId={user.id} plants={plants || []} />
    </div>
  )
}
