'use client'

/*
  HudBars — Dark Souls-style HP + Stamina bars in the hero HUD.

  HP drains as the user scrolls down the page (using Framer Motion's
  useScroll → useTransform to map scroll progress to a width percentage).

  Stamina tracks scroll *velocity* — fast scrolling drains it, pausing
  regenerates it. This runs in a requestAnimationFrame loop so it's
  always in sync with the current frame, not just scroll events.
*/

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HudBars() {
  // scrollYProgress goes 0→1 from page top to page bottom.
  // We map it to HP width: full at the top, 10% at the very bottom.
  const { scrollYProgress } = useScroll()
  const hpWidth = useTransform(scrollYProgress, [0, 1], ['100%', '10%'])

  // Stamina is velocity-based — tracked in a RAF loop
  const [stamina, setStamina] = useState(100)
  const prevScrollY = useRef(0)

  useEffect(() => {
    let raf: number

    function tick() {
      const current = window.scrollY
      const velocity = Math.abs(current - prevScrollY.current)
      prevScrollY.current = current

      setStamina(prev => {
        if (velocity > 1.5) {
          // Drain proportional to scroll speed, clamped so it never snaps to 0
          return Math.max(0, prev - velocity * 0.6)
        }
        // Regenerate at a fixed rate when still — feels exactly like DS stamina
        return Math.min(100, prev + 1.5)
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="flex flex-col gap-1.5 w-36">

      {/* ── HP BAR ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <span className="font-display text-[9px] tracking-[0.35em] text-bronze/60 uppercase">HP</span>
        <div className="relative h-1.5 w-full bg-black/60 border border-white/8 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 h-full"
            style={{
              width: hpWidth,
              background: 'linear-gradient(to right, #7A2010, #C9501A, #E8801A)',
            }}
          />
        </div>
      </div>

      {/* ── STAMINA BAR ────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <span className="font-display text-[9px] tracking-[0.35em] text-bronze/60 uppercase">Stamina</span>
        <div className="relative h-1 w-full bg-black/60 border border-white/8 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 h-full transition-all duration-75"
            style={{
              width: `${stamina}%`,
              background: 'linear-gradient(to right, #1A5C2A, #2E9E48)',
            }}
          />
        </div>
      </div>

    </div>
  )
}
