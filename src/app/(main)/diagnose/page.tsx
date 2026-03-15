'use client'

import { useState } from 'react'
import { Stethoscope, Leaf, Focus } from 'lucide-react'
import { PhotoUploader } from '@/shared/components/PhotoUploader'
import { GlassButton } from '@/shared/components/GlassButton'
import { GlassCard } from '@/shared/components/GlassCard'
import { DiagnosisResult } from '@/features/disease-diagnosis/components/DiagnosisResult'
import { useDiagnosis } from '@/features/disease-diagnosis/hooks/useDiagnosis'
import type { UploadedPhoto } from '@/shared/components/PhotoUploader'

export default function DiagnosePage() {
  const [photo, setPhoto] = useState<UploadedPhoto | null>(null)
  const [plantName, setPlantName] = useState('')
  const { diagnose, result, isLoading, error, reset } = useDiagnosis()

  const handlePhotoChange = (uploaded: UploadedPhoto | null) => {
    setPhoto(uploaded)
    if (!uploaded) reset()
  }

  const handleDiagnose = async () => {
    if (!photo) return
    await diagnose(photo.base64, plantName.trim() || undefined)
  }

  const handleReset = () => {
    setPhoto(null)
    setPlantName('')
    reset()
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Diagnosticar Enfermedad</h1>
        <p className="text-white/60 mt-1">
          Fotografía los síntomas de tu planta para obtener un diagnóstico
        </p>
      </div>

      {/* Result state */}
      {result && !isLoading && (
        <DiagnosisResult
          result={result}
          photoUrl={photo?.base64 ?? ''}
          onReset={handleReset}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <GlassCard className="p-10 flex flex-col items-center gap-4" highlight>
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
            <Stethoscope className="absolute inset-0 m-auto w-6 h-6 text-amber-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Analizando síntomas...</p>
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
              placeholder="Sube o arrastra una foto de los síntomas"
              enablePaste
              className="w-full"
            />
          </div>

          {/* Plant name input */}
          <div>
            <label htmlFor="plantName" className="block text-white/60 text-sm mb-2">
              ¿De qué planta es? <span className="text-white/30">(opcional)</span>
            </label>
            <input
              id="plantName"
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Ej: Tomate, Rosa, Monstera..."
              className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.09] transition-all"
            />
          </div>

          {/* Paste hint */}
          <p className="text-center text-white/40 text-sm">
            Puedes pegar una foto con{' '}
            <kbd className="bg-white/10 border border-white/15 rounded px-1.5 py-0.5 text-xs font-mono">
              Ctrl+V
            </kbd>
          </p>

          {/* Error */}
          {error && (
            <GlassCard className="p-4 border-red-400/20 bg-red-500/[0.08]">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </GlassCard>
          )}

          {/* Diagnose button */}
          {photo && (
            <GlassButton
              variant="primary"
              size="lg"
              onClick={handleDiagnose}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-500 hover:to-orange-500 border-amber-400/40 shadow-amber-500/20 hover:shadow-amber-500/40"
            >
              <span className="flex items-center justify-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Diagnosticar
              </span>
            </GlassButton>
          )}

          {/* Info cards */}
          {!photo && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <GlassCard className="p-4">
                <Focus className="w-5 h-5 text-amber-400 mb-2" />
                <p className="text-white/80 text-sm font-medium">Enfoca los síntomas</p>
                <p className="text-white/40 text-xs mt-1">
                  Manchas, amarillamiento, hongos, insectos
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <Leaf className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-white/80 text-sm font-medium">¿Tu planta no luce bien?</p>
                <p className="text-white/40 text-xs mt-1">
                  Obtén un diagnóstico y plan de acción
                </p>
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
      <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  )
}
