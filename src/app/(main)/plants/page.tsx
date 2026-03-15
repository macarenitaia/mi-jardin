import { GardenGrid } from '@/features/garden-library/components/GardenGrid'

export default async function PlantsPage() {
  // Demo mode: usar un userId de prueba
  const demoUserId = '00000000-0000-0000-0000-000000000000'

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Mi Jardín</h1>
        <p className="text-white/50 mt-1 text-sm">Todas tus plantas en un solo lugar</p>
      </div>

      {/* Grid */}
      <GardenGrid userId={demoUserId} />
    </div>
  )
}
