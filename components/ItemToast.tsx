'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Item {
  name: string
  description: string
}

const sectionItems: Record<string, Item> = {
  origins: {
    name: 'Burden of the Chosen',
    description: 'Knowledge of where you came from. Heavy, but necessary.',
  },
  remembrances: {
    name: 'Golden Rune [Ancient]',
    description: 'The crystallised memory of a world fully conquered. Of immense value.',
  },
  arsenal: {
    name: 'Sacred Seal of the Completionist',
    description: 'Proof of absolute devotion. Every achievement. Every world.',
  },
  worthy: {
    name: 'Soulprint of the Fallen',
    description: 'What a great enemy leaves behind. Not a trophy — a teaching.',
  },
  scholars: {
    name: 'Fragrant Branch of Yore',
    description: 'Words preserved past their speaker\'s death. Some knowledge refuses to be forgotten.',
  },
}

const DWELL_MS = 10_000

export default function ItemToast() {
  const [current, setCurrent] = useState<string | null>(null)
  const dwellTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const shown       = useRef<Set<string>>(new Set())
  const hideTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const observers = Object.keys(sectionItems).map(id => {
      const el = document.getElementById(id)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (shown.current.has(id)) return

          if (entry.isIntersecting) {
            const t = setTimeout(() => {
              dwellTimers.current.delete(id)
              if (shown.current.has(id)) return
              shown.current.add(id)
              clearTimeout(hideTimer.current)
              setCurrent(id)
              window.dispatchEvent(new CustomEvent('combatlog', {
                detail: `Acquired: ${sectionItems[id].name}.`,
              }))
              hideTimer.current = setTimeout(() => setCurrent(null), 5000)
            }, DWELL_MS)
            dwellTimers.current.set(id, t)
          } else {
            const pending = dwellTimers.current.get(id)
            if (pending) {
              clearTimeout(pending)
              dwellTimers.current.delete(id)
            }
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      return observer
    })

    return () => {
      observers.forEach(o => o?.disconnect())
      dwellTimers.current.forEach(clearTimeout)
      clearTimeout(hideTimer.current)
    }
  }, [])

  const item = current ? sectionItems[current] : null

  return (
    <div className="fixed top-4 right-4 z-[450] pointer-events-none">
      <AnimatePresence>
        {item && (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1,  y: 0,   scale: 1    }}
            exit={{    opacity: 0,  y: -8,   scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="border border-amber/35 bg-cinder/95 backdrop-blur-sm px-4 py-3 min-w-[200px] sm:min-w-[260px]"
            style={{ boxShadow: '0 0 30px rgba(232,201,122,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber/60 text-[10px]">✦</span>
              <span className="font-display text-[9px] tracking-[0.55em] text-amber/70 uppercase">
                Item Acquired
              </span>
            </div>

            {/* Item name */}
            <p className="font-display text-sm tracking-[0.12em] text-amber uppercase leading-snug">
              {item.name}
            </p>

            {/* Flavour text */}
            <p className="mt-1.5 font-body text-xs italic leading-relaxed text-bronze/70">
              {item.description}
            </p>

            {/* Drain bar */}
            <motion.div
              className="mt-3 h-px bg-amber/25 origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
