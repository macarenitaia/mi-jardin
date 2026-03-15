'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Leaf } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { GlassButton } from '@/shared/components/GlassButton'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Logo y título */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-4">
          <Leaf className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Mi Jardín</h1>
        <p className="text-white/50 text-sm mt-1">Tu jardín inteligente te espera</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-white/60 text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
            className="glass-input w-full pl-10 pr-4 py-3"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-white/60 text-sm font-medium">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="glass-input w-full pl-10 pr-4 py-3"
          />
        </div>
      </div>

      {/* Submit */}
      <GlassButton
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full mt-2"
      >
        Entrar al jardín
      </GlassButton>

      {/* Link signup */}
      <p className="text-center text-white/40 text-sm">
        ¿Primera vez?{' '}
        <Link
          href="/signup"
          className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Crea tu cuenta
        </Link>
      </p>
    </form>
  )
}
