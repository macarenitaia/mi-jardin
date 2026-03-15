'use client'

import type { LightLevel } from '../types'
import { getLightLevelConfig, getLightLevelColor } from '../services/lightService'

interface LightReadingProps {
  lux: number
  level: LightLevel
}

export function LightReading({ lux, level }: LightReadingProps) {
  const config = getLightLevelConfig(level)
  const colors = getLightLevelColor(level)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Círculo medidor con gradiente */}
      <div
        className={`relative w-64 h-64 rounded-full border-8 border-black bg-gradient-to-br ${colors.gradient} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center`}
      >
        <div className="text-6xl font-black text-black">
          {lux.toLocaleString()}
        </div>
        <div className="text-xl font-bold text-black">lux</div>
      </div>

      {/* Etiqueta del nivel */}
      <div
        className={`px-6 py-3 ${colors.bg} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg`}
      >
        <p className={`text-xl font-bold ${colors.text}`}>{config.label}</p>
      </div>

      {/* Descripción */}
      <div className="text-center max-w-md">
        <p className="text-white/80 text-sm">
          Nivel de luz medido: <span className="font-bold">{config.label}</span>
        </p>
        <p className="text-white/60 text-xs mt-1">
          Rango: {config.min === 0 ? '0' : config.min.toLocaleString()} - {config.max === Infinity ? '∞' : config.max.toLocaleString()} lux
        </p>
      </div>
    </div>
  )
}
