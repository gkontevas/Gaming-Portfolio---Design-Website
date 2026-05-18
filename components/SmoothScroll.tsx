'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
    __lenisLocked?: boolean
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      // lerp (linear interpolation factor) gives organic momentum-based inertia.
      // 0.08 = closes 8% of remaining distance per frame — feels weighty and cinematic.
      // Lower = slower/heavier, higher = snappier. 0.08–0.12 is the sweet spot.
      lerp: 0.08,
      smoothWheel: true,
      smoothTouch: false,  // native touch scroll feels better on mobile
      overscroll: false,
    })

    window.__lenis = lenis

    let rafId: number

    function raf(time: number) {
      if (!document.hidden && !window.__lenisLocked) lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return <>{children}</>
}
