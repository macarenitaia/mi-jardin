export interface AuthUser {
  id: string
  email: string | undefined
  createdAt: string
}

export interface SignInData {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}
