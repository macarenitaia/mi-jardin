'use client'

import { PLANT_RECOMMENDATIONS } from '../services/lightService'

interface LightRecommendationsProps {
  currentLux?: number
}

export function LightRecommendations({ currentLux }: LightRecommendationsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-white">
        Recomendaciones de Plantas
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {PLANT_RECOMMENDATIONS.map((rec) => {
          const isCurrentRange =
            currentLux !== undefined &&
            currentLux >= rec.minLux &&
            currentLux < rec.maxLux

          return (
            <div
              key={rec.plantType}
              className={`p-6 rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isCurrentRange
                  ? 'bg-green-400'
                  : 'bg-white'
              }`}
            >
              <h3 className="text-xl font-black text-black mb-2">
                {rec.plantType}
              </h3>

              <div className="mb-3">
                <span className="text-sm font-bold text-black/70">
                  {rec.minLux === 0 ? '0' : rec.minLux.toLocaleString()} - {rec.maxLux === Infinity ? '∞' : rec.maxLux.toLocaleString()} lux
                </span>
              </div>

              <p className="text-sm text-black/80 mb-3">
                {rec.recommendation}
              </p>

              <div className="flex flex-wrap gap-2">
                {rec.examples.map((plant) => (
                  <span
                    key={plant}
                    className="px-3 py-1 bg-black text-white text-xs font-bold rounded-md"
                  >
                    {plant}
                  </span>
                ))}
              </div>

              {isCurrentRange && (
                <div className="mt-3 pt-3 border-t-2 border-black">
                  <p className="text-sm font-bold text-black">
                    ✓ Ideal para tu nivel de luz actual
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
