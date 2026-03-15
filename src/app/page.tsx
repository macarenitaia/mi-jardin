import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirigir directamente a la página de plantas
  redirect('/plants')
}
