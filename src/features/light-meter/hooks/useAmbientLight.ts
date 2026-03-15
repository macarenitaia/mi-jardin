'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AmbientLightState, LightLevel } from '../types'
import { classifyLightLevel } from '../services/lightService'

/**
 * Hook para usar el Ambient Light Sensor API
 *
 * IMPORTANTE: El Ambient Light Sensor API solo funciona en:
 * - Chrome/Edge en contextos seguros (HTTPS o localhost)
 * - No funciona en Firefox, Safari
 *
 * Este hook proporciona un fallback a entrada manual si el API no está disponible
 */
export function useAmbientLight() {
  const [state, setState] = useState<AmbientLightState>({
    lux: null,
    level: null,
    isSupported: false,
    error: null,
    isReading: false,
  })

  const [sensor, setSensor] = useState<any>(null)

  // Verificar soporte del API
  useEffect(() => {
    const checkSupport = () => {
      if (!('AmbientLightSensor' in window)) {
        setState((prev) => ({
          ...prev,
          isSupported: false,
          error: 'Ambient Light Sensor no está disponible en este navegador. Usa entrada manual.',
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        isSupported: true,
        error: null,
      }))
    }

    checkSupport()
  }, [])

  // Iniciar lectura del sensor
  const startReading = useCallback(async () => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: 'El sensor de luz no está disponible en este dispositivo',
      }))
      return
    }

    try {
      // @ts-expect-error - AmbientLightSensor no está en los tipos de TypeScript
      const newSensor = new AmbientLightSensor({ frequency: 1 })

      newSensor.addEventListener('reading', () => {
        const lux = Math.round(newSensor.illuminance)
        const level = classifyLightLevel(lux)

        setState({
          lux,
          level,
          isSupported: true,
          error: null,
          isReading: true,
        })
      })

      newSensor.addEventListener('error', (event: any) => {
        setState((prev) => ({
          ...prev,
          error: `Error del sensor: ${event.error.name}`,
          isReading: false,
        }))
      })

      await newSensor.start()
      setSensor(newSensor)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al iniciar el sensor',
        isReading: false,
      }))
    }
  }, [state.isSupported])

  // Detener lectura del sensor
  const stopReading = useCallback(() => {
    if (sensor) {
      sensor.stop()
      setSensor(null)
      setState((prev) => ({
        ...prev,
        isReading: false,
      }))
    }
  }, [sensor])

  // Establecer lectura manual
  const setManualReading = useCallback((lux: number) => {
    const level = classifyLightLevel(lux)
    setState({
      lux,
      level,
      isSupported: state.isSupported,
      error: null,
      isReading: false,
    })
  }, [state.isSupported])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (sensor) {
        sensor.stop()
      }
    }
  }, [sensor])

  return {
    ...state,
    startReading,
    stopReading,
    setManualReading,
  }
}
