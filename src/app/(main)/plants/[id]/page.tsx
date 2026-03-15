import { PlantProfileClient } from '@/features/plant-profile/components/PlantProfileClient'

interface PlantProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function PlantProfilePage({ params }: PlantProfilePageProps) {
  const { id } = await params
  // Demo mode: usar un userId de prueba
  const demoUserId = '00000000-0000-0000-0000-000000000000'

  return <PlantProfileClient plantId={id} userId={demoUserId} />
}
