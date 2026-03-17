'use client'

import { useState } from 'react'
import { Camera, Leaf, Search } from 'lucide-react'
import { PhotoUploader } from '@/shared/components/PhotoUploader'
import { GlassButton } from '@/shared/components/GlassButton'
import { GlassCard } from '@/shared/components/GlassCard'
import { IdentificationResult } from '@/features/plant-identification/components/IdentificationResult'
import { useIdentification } from '@/features/plant-identification/hooks/useIdentification'
import type { UploadedPhoto } from '@/shared/components/PhotoUploader'

export default function IdentifyPage() {
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null)
  const { identify, result, isLoading, error, reset } = useIdentification()

  const handlePhotoChange = (uploaded: UploadedPhoto | null) => {
    setPhoto(uploaded)
    if (!uploaded) reset()
  }

  const handleIdentify = async () => {
    if (!photo) return
    await identify(photo.base64)
  }

  const handleReset = () => {
    setPhoto(null)
    reset()
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Identificar Planta</h1>
        <p className="text-white/60 mt-1">Fotografía cualquier planta para descubrir qué es</p>
      </div>

      {/* Result state */}
      {result && !isLoading && (
        <IdentificationResult result={result} onReset={handleReset} />
      )}

      {/* Loading state */}
      {isLoading && (
        <GlassCard className="p-10 flex flex-col items-center gap-4" highlight>
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
            <Leaf className="absolute inset-0 m-auto w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Analizando tu planta</p>
            <LoadingDots />
          </div>
        </GlassCard>
      )}

      {/* Initial state */}
      {!result && !isLoading && (
        <div className="space-y-6">
          {/* Photo uploader */}
          <div className="max-w-sm mx-auto">
            <PhotoUploader
              onPhotoChange={handlePhotoChange}
              placeholder="Sube o arrastra una foto"
              enablePaste
              className="w-full"
            />
          </div>

          {/* Paste hint */}
          <p className="text-center text-white/40 text-sm">
            Puedes pegar una foto con <kbd className="bg-white/10 border border-white/15 rounded px-1.5 py-0.5 text-xs font-mono">Ctrl+V</kbd>
          </p>

          {/* Error */}
          {error && (
            <GlassCard className="p-4 border-red-400/20 bg-red-500/[0.08]">
              <div className="text-center">
                <p className="text-red-300 text-sm font-medium mb-1">⚠️ No se pudo identificar</p>
                <p className="text-red-200/70 text-xs">{error}</p>
              </div>
            </GlassCard>
          )}

          {/* Identify button */}
          {photo && (
            <GlassButton
              variant="primary"
              size="lg"
              onClick={handleIdentify}
              disabled={isLoading}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Identificar
              </span>
            </GlassButton>
          )}

          {/* Use cases */}
          {!photo && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <GlassCard className="p-4">
                <Camera className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-white/80 text-sm font-medium">¿Tienes una planta nueva?</p>
                <p className="text-white/40 text-xs mt-1">Descubre su nombre y cómo cuidarla</p>
              </GlassCard>
              <GlassCard className="p-4">
                <Leaf className="w-5 h-5 text-teal-400 mb-2" />
                <p className="text-white/80 text-sm font-medium">¿Viste una planta por la calle?</p>
                <p className="text-white/40 text-xs mt-1">Identifícala al instante con IA</p>
              </GlassCard>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-1 mt-1">
      <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  )
}
