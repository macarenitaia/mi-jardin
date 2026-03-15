import { JardineroClientWrapper } from '@/features/jardinero-agent/components/JardineroClientWrapper'

export default async function JardineroPage() {
  // Demo mode: usar un userId de prueba
  const demoUserId = '00000000-0000-0000-0000-000000000000'

  return (
    <div className="h-[calc(100vh-4rem)]">
      <JardineroClientWrapper userId={demoUserId} />
    </div>
  )
}
