'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// Extend the window type so TypeScript knows about our global lenis instance
declare global {
  interface Window {
    __lenis?: Lenis
    __lenisLocked?: boolean   // set to true by modals to completely freeze the RAF
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Expose on window so any client component (e.g. Nav) can call lenis.scrollTo()
    window.__lenis = lenis

    function raf(time: number) {
      if (!document.hidden && !window.__lenisLocked) lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return <>{children}</>
}
