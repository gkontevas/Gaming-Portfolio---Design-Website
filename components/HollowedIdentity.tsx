'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function HollowedIdentity() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8%' })

  const fadeUp = (delay: number) => ({
    initial:    { opacity: 0, y: 18 },
    animate:    isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.75, ease, delay },
  })

  const slideUp = (delay: number) => ({
    initial:    { y: '108%' },
    animate:    isInView ? { y: '0%' } : {},
    transition: { duration: 0.85, ease, delay },
  })

  return (
    <div ref={ref} className="relative overflow-hidden border-b border-gold/15 pb-10 mb-10">

      {/* Ghost kanji — scale in slowly from slightly larger */}
      <motion.span
        className="pointer-events-none select-none absolute -right-4 -top-6 font-display text-[8rem] sm:text-[11rem] md:text-[14rem] leading-none text-gold/[0.06]"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2.2, ease, delay: 0.5 }}
      >
        両面宿儺
      </motion.span>

      {/* Eyebrow */}
      <motion.p
        className="mb-3 font-display text-xs tracking-[0.6em] text-bronze/70 uppercase"
        {...fadeUp(0)}
      >
        Ashen One · Greece
      </motion.p>

      {/* Visible kanji — slides up from behind the baseline */}
      <div className="overflow-hidden inline-block">
        <motion.h3
          className="font-display text-4xl tracking-[0.1em] text-gold sm:text-5xl"
          {...slideUp(0.1)}
        >
          両面宿儺
        </motion.h3>
      </div>

      {/* Name */}
      <div className="mt-2 overflow-hidden inline-block">
        <motion.p
          className="font-display text-sm tracking-[0.35em] text-bronze uppercase"
          {...slideUp(0.23)}
        >
          Dimos Gkontevas
        </motion.p>
      </div>

      {/* Quote — fades up with a longer delay for drama */}
      <motion.p
        className="mt-6 font-body text-xl italic text-bronze/80 sm:text-2xl"
        {...fadeUp(0.38)}
      >
        No build left unfinished. No questline left unseen.
      </motion.p>

    </div>
  )
}
