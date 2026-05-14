'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, animate, MotionValue } from 'framer-motion'

function AnimatedNumber({ motionValue }: { motionValue: MotionValue<number> }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    return motionValue.on('change', (v) => setDisplay(Math.round(v)))
  }, [motionValue])
  return <>{display}</>
}

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

  // Smoothed progress for content — adds physical lag so elements ease in rather than pop
  const contentProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 })

  // Shared exit range
  const exitStart = 0.82
  const exitEnd   = 0.95

  // Per-element staggered fade-in — all complete by ~2% scroll
  const eyebrowOpacity  = useTransform(contentProgress, [0,     0.006, exitStart, exitEnd], [0, 1, 1, 0])
  const titleOpacity    = useTransform(contentProgress, [0.003, 0.009, exitStart, exitEnd], [0, 1, 1, 0])
  const subtitleOpacity = useTransform(contentProgress, [0.005, 0.011, exitStart, exitEnd], [0, 1, 1, 0])
  const dividerOpacity  = useTransform(contentProgress, [0.007, 0.013, exitStart, exitEnd], [0, 1, 1, 0])
  const loreOpacity     = useTransform(contentProgress, [0.009, 0.015, exitStart, exitEnd], [0, 1, 1, 0])
  const statsOpacity    = useTransform(contentProgress, [0.011, 0.018, exitStart, exitEnd], [0, 1, 1, 0])
  const badgeOpacity    = useTransform(contentProgress, [0.014, 0.021, exitStart, exitEnd], [0, 1, 1, 0])

  // Staggered Y lifts on entry
  const eyebrowY = useTransform(contentProgress, [0,     0.012], [20, 0])
  const titleY   = useTransform(contentProgress, [0.003, 0.014], [28, 0])
  const bodyY    = useTransform(contentProgress, [0.005, 0.016], [18, 0])

  // Stat counters — animate on entry, not tied to scroll
  const hoursCount       = useMotionValue(0)
  const achievementCount = useMotionValue(0)
  const metacriticCount  = useMotionValue(0)
  const inView = useInView(outerRef, { once: true, margin: '0px 0px -10% 0px' })
  useEffect(() => {
    if (!inView) return
    const a = animate(hoursCount,       300, { duration: 2.2, ease: 'easeOut' })
    const b = animate(achievementCount,  42, { duration: 2.0, ease: 'easeOut' })
    const c = animate(metacriticCount,   96, { duration: 1.8, ease: 'easeOut' })
    return () => { a.stop(); b.stop(); c.stop() }
  }, [inView])

  // Scroll hint — fades out as soon as user starts scrolling
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0])

  return (
    <div ref={outerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── VIDEO ── */}
        <motion.div className="absolute inset-0" style={{ y: videoY }}>
          <motion.video
            src="/elden-ring.mp4"
            autoPlay muted loop playsInline
            className="h-full w-full object-cover"
            style={{ filter: videoFilter }}
          />
        </motion.div>

        {/* ── VIGNETTE ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)' }}
        />

        {/* ── OVERLAYS ── */}
        <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-black/95 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-ash via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

        {/* ── CONTENT ── */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28">

          {/* Eyebrow */}
          <motion.p
            className="font-display text-[9px] tracking-[0.6em] text-bronze/60 uppercase sm:text-[10px]"
            style={{ y: eyebrowY, opacity: eyebrowOpacity }}
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
              opacity: titleOpacity,
            }}
          >
            Elden Ring
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="mt-3 font-display text-xs tracking-[0.35em] text-amber/75 uppercase sm:text-sm"
            style={{ y: titleY, opacity: subtitleOpacity }}
          >
            Game of the Year · Metacritic 96
          </motion.p>

          {/* Divider */}
          <motion.div
            className="my-6 h-px w-16 bg-gold/35"
            style={{ y: bodyY, opacity: dividerOpacity }}
          />

          {/* Lore */}
          <motion.p
            className="max-w-xs font-body text-sm italic leading-relaxed text-bronze/80 sm:max-w-sm sm:text-base md:text-lg"
            style={{ y: bodyY, opacity: loreOpacity }}
          >
            A shattered ring. A shattered world. Three hundred hours wandered
            between their pieces. The Elden Ring was mended — every fragment
            accounted for.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="mt-7 flex gap-7 sm:gap-10"
            style={{ y: bodyY, opacity: statsOpacity }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="font-display text-2xl leading-none sm:text-3xl md:text-4xl"
                style={{ color: '#C9A96E', textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201,169,110,0.25)' }}
              >
                <AnimatedNumber motionValue={hoursCount} />h
              </span>
              <span className="font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">Hours Bound</span>
            </div>
            <div className="flex flex-col gap-1">
              <span
                className="font-display text-2xl leading-none sm:text-3xl md:text-4xl"
                style={{ color: '#C9A96E', textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201,169,110,0.25)' }}
              >
                <AnimatedNumber motionValue={achievementCount} />/42
              </span>
              <span className="font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">Achievements</span>
            </div>
            <div className="flex flex-col gap-1">
              <span
                className="font-display text-2xl leading-none sm:text-3xl md:text-4xl"
                style={{ color: '#C9A96E', textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201,169,110,0.25)' }}
              >
                <AnimatedNumber motionValue={metacriticCount} />
              </span>
              <span className="font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">Metacritic</span>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            className="mt-7 inline-flex items-center gap-2.5 self-start border border-amber/30 px-3 py-1.5 sm:px-4 sm:py-2"
            style={{ y: bodyY, opacity: badgeOpacity }}
          >
            <span className="text-amber/70 text-[10px]">✦</span>
            <span className="font-display text-[9px] tracking-[0.45em] text-amber/75 uppercase sm:text-[10px]">
              Remembrance · All Achievements
            </span>
            <span className="text-amber/70 text-[10px]">✦</span>
          </motion.div>

        </div>

        {/* ── SCROLL HINT ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: scrollHintOpacity }}
        >
          <span className="font-display text-[8px] tracking-[0.5em] text-bronze/40 uppercase">Scroll</span>
          <motion.span
            className="text-bronze/40 text-sm"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </motion.div>

      </div>
    </div>
  )
}
