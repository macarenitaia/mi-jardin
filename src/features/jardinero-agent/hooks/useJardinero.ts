'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useMemo } from 'react'

export function useJardinero(userId: string) {
  const [input, setInput] = useState('')

  // AI SDK v6: api and body are configured via a transport object
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/jardinero',
        body: { userId },
      }),
    [userId]
  )

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
    // v6 uses 'messages' (not 'initialMessages') for initial chat state
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [
          {
            type: 'text' as const,
            text: '¡Hola! Soy El Jardinero 🌿 Tu asistente personal de jardín. ¿En qué puedo ayudarte hoy?',
          },
        ],
      },
    ],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    clearError()
    sendMessage({ text })
    setInput('')
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
  }
}
