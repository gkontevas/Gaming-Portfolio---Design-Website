'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import RevealText from '@/components/RevealText'
import FadeIn from '@/components/FadeIn'

const relics = [
  {
    rank: 1,
    title: "Clair Obscur: Expedition 33",
    hours: 126, achievements: "55/55",
    note: "Too bad Ubisoft. Your ex-devs know how to make a game.",
    image: "/clair.avif",
  },
  {
    rank: 2,
    title: "Sekiro: Shadows Die Twice",
    hours: 77, achievements: "34/34",
    note: "PARRY IT.",
    image: "/sekiro.jpg",
  },
  {
    rank: 3,
    title: "Elden Ring",
    hours: 300, achievements: "42/42",
    note: "What can I say about this game? Closest game to perfection ever.",
    image: "/elden ring.jpg",
  },
  {
    rank: 4,
    title: "Black Myth: Wukong",
    hours: 81, achievements: "81/81",
    note: "Amazing depiction of Chinese mythology.",
    image: "/wukong.webp",
  },
  {
    rank: 5,
    title: "Bloodborne",
    hours: 100, achievements: "40/40 PS4",
    note: "The best atmosphere out of all games I've played.",
    image: "/bloodborne.avif",
  },
]

export default function SacredRelics() {
  const outerRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vw', `-${(relics.length - 1) * 100}vw`]
  )

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActivePanel(Math.min(relics.length - 1, Math.round(v * (relics.length - 1))))
  })

  // Snap to nearest panel when scrolling stops
  useEffect(() => {
    const snapTimeout = { current: 0 }
    const isSnapping = { current: false }

    function snap() {
      if (!outerRef.current || isSnapping.current || window.__navScrolling) return
      const sectionTop  = outerRef.current.getBoundingClientRect().top + window.scrollY
      const scrollTravel = outerRef.current.offsetHeight - window.innerHeight
      const relative     = window.scrollY - sectionTop

      // Only act when inside the section
      if (relative < 0 || relative > scrollTravel) return

      const progress     = relative / scrollTravel
      const nearest      = Math.round(progress * (relics.length - 1))
      const target       = sectionTop + (scrollTravel * nearest / (relics.length - 1))

      if (Math.abs(window.scrollY - target) < 4) return

      isSnapping.current = true
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { duration: 0.5 })
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' })
      }
      setTimeout(() => { isSnapping.current = false }, 600)
    }

    function onScroll() {
      if (isSnapping.current || window.__navScrolling) return
      clearTimeout(snapTimeout.current)
      snapTimeout.current = window.setTimeout(snap, 80)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(snapTimeout.current)
    }
  }, [])

  return (
    <section
      id="arsenal"
      ref={outerRef}
      className="scroll-mt-20"
      style={{ height: `${relics.length * 80}vh` }}
    >
      <div className="sticky top-0 overflow-hidden bg-ash" style={{ height: '100dvh' }}>

        {/* SECTION HEADER */}
        <div className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pt-24 sm:pt-28 text-center pointer-events-none">
          <FadeIn>
            <p className="font-display text-[10px] tracking-[0.5em] text-bronze/70 uppercase">
              Achievement Unlocked
            </p>
          </FadeIn>
          <RevealText delay={0.1} className="font-display text-xl sm:text-2xl tracking-[0.2em] text-gold uppercase mt-2">
            Sacred Relics
          </RevealText>
          <FadeIn delay={0.25}>
            <div className="mt-4 h-px w-10 bg-gold/40" />
          </FadeIn>
        </div>

        {/* HORIZONTAL STRIP */}
        <motion.div
          className="flex h-full"
          style={{ x, width: `${relics.length * 100}vw` }}
        >
          {relics.map((relic) => (
            <div
              key={relic.rank}
              className="relative h-full overflow-hidden shrink-0"
              style={{ width: '100vw' }}
            >
              <Image
                src={relic.image}
                alt={relic.title}
                fill
                className="object-cover object-center"
                sizes="100vw"
                quality={80}
                loading={relic.rank === 1 ? 'eager' : 'lazy'}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-ash via-ash/80 to-ash/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-ash/80 via-transparent to-ash/60" />
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center, transparent 35%, rgba(13,10,7,0.65) 100%)'
              }} />

              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${
                relic.rank === 1 ? 'bg-amber/80' : 'bg-gold/25'
              }`} />

              <span
                className="pointer-events-none select-none absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 font-display leading-none text-gold/[0.05]"
                style={{ fontSize: 'clamp(6rem, 20vw, 18rem)' }}
              >
                {String(relic.rank).padStart(2, '0')}
              </span>

              <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32">
                <p className="mb-3 font-display text-[10px] tracking-[0.6em] text-bronze/50 uppercase">
                  {String(relic.rank).padStart(2, '0')} / 05
                </p>

                <h3
                  className={`font-display uppercase leading-[0.9] mb-4 ${
                    relic.rank === 1 ? 'text-amber' : 'text-gold'
                  }`}
                  style={{ fontSize: 'clamp(1.8rem, 5vw, 4.5rem)' }}
                >
                  {relic.title}
                </h3>

                <p className="font-body italic leading-relaxed text-bronze/80 max-w-xs sm:max-w-sm mb-6"
                   style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                  {relic.note}
                </p>

                <div className="flex gap-5 font-display text-xs tracking-widest text-bronze/40 uppercase">
                  <span>{relic.hours}h</span>
                  <span>·</span>
                  <span>{relic.achievements}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* PROGRESS DOTS */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {relics.map((_, i) => (
            <motion.div
              key={i}
              className="h-px bg-gold rounded-full"
              animate={{ width: i === activePanel ? 28 : 12, opacity: i === activePanel ? 1 : 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* SCROLL HINT desktop only */}
        <div className="absolute bottom-6 right-6 z-30 hidden sm:flex flex-col items-center gap-2">
          <span className="font-display text-[8px] tracking-[0.4em] text-bronze/30 uppercase"
                style={{ writingMode: 'vertical-rl' }}>scroll</span>
          <motion.span
            className="text-bronze/30 text-sm"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >↓</motion.span>
        </div>

      </div>
    </section>
  )
}
