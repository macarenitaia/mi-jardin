'use client'

import { useEffect, useRef } from 'react'
import { Send, Leaf } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { GlassButton } from '@/shared/components/GlassButton'
import { glass } from '@/shared/lib/glass'
import { useJardinero } from '../hooks/useJardinero'
import { JardineroMessage } from './JardineroMessage'

interface JardineroChartProps {
  userId: string
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
        <Leaf className="h-4 w-4 text-emerald-400" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.08] border border-white/[0.12]">
        <span className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  )
}

export function JardineroChat({ userId }: JardineroChartProps) {
  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useJardinero(userId)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(glass.navbar, 'px-6 py-4 flex items-center gap-3')}>
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
          <Leaf className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className={cn(glass.heading, 'text-lg')}>El Jardinero</h1>
          <p className={cn(glass.muted, 'text-xs')}>Tu asistente de jardín</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            )}
          />
          <span className={cn(glass.muted, 'text-xs')}>
            {isLoading ? 'Pensando...' : 'En línea'}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: unknown) => (
          <JardineroMessage key={(message as { id: string }).id} message={message as Parameters<typeof JardineroMessage>[0]['message']} />
        ))}

        {isLoading &&
          messages[messages.length - 1]?.role !== 'assistant' && <TypingIndicator />}

        {error && (
          <div className="flex justify-center">
            <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm max-w-[80%] text-center">
              Ocurrió un error. Por favor intenta de nuevo.
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className={cn('border-t border-white/10 p-4')}>
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Pregúntame sobre tus plantas..."
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                }
              }}
              className={cn(
                'glass-input w-full px-4 py-3 resize-none',
                'min-h-[48px] max-h-[120px]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'text-sm text-white placeholder-white/40'
              )}
            />
          </div>
          <GlassButton
            type="submit"
            disabled={isLoading || !input.trim()}
            variant="primary"
            size="sm"
            className="flex-shrink-0 h-[48px] w-[48px] !px-0 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </GlassButton>
        </form>
        <p className={cn(glass.muted, 'text-xs mt-2 text-center')}>
          Presiona Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  )
}
