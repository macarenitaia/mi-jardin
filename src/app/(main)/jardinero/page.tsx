import { JardineroClientWrapper } from '@/features/jardinero-agent/components/JardineroClientWrapper'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function JardineroPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <JardineroClientWrapper userId={session.user.id} />
    </div>
  )
}
