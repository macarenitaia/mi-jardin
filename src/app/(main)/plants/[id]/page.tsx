import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlantProfileClient } from '@/features/plant-profile/components/PlantProfileClient'

interface PlantProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function PlantProfilePage({ params }: PlantProfilePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <PlantProfileClient plantId={id} userId={user.id} />
}
