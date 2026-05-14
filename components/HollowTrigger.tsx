'use client'

import { useEffect, useRef, useState } from 'react'
import YouGoneHollow from './YouGoneHollow'

export default function HollowTrigger() {
  const [active, setActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function trigger() {
    if (active) return
    setActive(true)
    timerRef.current = setTimeout(() => setActive(false), 5500)
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <>
      <p className="font-body text-lg italic leading-loose text-bronze">
        What remains after the fire fades is not ash. It is memory.
      </p>
      <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-bronze/80">
        These are the remembrances of a wanderer who would not stay{' '}
        <button
          onClick={trigger}
          className="text-base transition-all duration-300 bg-transparent border-0 p-0 font-body italic"
          style={{
            color: '#8B2A1A',
            textShadow: '0 0 8px rgba(139,42,26,0.5)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.textShadow = '0 0 16px rgba(139,42,26,0.9)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.textShadow = '0 0 8px rgba(139,42,26,0.5)'
          }}
        >
          hollow
        </button>
        .
      </p>

      <YouGoneHollow visible={active} />
    </>
  )
}
