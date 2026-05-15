'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate as fmAnimate } from 'framer-motion'

type Props = {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    // On refresh (intro already seen this session), enable immediately
    if (sessionStorage.getItem('intro-seen')) {
      setReady(true)
      return
    }
    function onDismiss() { setReady(true) }
    window.addEventListener('intro-dismissed', onDismiss)
    return () => window.removeEventListener('intro-dismissed', onDismiss)
  }, [])

  const offset = 32
  const shouldAnimate = ready && isInView

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === 'up' ? offset : 0,
        x: direction === 'left' ? -offset : direction === 'right' ? offset : 0,
      }}
      animate={shouldAnimate ? { opacity: 1, y: 0, x: 0 } : undefined}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
