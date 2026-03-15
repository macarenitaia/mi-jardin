'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Shield,
  RefreshCw,
  Save,
  Leaf,
} from 'lucide-react'
import { GlassCard } from '@/shared/components/GlassCard'
import { GlassButton } from '@/shared/components/GlassButton'
import { cn } from '@/shared/lib/utils'
import { diagnosisService } from '../services/diagnosisService'
import type { DiagnosisResult as DiagnosisResultType } from '../types'

interface DiagnosisResultProps {
  result: DiagnosisResultType
  photoUrl: string
  userId?: string
  plantId?: string
  onReset: () => void
}

const urgencyStyles: Record<DiagnosisResultType['urgency'], string> = {
  inmediata:
    'bg-red-500/20 border border-red-400/30 text-red-300 animate-pulse',
  'esta semana':
    'bg-amber-500/20 border border-amber-400/30 text-amber-300',
  'puede esperar':
    'bg-yellow-500/20 border border-yellow-400/30 text-yellow-200',
  ninguna:
    'bg-emerald-500/10 border border-emerald-400/20 text-emerald-300',
}

const severityStyles: Record<DiagnosisResultType['severity'], string> = {
  grave: 'bg-red-500/20 border border-red-400/30 text-red-300',
  moderado: 'bg-amber-500/20 border border-amber-400/30 text-amber-300',
  leve: 'bg-green-500/20 border border-green-400/30 text-green-300',
  ninguno: 'bg-emerald-500/10 border border-emerald-400/20 text-emerald-300',
}

const urgencyLabel: Record<DiagnosisResultType['urgency'], string> = {
  inmediata: 'Urgencia inmediata',
  'esta semana': 'Esta semana',
  'puede esperar': 'Puede esperar',
  ninguna: 'Sin urgencia',
}

const severityLabel: Record<DiagnosisResultType['severity'], string> = {
  grave: 'Grave',
  moderado: 'Moderado',
  leve: 'Leve',
  ninguno: 'Ninguno',
}

export function DiagnosisResult({
  result,
  photoUrl,
  userId,
  plantId,
  onReset,
}: DiagnosisResultProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!userId) return
    setIsSaving(true)
    setSaveError(null)
    try {
      await diagnosisService.saveDiagnosis(userId, result, photoUrl, plantId)
      setSaved(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  if (result.isHealthy) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-8 bg-emerald-500/[0.06] border-emerald-400/20" highlight>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">¡Tu planta está sana! 🌿</h2>
              <p className="text-white/60 mt-2 text-sm">
                No se detectaron enfermedades ni problemas visibles.
              </p>
            </div>
          </div>
        </GlassCard>

        {result.preventionTips.length > 0 && (
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-teal-400" />
              <h3 className="text-white font-semibold">Consejos de prevención</h3>
            </div>
            <ul className="space-y-2">
              {result.preventionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                  <Leaf className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        <GlassButton variant="secondary" size="md" onClick={onReset} className="w-full">
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Diagnosticar otra planta
          </span>
        </GlassButton>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Badges urgencia + severidad */}
      <div className="flex flex-wrap gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
            urgencyStyles[result.urgency]
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {urgencyLabel[result.urgency]}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
            severityStyles[result.severity]
          )}
        >
          {result.severity === 'grave' && <AlertTriangle className="w-3.5 h-3.5" />}
          Severidad: {severityLabel[result.severity]}
        </span>
      </div>

      {/* Nombre de enfermedad */}
      <GlassCard className="p-6" highlight>
        <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Diagnóstico</p>
        <h2 className="text-2xl font-bold text-white">{result.disease}</h2>
      </GlassCard>

      {/* Síntomas */}
      {result.symptoms.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Síntomas identificados
          </h3>
          <ul className="space-y-2">
            {result.symptoms.map((symptom, i) => (
              <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Causas */}
      {result.causes.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-3">Posibles causas</h3>
          <ul className="space-y-2">
            {result.causes.map((cause, i) => (
              <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Plan de acción */}
      {result.actionPlan.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3 px-1">Plan de acción</h3>
          <div className="space-y-3">
            {result.actionPlan.map((step) => (
              <GlassCard key={step.step} className="p-4 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 font-bold text-lg">{step.step}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm">{step.action}</p>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">{step.detail}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Consejos de prevención */}
      {result.preventionTips.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="text-white font-semibold">Prevención futura</h3>
          </div>
          <ul className="space-y-2">
            {result.preventionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                <Leaf className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Error guardar */}
      {saveError && (
        <GlassCard className="p-4 border-red-400/20 bg-red-500/[0.08]">
          <p className="text-red-300 text-sm text-center">{saveError}</p>
        </GlassCard>
      )}

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        {userId && !saved && (
          <GlassButton
            variant="secondary"
            size="md"
            onClick={handleSave}
            loading={isSaving}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Guardar diagnóstico
            </span>
          </GlassButton>
        )}
        {saved && (
          <GlassCard className="p-3 bg-emerald-500/[0.08] border-emerald-400/20">
            <p className="text-emerald-300 text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Diagnóstico guardado correctamente
            </p>
          </GlassCard>
        )}
        <GlassButton variant="ghost" size="md" onClick={onReset} className="w-full">
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Diagnosticar otra planta
          </span>
        </GlassButton>
      </div>
    </div>
  )
}
