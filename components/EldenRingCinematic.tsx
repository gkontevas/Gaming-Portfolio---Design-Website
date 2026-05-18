'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useInView, animate, MotionValue } from 'framer-motion'

function AnimatedNumber({ motionValue }: { motionValue: MotionValue<number> }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    return motionValue.on('change', (v) => setDisplay(Math.round(v)))
  }, [motionValue])
  return <>{display}</>
}

export default function EldenRingCinematic() {
  const ref = useRef<HTMLDivElement>(null)

  // Entry — opacity
  const eyebrowOp  = useMotionValue(0)
  const titleOp    = useMotionValue(0)
  const subtitleOp = useMotionValue(0)
  const dividerOp  = useMotionValue(0)
  const loreOp     = useMotionValue(0)
  const statsOp    = useMotionValue(0)
  const badgeOp    = useMotionValue(0)

  // Entry — Y lifts
  const eyebrowY = useMotionValue(20)
  const titleY   = useMotionValue(28)
  const bodyY    = useMotionValue(18)

  // Title letter-spacing expands on reveal
  const titleTracking = useMotionValue('0em')

  // Cinematic flash
  const flashOp = useMotionValue(0)

  // Letterbox bars
  const barTop    = useMotionValue('22%')
  const barBottom = useMotionValue('22%')

  // Stat counters
  const hoursCount       = useMotionValue(0)
  const achievementCount = useMotionValue(0)
  const metacriticCount  = useMotionValue(0)

  const inView = useInView(ref, { once: true, margin: '0px 0px -5% 0px' })

  useEffect(() => {
    if (!inView) return
    const e = 'easeOut'
    const d = 0.55

    animate(flashOp, [0, 0.18, 0], { duration: 0.65, ease: 'easeOut' })
    animate(barTop,    '0%', { duration: 0.75, ease: [0.16, 1, 0.3, 1] })
    animate(barBottom, '0%', { duration: 0.75, ease: [0.16, 1, 0.3, 1] })
    animate(titleTracking, '0.07em', { delay: 0.22, duration: 1.1, ease: [0.16, 1, 0.3, 1] })

    animate(eyebrowOp,  1, { delay: 0.1,  duration: d, ease: e })
    animate(eyebrowY,   0, { delay: 0.1,  duration: d, ease: e })
    animate(titleOp,    1, { delay: 0.22, duration: d, ease: e })
    animate(titleY,     0, { delay: 0.22, duration: d, ease: e })
    animate(subtitleOp, 1, { delay: 0.38, duration: d, ease: e })
    animate(dividerOp,  1, { delay: 0.46, duration: d, ease: e })
    animate(loreOp,     1, { delay: 0.54, duration: d, ease: e })
    animate(bodyY,      0, { delay: 0.38, duration: d, ease: e })
    animate(statsOp,    1, { delay: 0.64, duration: d, ease: e })
    animate(badgeOp,    1, { delay: 0.74, duration: d, ease: e })

    animate(hoursCount,        300, { delay: 0.64, duration: 2.2, ease: e })
    animate(achievementCount,   42, { delay: 0.64, duration: 2.0, ease: e })
    animate(metacriticCount,    96, { delay: 0.64, duration: 1.8, ease: e })
  }, [inView])

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height: '100dvh' }}>

      {/* ── VIDEO ── */}
      <video
        src="/elden-ring.mp4"
        autoPlay muted loop playsInline preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'brightness(0.72) contrast(1.12) saturate(1.15)' }}
      />

      {/* ── VIGNETTE ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 40% 50%, transparent 20%, rgba(0,0,0,0.85) 100%)' }}
      />

      {/* ── OVERLAYS ── */}
      <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-black/95 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-ash via-black/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/35 to-transparent" />

      {/* ── WARM FLASH ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: flashOp, background: 'radial-gradient(ellipse at 40% 50%, rgba(201,169,110,0.3) 0%, transparent 70%)' }}
      />

      {/* ── LETTERBOX BARS ── */}
      <motion.div className="absolute inset-x-0 top-0 z-10 bg-black" style={{ height: barTop }} />
      <motion.div className="absolute inset-x-0 bottom-0 z-10 bg-black" style={{ height: barBottom }} />

      {/* ── CONTENT ── */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28">
        <motion.p
          className="font-display text-[9px] tracking-[0.6em] text-bronze/60 uppercase sm:text-[10px]"
          style={{ opacity: eyebrowOp, y: eyebrowY }}
        >
          FromSoftware · 2022 · Featured Remembrance
        </motion.p>

        <motion.h2
          className="mt-3 font-display uppercase leading-none"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            letterSpacing: titleTracking,
            color: '#C9A96E',
            textShadow: '0 2px 60px rgba(0,0,0,0.9), 0 0 100px rgba(201,169,110,0.3)',
            opacity: titleOp,
            y: titleY,
          }}
        >
          Elden Ring
        </motion.h2>

        <motion.p
          className="mt-3 font-display text-xs tracking-[0.35em] text-amber/75 uppercase sm:text-sm"
          style={{ opacity: subtitleOp, y: titleY }}
        >
          Game of the Year · Metacritic 96
        </motion.p>

        <motion.div
          className="my-6 h-px w-16 bg-gold/35"
          style={{ opacity: dividerOp, y: bodyY }}
        />

        <motion.p
          className="max-w-xs font-body text-sm italic leading-relaxed text-bronze/80 sm:max-w-sm sm:text-base md:text-lg"
          style={{ opacity: loreOp, y: bodyY }}
        >
          A shattered ring. A shattered world. Three hundred hours wandered
          between their pieces. The Elden Ring was mended — every fragment
          accounted for.
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-10 sm:flex-nowrap"
          style={{ opacity: statsOp, y: bodyY }}
        >
          <div className="flex flex-col gap-1">
            <span
              className="font-display text-xl leading-none sm:text-3xl md:text-4xl"
              style={{ color: '#C9A96E', textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201,169,110,0.3)' }}
            >
              <AnimatedNumber motionValue={hoursCount} />h
            </span>
            <span className="font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">Hours Bound</span>
          </div>
          <div className="flex flex-col gap-1">
            <span
              className="font-display text-xl leading-none sm:text-3xl md:text-4xl"
              style={{ color: '#C9A96E', textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201,169,110,0.3)' }}
            >
              <AnimatedNumber motionValue={achievementCount} />/42
            </span>
            <span className="font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">Achievements</span>
          </div>
          <div className="flex flex-col gap-1">
            <span
              className="font-display text-xl leading-none sm:text-3xl md:text-4xl"
              style={{ color: '#C9A96E', textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201,169,110,0.3)' }}
            >
              <AnimatedNumber motionValue={metacriticCount} />
            </span>
            <span className="font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">Metacritic</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-7 inline-flex items-center gap-2.5 self-start border border-amber/30 px-3 py-1.5 sm:px-4 sm:py-2"
          style={{ opacity: badgeOp, y: bodyY }}
        >
          <span className="text-amber/70 text-[10px]">✦</span>
          <span className="font-display text-[9px] tracking-[0.45em] text-amber/75 uppercase sm:text-[10px]">
            Remembrance · All Achievements
          </span>
          <span className="text-amber/70 text-[10px]">✦</span>
        </motion.div>
      </div>

    </div>
  )
}
