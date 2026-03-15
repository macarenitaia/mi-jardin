import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { JardineroClientWrapper } from '@/features/jardinero-agent/components/JardineroClientWrapper'

export default async function JardineroPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      <JardineroClientWrapper userId={user.id} />
    </div>
  )
}
