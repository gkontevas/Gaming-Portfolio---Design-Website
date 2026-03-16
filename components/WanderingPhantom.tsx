'use client'

/*
  WanderingPhantom — a translucent ghost silhouette that occasionally
  drifts across the screen, like seeing another player's phantom in DS.

  Appears 15–25 seconds after load, then every 70–110 seconds after that.
  Picks a random vertical position (25–75% of viewport) and direction.
  Walks slowly across the full screen width (18 seconds), bobbing slightly.
  Fades in at the start, fades out at the end.
*/

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type State = {
  active:    boolean
  direction: 'ltr' | 'rtl'
  top:       number   // vh units
}

// A simple hollow-warrior silhouette — broad shoulders, cape, sword at rest
function PhantomFigure() {
  return (
    <svg
      width="28" height="68"
      viewBox="0 0 28 68"
      fill="currentColor"
    >
      {/* Head */}
      <ellipse cx="14" cy="8" rx="6.5" ry="7.5" />
      {/* Neck */}
      <rect x="11" y="14" width="6" height="3" />
      {/* Torso — wide at shoulders, slight taper */}
      <path d="M3 17 L25 17 L22 39 L6 39 Z" />
      {/* Cape billowing behind (left side when facing right) */}
      <path d="M6 19 C1 28 0 40 4 54 L6 39 Z" opacity="0.55" />
      {/* Left arm */}
      <path d="M4 20 L0 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Right arm — sword held low */}
      <path d="M24 20 L28 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Sword blade (subtle) */}
      <line x1="27" y1="33" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      {/* Left leg */}
      <path d="M9 39 L7 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Right leg — slightly offset for a mid-stride pose */}
      <path d="M19 39 L21 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export default function WanderingPhantom() {
  const [state, setState] = useState<State>({ active: false, direction: 'ltr', top: 50 })

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    function spawn() {
      const direction: 'ltr' | 'rtl' = Math.random() > 0.5 ? 'ltr' : 'rtl'
      const top = 25 + Math.random() * 50   // 25–75vh

      setState({ active: true, direction, top })

      // Schedule next appearance (70–110 seconds from now)
      timeout = setTimeout(spawn, 70_000 + Math.random() * 40_000)
    }

    // First appearance: 15–25 seconds after load
    timeout = setTimeout(spawn, 15_000 + Math.random() * 10_000)
    return () => clearTimeout(timeout)
  }, [])

  // Direction drives start/end X positions and horizontal flip
  const startX  = state.direction === 'ltr' ? '-60px' : 'calc(100vw + 60px)'
  const endX    = state.direction === 'ltr' ? 'calc(100vw + 60px)' : '-60px'
  const scaleX  = state.direction === 'rtl' ? -1 : 1

  return (
    <AnimatePresence>
      {state.active && (
        <motion.div
          key={String(state.top)}   // remount cleanly each appearance
          className="fixed z-[9980] pointer-events-none"
          style={{
            top:    `${state.top}vh`,
            scaleX,
            color:  'rgba(160, 210, 255, 0.42)',
            filter: 'blur(0.4px) drop-shadow(0 0 6px rgba(140,190,255,0.35))',
          }}
          initial={{ x: startX, opacity: 0 }}
          animate={{
            x:       endX,
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            x:       { duration: 18, ease: 'linear' },
            opacity: { duration: 18, times: [0, 0.04, 0.94, 1], ease: 'linear' },
          }}
          onAnimationComplete={() => setState(s => ({ ...s, active: false }))}
        >
          {/* Subtle vertical bob — simulates a walking gait */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PhantomFigure />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
