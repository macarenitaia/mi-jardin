import type { Metadata, Viewport } from 'next'
import { ServiceWorkerRegister } from '@/shared/components/ServiceWorkerRegister'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mi Jardín',
  description: 'Tu jardín inteligente — identifica plantas, diagnostica enfermedades y cuida tu jardín con IA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mi Jardín',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#052e16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
