import type { IdentificationResult } from '../types'

export const identificationService = {
  async identifyPlant(imageBase64: string): Promise<IdentificationResult> {
    const response = await fetch('/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    })

    if (!response.ok) {
      const data = (await response.json()) as { error?: string }
      throw new Error(data.error ?? 'Error al identificar la planta')
    }

    const data = (await response.json()) as { result: IdentificationResult }
    return data.result
  },
}
