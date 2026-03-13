'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type Ember = {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  drift: number
}

export default function Embers() {
  const [embers, setEmbers] = useState<Ember[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '200px' })

  useEffect(() => {
    setEmbers(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 2 + 1.5,
        duration: Math.random() * 5 + 6,
        delay: Math.random() * 8,
        drift: (Math.random() - 0.5) * 60,
      }))
    )
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((e) => (
        <motion.div
          key={e.id}
          className="absolute rounded-full bg-amber"
          style={{ left: `${e.x}%`, bottom: 0, width: e.size, height: e.size, willChange: 'transform, opacity' }}
          animate={isInView ? {
            y: [0, -600],
            x: [0, e.drift],
            opacity: [0, 0.9, 0.6, 0],
          } : { opacity: 0 }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
