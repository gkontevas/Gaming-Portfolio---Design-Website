'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

export default function SteamReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-18%' })

  return (
    <div ref={ref} className="relative w-full mb-1">
      {/* Corner tick marks */}
      <div className="absolute top-0 left-0   z-10 w-8 h-8 border-t border-l border-gold/60" />
      <div className="absolute top-0 right-0  z-10 w-8 h-8 border-t border-r border-gold/60" />
      <div className="absolute bottom-0 left-0  z-10 w-8 h-8 border-b border-l border-gold/60" />
      <div className="absolute bottom-0 right-0 z-10 w-8 h-8 border-b border-r border-gold/60" />

      {/* Scan line — sweeps top to bottom in sync with the clip reveal */}
      <motion.div
        className="absolute inset-x-0 z-20 h-[2px] pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, rgba(201,169,110,0.85) 35%, rgba(201,169,110,0.85) 65%, transparent 100%)',
          boxShadow: '0 0 14px 5px rgba(201,169,110,0.35)',
        }}
        initial={{ top: '0%', opacity: 0 }}
        animate={isInView ? { top: ['0%', '105%'], opacity: [0, 1, 1, 0] } : undefined}
        transition={{ duration: 1.6, ease: 'linear', delay: 0.45, times: [0, 0.04, 0.9, 1] }}
      />

      {/* Image — revealed from top to bottom, synced with scan line */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={isInView ? { clipPath: 'inset(0 0 0% 0)' } : undefined}
        transition={{ duration: 1.6, ease: 'linear', delay: 0.45 }}
      >
        <Image
          src="/steam.png"
          alt="Steam profile"
          width={1540}
          height={784}
          className="w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ash/40 via-transparent to-ash" />
        <div className="absolute inset-0 bg-gradient-to-r from-ash/30 to-transparent" />
      </motion.div>
    </div>
  )
}
