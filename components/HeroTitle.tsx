'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Parallax from './Parallax'

const LETTERS = 'VESTIGES'.split('')
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function HeroTitle() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('intro-seen')) { setReady(true); return }
    function onDismiss() { setReady(true) }
    window.addEventListener('intro-dismissed', onDismiss)
    return () => window.removeEventListener('intro-dismissed', onDismiss)
  }, [])

  return (
    <>
      {/* ── TITLE ── */}
      <Parallax depth={0.3}>
        <div className="relative">
          {/* Ambient glow — breathes slowly behind the letters */}
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10 scale-150"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,169,110,0.13) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />

          <h1 className="mt-2 font-display uppercase">
            {/* VESTIGES — letter-by-letter stagger drop */}
            <motion.div
              className="flex justify-center gap-[0.05em] sm:gap-[0.14em]"
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
              }}
            >
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="block text-5xl text-gold sm:text-7xl md:text-9xl"
                  variants={{
                    hidden:   { opacity: 0, y: 38 },
                    visible:  { opacity: 1, y: 0, transition: { duration: 0.72, ease } },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* "of the Unlit" — slides up from behind the baseline */}
            <div className="mt-3 overflow-hidden">
              <motion.span
                className="block text-lg tracking-[0.3em] text-bronze sm:text-2xl sm:tracking-[0.65em]"
                initial={{ y: '110%' }}
                animate={ready ? { y: '0%' } : undefined}
                transition={{ duration: 0.85, ease, delay: 0.62 }}
              >
                of the Unlit
              </motion.span>
            </div>
          </h1>
        </div>
      </Parallax>

      {/* ── DIVIDER — lines grow outward from the ✦ ── */}
      <Parallax depth={0.2}>
        <div className="my-10 flex w-56 items-center gap-3">
          {/* Left line — grows from right edge (toward center) */}
          <div className="flex flex-1 justify-end overflow-hidden">
            <motion.div
              className="h-px w-full origin-right bg-gold/50"
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.9, ease, delay: 0.88 }}
            />
          </div>

          <motion.span
            className="shrink-0 text-sm text-gold/80"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.55, ease: 'backOut', delay: 0.78 }}
          >
            ✦
          </motion.span>

          {/* Right line — grows from left edge (toward right) */}
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="h-px w-full origin-left bg-gold/50"
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.9, ease, delay: 0.88 }}
            />
          </div>
        </div>
      </Parallax>
    </>
  )
}
