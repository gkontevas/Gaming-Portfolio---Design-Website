'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

type Props = { visible: boolean }

export default function YouGoneHollow({ visible }: Props) {
  /*
    Portal guard — createPortal needs document.body which only
    exists in the browser. On the server (Next.js SSR) document
    is undefined, so we wait until the component mounts.
  */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        >

          {/* ── LAYER 1: Blur / fog ─────────────────────────────
              Now rendered at body level via portal — backdrop-blur
              blurs the ENTIRE page, not just the parent container.
          */}
          <motion.div
            className="absolute inset-0 backdrop-blur-xl"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeIn' }}
          />

          {/* ── LAYER 2: Pure black ──────────────────────────────
              Fades in after the blur settles.
          */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.4, ease: 'easeIn' }}
          />

          {/* ── TEXT ─────────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">

            {/* Top line — smaller, sets up the punchline */}
            <motion.p
              className="font-display text-lg tracking-[0.45em] uppercase sm:text-2xl md:text-3xl"
              style={{ color: 'rgba(139,42,26,0.65)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
            >
              You Have Gone
            </motion.p>

            {/* Main word — massive, fills the screen */}
            <motion.p
              className="font-display text-[clamp(3.5rem,18vw,10rem)] tracking-[0.08em] uppercase leading-none"
              style={{
                color: '#8B2A1A',
                textShadow: '0 0 60px rgba(139,42,26,0.9), 0 0 120px rgba(139,42,26,0.4)',
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 1.6, ease: 'easeOut' }}
            >
              Hollow
            </motion.p>

            {/* Lore whisper */}
            <motion.p
              className="mt-8 font-body text-sm italic tracking-[0.3em] text-bronze/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 1.2, ease: 'easeOut' }}
            >
              The fire within you has faded.
            </motion.p>

          </div>

        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
