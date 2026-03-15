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
        '¡Hola! Soy El Jardinero 🌿 Tu asistente personal de jardín. ¿En qué puedo ayudarte hoy? Puedo decirte cuándo regar tus plantas, registrar cuidados o darte consejos personalizados.',
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
    setInput('')
    setStatus('submitted')
    setError(null)

    try {
      const response = await fetch('/api/jardinero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      setStatus('streaming')
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      setMessages((prev) => [...prev, assistantMessage])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantContent += chunk

        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            ...assistantMessage,
            content: assistantContent,
          }
          return newMessages
        })
      }

      setStatus('idle')
    } catch (err) {
      setError(err as Error)
      setStatus('idle')
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
