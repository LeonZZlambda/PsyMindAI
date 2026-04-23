import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Prefer the app's scroll container if present (landing or main content)
    const container = document.querySelector('.landing-wrapper, .main-content') as HTMLElement | null
    if (container && typeof container.scrollTo === 'function') {
      container.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }
    // Fallback to window scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
