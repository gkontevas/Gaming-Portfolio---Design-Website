'use client'

import { useState } from 'react'
import YouGoneHollow from './YouGoneHollow'

export default function HollowTrigger() {
  const [active, setActive] = useState(false)

  function trigger() {
    if (active) return
    setActive(true)
    // After 5.5s, set active to false — AnimatePresence will run the exit animation
    setTimeout(() => setActive(false), 5500)
  }

  return (
    <>
      <p className="font-body text-lg italic leading-loose text-bronze">
        What remains after the fire fades is not ash. It is memory.
      </p>
      <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-bronze/80">
        These are the remembrances of a wanderer who would not stay{' '}
        <span
          onClick={trigger}
          className="text-base transition-all duration-300"
          style={{
            color: '#8B2A1A',
            textShadow: '0 0 8px rgba(139,42,26,0.5)',
            fontStyle: 'italic',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.textShadow = '0 0 16px rgba(139,42,26,0.9)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.textShadow = '0 0 8px rgba(139,42,26,0.5)'
          }}
        >
          hollow
        </span>
        .
      </p>

      <YouGoneHollow visible={active} />
    </>
  )
}
