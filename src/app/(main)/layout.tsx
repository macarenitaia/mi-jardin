import { MainSidebar } from '@/features/garden-library/components/MainSidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-950 to-slate-950">
      {/* Orbs de fondo */}
      <div className="fixed top-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-emerald-500 blur-[150px] opacity-15 animate-float-orb-1 pointer-events-none" />
      <div className="fixed top-[50%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-400 blur-[130px] opacity-10 animate-float-orb-2 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[40%] w-[400px] h-[400px] rounded-full bg-lime-500 blur-[120px] opacity-10 animate-float-orb-3 pointer-events-none" />

      {/* Layout */}
      <div className="flex h-screen relative z-10">
        <MainSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
