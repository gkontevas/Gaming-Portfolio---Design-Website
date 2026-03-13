'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

type Props = {
  value: number
  suffix?: string
}

export default function AnimatedCounter({ value, suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    const duration = 1800
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Expo-out easing: fast start, slow landing
      const eased = 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
      else setDisplay(value)
    }

    requestAnimationFrame(tick)
  }, [inView, value])

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  )
}
