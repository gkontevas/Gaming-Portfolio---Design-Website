'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import FadeIn from './FadeIn'
import { bosses, type Boss } from '@/data/bosses'

function BossPanel({ boss, index }: { boss: Boss; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-12% 0px' })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80])

  const isLeft = index % 2 === 0

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay },
  })

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">

      {/* ── BACKGROUND IMAGE ── */}
      {boss.image ? (
        <motion.div className="absolute inset-0 scale-125" style={{ y: imageY }}>
          <Image
            src={boss.image}
            alt={boss.name}
            fill
            loading={index === 0 ? 'eager' : 'lazy'}
            quality={90}
            className="object-cover"
            style={{
              objectPosition: boss.objectPosition ?? 'center',
              filter: 'contrast(1.12) brightness(0.9) saturate(1.1)',
            }}
            sizes="(max-width: 768px) 200vw, 100vw"
          />
        </motion.div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 60%, #1C1409 0%, #0D0A07 80%)' }}
        />
      )}

      {/* ── GRADIENT OVERLAYS ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-ash via-ash/60 to-transparent" />
      <div className={`absolute inset-0 ${
        isLeft
          ? 'bg-gradient-to-r from-ash/90 via-ash/40 to-transparent'
          : 'bg-gradient-to-l from-ash/90 via-ash/40 to-transparent'
      }`} />
      {/* Top darkening */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ash/60 to-transparent" />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(13,10,7,0.55) 100%)'
      }} />

      {/* ── GHOST INDEX ── */}
      <div className={`absolute top-6 select-none md:top-12 ${isLeft ? 'right-6 md:right-12' : 'left-6 md:left-12'}`}>
        <span className="font-display text-[96px] leading-none text-gold/[0.06]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* ── CONTENT ── */}
      <div className={`absolute bottom-0 max-w-2xl p-8 md:p-16 left-0 ${!isLeft ? 'sm:left-auto sm:right-0 sm:text-right' : ''}`}>

        <motion.p
          className="mb-4 font-display text-[10px] tracking-[0.5em] text-bronze/70 uppercase"
          {...reveal(0.05)}
        >
          {boss.game}
        </motion.p>

        <motion.h2
          className="font-display text-5xl leading-none text-gold sm:text-7xl md:text-8xl"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}
          {...reveal(0.15)}
        >
          {boss.name}
        </motion.h2>

        {/* HP bar */}
        <motion.div
          className={`mt-4 mb-1 flex items-center gap-3 ${!isLeft ? 'sm:justify-end' : ''}`}
          {...reveal(0.25)}
        >
          <span className="font-display text-[8px] tracking-[0.4em] text-bronze/40 uppercase">HP</span>
          <div className="relative h-[6px] w-44 md:w-64 overflow-hidden border border-gold/15 bg-white/[0.03]">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber via-gold to-gold/40"
              initial={{ width: '0%' }}
              animate={isInView ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            />
          </div>
        </motion.div>

        <motion.p
          className="mt-3 font-display text-[10px] tracking-[0.35em] text-amber uppercase"
          {...reveal(0.3)}
        >
          {boss.title}
        </motion.p>

        <motion.div
          className={`my-6 h-px w-16 bg-gold/35 ${!isLeft ? 'sm:ml-auto' : ''}`}
          {...reveal(0.38)}
        />

        <motion.p
          className="font-body text-base italic leading-relaxed text-bronze/80 md:text-lg"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
          {...reveal(0.46)}
        >
          {boss.quote}
        </motion.p>

      </div>
    </section>
  )
}

export default function BossShowcase() {
  return (
    <div id="worthy">

      {/* ── SECTION INTRO ── */}
      <section className="relative px-8 py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ash via-cinder to-ash pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(201,169,110,0.04) 0%, transparent 70%)'
        }} />
        <div className="relative">
          <FadeIn>
            <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze/70 uppercase">
              Combat Log
            </p>
            <h2 className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
              The Worthy
            </h2>
            <div className="mx-auto my-6 h-px w-16 bg-gold/40" />
            <p className="mx-auto max-w-md font-body text-sm leading-relaxed text-bronze/80">
              Not all battles are remembered equally. These are the ones that left something permanent — in the muscle, in the mind, in the way you think about challenge itself.
            </p>
          </FadeIn>
        </div>
      </section>

      {bosses.map((boss, index) => (
        <BossPanel key={boss.id} boss={boss} index={index} />
      ))}

      <div className="h-px bg-gold/10" />
    </div>
  )
}
