'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const areas: Record<string, string> = {
  origins:      'Hollowed Origins',
  remembrances: 'Remembrances of the Fallen',
  arsenal:      'Sacred Relics',
  worthy:       'The Worthy',
  scholars:     'Words of Scholars',
}

export default function AreaToast() {
  const [current, setCurrent] = useState<string | null>(null)
  const seen         = useRef<Set<string>>(new Set())
  const timer        = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // One pending dwell-timer per section — cancelled if section exits before delay fires
  const dwellTimers  = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const observers = Object.keys(areas).map((id) => {
      const el = document.getElementById(id)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (seen.current.has(id)) return

          if (entry.isIntersecting) {
            // Section entered the viewport band — start a dwell timer.
            // During programmatic scroll the section exits before 500ms and
            // the timer is cancelled below. Only the destination fires.
            const t = setTimeout(() => {
              dwellTimers.current.delete(id)
              if (seen.current.has(id)) return
              seen.current.add(id)
              clearTimeout(timer.current)
              setCurrent(id)
              timer.current = setTimeout(() => setCurrent(null), 3500)
            }, 500)
            dwellTimers.current.set(id, t)
          } else {
            // Section left before the delay — cancel pending toast
            const pending = dwellTimers.current.get(id)
            if (pending) {
              clearTimeout(pending)
              dwellTimers.current.delete(id)
            }
          }
        },
        { threshold: 0, rootMargin: '-30% 0px -30% 0px' }
      )
      observer.observe(el)
      return observer
    })

    return () => {
      observers.forEach((o) => o?.disconnect())
      clearTimeout(timer.current)
      dwellTimers.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="fixed bottom-2 right-2 z-[500] pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current}
            initial={{ x: '110%', opacity: 0 }}
            animate={{ x: 0,      opacity: 1 }}
            exit={{    x: '110%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col border border-gold/35 bg-cinder/95 backdrop-blur-sm px-3 py-2 sm:px-6 sm:py-4 min-w-[160px] sm:min-w-[260px]"
          >
            {/* ✦ ornament + label row */}
            <div className="flex items-center gap-2">
              <span className="text-gold/40 text-[10px]">✦</span>
              <span className="font-display text-[9px] tracking-[0.55em] text-bronze uppercase">
                Area Discovered
              </span>
            </div>

            {/* Section name */}
            <span className="mt-1.5 font-display text-xs sm:text-base tracking-[0.12em] text-gold uppercase">
              {areas[current]}
            </span>

            {/* Thin progress line that drains as the toast lives */}
            <motion.div
              className="mt-3 h-px bg-gold/20 origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3.5, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
