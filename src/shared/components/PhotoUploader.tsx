'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface UploadedPhoto {
  id: string
  file: File
  preview: string
  base64: string
}

interface PhotoUploaderProps {
  onPhotoChange: (photo: UploadedPhoto | null) => void
  initialPreview?: string
  placeholder?: string
  className?: string
  accept?: string
  enablePaste?: boolean
}

export function PhotoUploader({
  onPhotoChange,
  initialPreview,
  placeholder = 'Sube una foto o pégala con Ctrl+V',
  className,
  accept = 'image/*',
  enablePaste = true,
}: PhotoUploaderProps) {
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (photo?.preview) URL.revokeObjectURL(photo.preview)
    }
  }, [photo])

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      if (file.size > 10 * 1024 * 1024) return

      setIsProcessing(true)
      try {
        if (photo?.preview) URL.revokeObjectURL(photo.preview)

        const newPhoto: UploadedPhoto = {
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          base64: await fileToBase64(file),
        }

        setPhoto(newPhoto)
        onPhotoChange(newPhoto)
      } finally {
        setIsProcessing(false)
      }
    },
    [photo, onPhotoChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    if (photo?.preview) URL.revokeObjectURL(photo.preview)
    setPhoto(null)
    onPhotoChange(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  useEffect(() => {
    if (!enablePaste) return

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile()
          if (file) {
            e.preventDefault()
            await processFile(file)
            break
          }
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [enablePaste, processFile])

  const preview = photo?.preview || initialPreview

  return (
    <div className={cn('relative', className)}>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden aspect-square group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Foto de planta" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white text-sm font-medium transition-all"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm border border-red-400/30 rounded-xl p-2 text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          disabled={isProcessing}
          className={cn(
            'w-full aspect-square rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer',
            isDragging
              ? 'border-emerald-400/60 bg-emerald-500/10'
              : 'border-white/20 hover:border-emerald-400/40 bg-white/[0.05] hover:bg-white/[0.08]'
          )}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          ) : (
            <>
              <ImagePlus className="w-8 h-8 text-white/40" />
              <span className="text-white/40 text-sm text-center px-4">{placeholder}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export type { UploadedPhoto }
