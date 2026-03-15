'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { X, Plus } from 'lucide-react'
import { PhotoUploader, type UploadedPhoto } from '@/shared/components/PhotoUploader'
import { cn } from '@/shared/lib/utils'
import type { PlantPhoto } from '../types'

interface PhotoTimelineProps {
  photos: PlantPhoto[]
  onAddPhoto: (file: File) => Promise<void>
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function PhotoTimeline({ photos, onAddPhoto }: PhotoTimelineProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handlePhotoChange = useCallback(
    async (photo: UploadedPhoto | null) => {
      if (!photo) return
      setIsUploading(true)
      try {
        await onAddPhoto(photo.file)
        setShowUploader(false)
      } finally {
        setIsUploading(false)
      }
    },
    [onAddPhoto]
  )

  return (
    <div>
      {/* Add photo button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/50 text-sm">
          {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
        </p>
        <button
          type="button"
          onClick={() => setShowUploader((v) => !v)}
          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Añadir foto
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="mb-4">
          <PhotoUploader
            onPhotoChange={handlePhotoChange}
            placeholder="Sube una foto o pégala con Ctrl+V"
            className="max-w-[160px]"
          />
          {isUploading && (
            <p className="text-white/50 text-xs mt-2">Subiendo foto...</p>
          )}
        </div>
      )}

      {/* Photos grid */}
      {photos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/40 text-sm">Sin fotos todavía</p>
          <p className="text-white/25 text-xs mt-1">Añade la primera foto de tu planta</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxUrl(photo.photo_url)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white/[0.05] border border-white/[0.08] cursor-pointer"
            >
              <Image
                src={photo.photo_url}
                alt="Foto de planta"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
              {/* Date overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] leading-tight">{formatDate(photo.taken_at)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-2xl w-full max-h-[80vh] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxUrl}
              alt="Foto de planta ampliada"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
