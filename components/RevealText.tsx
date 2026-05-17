'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children: React.ReactNode
  delay?: number
  className?: string
}

// Cinematic clip-path sweep: text is hidden behind a right-side mask that
// retracts left-to-right, revealing the text underneath.
export default function RevealText({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (sessionStorage.getItem('intro-seen')) { setReady(true); return }
    function onDismiss() { setReady(true) }
    window.addEventListener('intro-dismissed', onDismiss)
    return () => window.removeEventListener('intro-dismissed', onDismiss)
  }, [])

  const shouldAnimate = ready && isInView

  return (
    <div ref={ref} style={{ overflow: done ? 'visible' : 'hidden', display: 'inline-block' }}>
      <motion.div
        className={className}
        initial={{ y: '105%' }}
        animate={shouldAnimate ? { y: '0%' } : undefined}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
        onAnimationComplete={() => setDone(true)}
      >
        {children}
      </motion.div>
    </div>
  )
}
