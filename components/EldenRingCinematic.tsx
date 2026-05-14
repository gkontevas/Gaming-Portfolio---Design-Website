'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function EldenRingCinematic() {
  const outerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  })

  // Parallax — video drifts up as you scroll through
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  // Brightness — starts visible, fades out at the very end only
  const videoFilter = useTransform(
    scrollYProgress,
    [0, 0.05, 0.85, 1.0],
    [
      'brightness(0.65) contrast(1.05)',
      'brightness(0.75) contrast(1.05)',
      'brightness(0.75) contrast(1.05)',
      'brightness(0.3)  contrast(1.05)',
    ]
  )

  // All content fades in fast, stays visible, exits at the very end
  const allOpacity  = useTransform(scrollYProgress, [0, 0.04, 0.85, 0.97], [0, 1, 1, 0])

  // Staggered Y lifts on entry only
  const eyebrowY    = useTransform(scrollYProgress, [0, 0.05], [20, 0])
  const titleY      = useTransform(scrollYProgress, [0.01, 0.06], [28, 0])
  const bodyY       = useTransform(scrollYProgress, [0.02, 0.08], [18, 0])

  return (
    <div ref={outerRef} className="relative h-[220vh]">

      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── VIDEO — no manual scaling; object-cover fills at native quality.
            The top/bottom gradient overlays absorb any baked-in letterbox bars. ── */}
        <motion.div
          className="absolute inset-0"
          style={{ y: videoY }}
        >
          <motion.video
            src="/elden-ring.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ filter: videoFilter }}
          />
        </motion.div>

        {/* ── OVERLAYS ── */}
        {/* Top — fades baked-in letterbox bar into dark background */}
        <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-black/95 to-transparent" />
        {/* Bottom — same, then transitions into page colour */}
        <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-ash via-black/80 to-transparent" />
        {/* Left-side dark wash so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

        {/* ── CONTENT ── */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28"
          style={{ opacity: allOpacity }}
        >

          {/* Eyebrow */}
          <motion.p
            className="font-display text-[9px] tracking-[0.6em] text-bronze/60 uppercase sm:text-[10px]"
            style={{ y: eyebrowY }}
          >
            FromSoftware · 2022 · Featured Remembrance
          </motion.p>

          {/* Title */}
          <motion.h2
            className="mt-3 font-display uppercase leading-none"
            style={{
              fontSize: 'clamp(3rem, 9vw, 7.5rem)',
              letterSpacing: '0.07em',
              color: '#C9A96E',
              textShadow: '0 2px 60px rgba(0,0,0,0.8), 0 0 80px rgba(201,169,110,0.2)',
              y: titleY,
            }}
          >
            Elden Ring
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="mt-3 font-display text-xs tracking-[0.35em] text-amber/75 uppercase sm:text-sm"
            style={{ y: titleY }}
          >
            Game of the Year · Metacritic 96
          </motion.p>

          {/* Divider */}
          <motion.div
            className="my-6 h-px w-16 bg-gold/35"
            style={{ y: bodyY }}
          />

          {/* Lore */}
          <motion.p
            className="max-w-xs font-body text-sm italic leading-relaxed text-bronze/80 sm:max-w-sm sm:text-base md:text-lg"
            style={{ y: bodyY }}
          >
            A shattered ring. A shattered world. Three hundred hours wandered
            between their pieces. The Elden Ring was mended — every fragment
            accounted for.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="mt-7 flex gap-7 sm:gap-10"
            style={{ y: bodyY }}
          >
            {[
              { value: '300h',  label: 'Hours Bound'  },
              { value: '42/42', label: 'Achievements' },
              { value: '96',    label: 'Metacritic'   },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="font-display text-2xl leading-none sm:text-3xl md:text-4xl"
                  style={{
                    color: '#C9A96E',
                    textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201,169,110,0.25)',
                  }}
                >
                  {value}
                </span>
                <span className="font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Badge */}
          <motion.div
            className="mt-7 inline-flex items-center gap-2.5 self-start border border-amber/30 px-3 py-1.5 sm:px-4 sm:py-2"
            style={{ y: bodyY }}
          >
            <span className="text-amber/70 text-[10px]">✦</span>
            <span className="font-display text-[9px] tracking-[0.45em] text-amber/75 uppercase sm:text-[10px]">
              Remembrance · All Achievements
            </span>
            <span className="text-amber/70 text-[10px]">✦</span>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
