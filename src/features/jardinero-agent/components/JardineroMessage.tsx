'use client'

import { Leaf, Wrench } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { UIMessage } from 'ai'

interface JardineroMessageProps {
  message: UIMessage
}

function ToolCallChip() {
  return (
    <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1.5 w-fit">
      <Wrench className="h-3 w-3" />
      <span>Consultando tu jardín...</span>
      <span className="flex gap-0.5">
        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </span>
    </div>
  )
}

export function JardineroMessage({ message }: JardineroMessageProps) {
  const isUser = message.role === 'user'
  const hasToolInvocations =
    'toolInvocations' in message &&
    Array.isArray(message.toolInvocations) &&
    message.toolInvocations.length > 0

  const pendingToolCalls =
    hasToolInvocations
      ? (message.toolInvocations as Array<{ state: string }>).filter(
          (t) => t.state === 'call'
        )
      : []

  // Get text content from message parts or fallback to content property
  const textContent = 'parts' in message && Array.isArray(message.parts) && message.parts.length > 0
    ? message.parts
        .filter((p: unknown) => typeof p === 'object' && p !== null && 'type' in p && p.type === 'text')
        .map((p: unknown) => (p as { text: string }).text)
        .join('')
    : 'content' in message ? (message as any).content || '' : ''

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            'max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm',
            'bg-emerald-500/20 border border-emerald-400/20 text-white text-sm whitespace-pre-wrap'
          )}
        >
          {textContent}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
        <Leaf className="h-4 w-4 text-emerald-400" />
      </div>

      <div className="flex flex-col gap-2 max-w-[80%]">
        {/* Tool calls in progress */}
        {pendingToolCalls.length > 0 && <ToolCallChip />}

        {/* Message content */}
        {textContent && (
          <div
            className={cn(
              'px-4 py-3 rounded-2xl rounded-tl-sm',
              'bg-white/[0.08] border border-white/[0.12] text-white/90 text-sm whitespace-pre-wrap'
            )}
          >
            {textContent}
          </div>
        )}
      </div>
    </div>
  )
}
