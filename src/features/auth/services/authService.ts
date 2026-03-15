import { createClient } from '@/lib/supabase/client'
import type { SignInData, SignUpData } from '../types'

export const authService = {
  async signIn({ email, password }: SignInData) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    return data
  },

  async signUp({ email, password }: SignUpData) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
    return data
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async getSession() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    return data.session
  },

  async getUser() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
  },
}
