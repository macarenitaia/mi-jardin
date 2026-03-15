export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-950 to-slate-950 flex items-center justify-center p-4">
      {/* Orbs de fondo animados */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[120px] opacity-20 animate-float-orb-1 pointer-events-none" />
      <div className="fixed top-[40%] right-[-15%] w-[600px] h-[600px] rounded-full bg-teal-400 blur-[120px] opacity-15 animate-float-orb-2 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-lime-500 blur-[100px] opacity-10 animate-float-orb-3 pointer-events-none" />

      {/* Card de auth */}
      <div className="relative w-full max-w-md">
        <div className="relative bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] rounded-3xl shadow-2xl p-8 overflow-hidden">
          {/* Highlight superior */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          {children}
        </div>
      </div>
    </div>
  )
}
