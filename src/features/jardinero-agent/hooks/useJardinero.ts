'use client'

import { useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function useJardinero(userId: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '¡Hola! Soy El Jardinero 🌿 Tu asistente personal de jardín. ¿En qué puedo ayudarte hoy?',
    },
  ])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitted' | 'streaming'>('idle')
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessages = [...messages, userMessage]
    setInput('')
    setStatus('submitted')
    setError(null)

    try {
      const response = await fetch('/api/jardinero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      setStatus('streaming')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
        },
      ])

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk

        setMessages((prev) => {
          const newMessages = [...prev]
          const lastIndex = newMessages.length - 1
          if (newMessages[lastIndex]?.id === assistantId) {
            newMessages[lastIndex] = {
              id: assistantId,
              role: 'assistant',
              content: accumulatedText,
            }
          }
          return newMessages
        })
      }

      setStatus('idle')
    } catch (err) {
      console.error('Error in chat:', err)
      setError(err as Error)
      setStatus('idle')

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: 'Lo siento, hubo un error. ¿Puedes intentarlo de nuevo?',
        },
      ])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
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
