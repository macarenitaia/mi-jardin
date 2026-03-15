'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../services/authService'
import type { SignInData, SignUpData } from '../types'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signIn = async (data: SignInData) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.signIn(data)
      router.push('/plants')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (data: SignUpData) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.signUp(data)
      router.push('/plants')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authService.signOut()
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return { signIn, signUp, signOut, isLoading, error }
}
