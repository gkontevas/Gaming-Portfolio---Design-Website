'use client'

import { useEffect } from 'react'

// Keys 1–5 jump to each section in order
const keyMap: Record<string, string> = {
  '1': '#origins',
  '2': '#remembrances',
  '3': '#arsenal',
  '4': '#worthy',
  '5': '#scholars',
}

export default function KeyboardNav() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't fire while typing in a form field
      if (e.target instanceof HTMLInputElement)   return
      if (e.target instanceof HTMLTextAreaElement) return
      // Don't hijack browser shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const href = keyMap[e.key]
      if (href) {
        e.preventDefault()
        window.__lenis?.scrollTo(href)
      }

      // Escape scrolls back to the very top
      if (e.key === 'Escape') {
        e.preventDefault()
        window.__lenis?.scrollTo(0)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Renders nothing — pure behaviour component
  return null
}
