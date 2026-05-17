'use client'

import { useEffect, useRef, useState } from 'react'

type Ember = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
}

export default function Embers() {
  const [embers, setEmbers] = useState<Ember[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEmbers(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left:     Math.random() * 100,
        size:     Math.random() * 2 + 1.5,
        duration: Math.random() * 5 + 6,
        delay:    Math.random() * 8,
        drift:    (Math.random() - 0.5) * 60,
      }))
    )
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute bottom-0 rounded-full bg-amber"
          style={{
            left:   `${e.left}%`,
            width:  e.size,
            height: e.size,
            animation: `ember-rise ${e.duration}s ${e.delay}s infinite ease-out`,
            '--drift': `${e.drift}px`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
