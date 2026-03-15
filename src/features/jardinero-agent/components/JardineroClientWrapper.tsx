'use client'

import { JardineroChat } from './JardineroChat'

interface JardineroClientWrapperProps {
  userId: string
}

export function JardineroClientWrapper({ userId }: JardineroClientWrapperProps) {
  return <JardineroChat userId={userId} />
}
