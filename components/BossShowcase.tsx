'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
// useInView still used for health bar
import FadeIn from './FadeIn'
import { bosses, type Boss } from '@/data/bosses'


function BossPanel({ boss, index }: { boss: Boss; index: number }) {
  const ref = useRef<HTMLElement>(null)

  // isInView drives both the letter stagger and the health bar fill.
  // margin: '-15% 0px' means the panel must be 15% into the viewport before triggering.
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  // Parallax: image drifts ±80px as the panel scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80])

  const isLeft = index % 2 === 0

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">

      {/* ── BACKGROUND IMAGE or dark fallback ── */}
      {boss.image ? (
        <motion.div className="absolute inset-0 scale-125" style={{ y: imageY }}>
          <Image
            src={boss.image}
            alt={boss.name}
            fill
            loading="eager"
            quality={90}
            className="object-cover"
            style={{
              objectPosition: boss.objectPosition ?? 'center',
              filter: 'contrast(1.08) brightness(0.95)',
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
      <div className="absolute inset-0 bg-gradient-to-t from-ash via-ash/70 to-ash/10" />
      <div className={`absolute inset-0 ${
        isLeft
          ? 'bg-gradient-to-r from-ash/85 via-ash/30 to-transparent'
          : 'bg-gradient-to-l from-ash/85 via-ash/30 to-transparent'
      }`} />

      {/* ── GHOST INDEX NUMBER ── */}
      <div className={`absolute top-6 select-none md:top-12 ${
        isLeft ? 'right-6 md:right-12' : 'left-6 md:left-12'
      }`}>
        <span className="font-display text-[96px] leading-none text-gold/[0.06]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* ── CONTENT ──
          Always left on mobile.
          Alternates left/right on sm+ screens.
      ── */}
      <div className={`absolute bottom-0 max-w-2xl p-8 md:p-16 left-0 ${
        !isLeft ? 'sm:left-auto sm:right-0 sm:text-right' : ''
      }`}>

        {/* Game label */}
        <FadeIn delay={0.05}>
          <p className="mb-4 font-display text-[10px] tracking-[0.45em] text-bronze uppercase">
            {boss.game}
          </p>
        </FadeIn>

        {/* Boss name */}
        <FadeIn delay={0.15}>
          <h2 className="font-display text-5xl leading-none text-gold sm:text-7xl md:text-8xl">
            {boss.name}
          </h2>
        </FadeIn>

        {/* ── BOSS HEALTH BAR ──
            Styled after Souls boss HP bars:
            - Thin container with subtle border
            - Amber→gold gradient fill animates from 0→100% on enter
            - "HP" label in tiny display font
            - Aligns right on right-side panels
        ── */}
        <div className={`mt-2 mb-1 flex items-center gap-3 ${!isLeft ? 'sm:justify-end' : ''}`}>
<div className="relative h-[5px] w-44 md:w-64 overflow-hidden border border-gold/20 bg-white/[0.03]">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber via-gold to-gold/50"
              initial={{ width: '0%' }}
              animate={isInView ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            />
          </div>
        </div>

        {/* Boss subtitle */}
        <FadeIn delay={0.3}>
          <p className="mt-3 font-display text-[10px] tracking-[0.3em] text-amber uppercase">
            {boss.title}
          </p>
        </FadeIn>

        {/* Divider */}
        <FadeIn delay={0.35}>
          <div className={`my-6 h-px w-16 bg-gold/40 ${!isLeft ? 'sm:ml-auto' : ''}`} />
        </FadeIn>

        {/* Personal quote */}
        <FadeIn delay={0.45}>
          <p className="font-body text-base italic leading-relaxed text-bronze/80 md:text-lg">
            {boss.quote}
          </p>
        </FadeIn>

      </div>
    </section>
  )
}

export default function BossShowcase() {
  return (
    <div id="worthy">

      {/* ── SECTION INTRO ── */}
      <section className="relative px-8 py-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-cinder via-ash to-ash pointer-events-none" />
        <div className="relative">
          <FadeIn>
            <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
              Combat Log
            </p>
            <h2 className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
              The Worthy
            </h2>
            <div className="mx-auto my-6 h-px w-16 bg-gold/40" />
            <p className="mx-auto max-w-md font-body text-sm leading-relaxed text-bronze">
              Not all battles are remembered equally. These are the ones that left something permanent — in the muscle, in the mind, in the way you think about challenge itself.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── BOSS PANELS ── */}
      {bosses.map((boss, index) => (
        <BossPanel key={boss.id} boss={boss} index={index} />
      ))}

      {/* ── CLOSING BREATH ── */}
      <div className="h-px bg-gold/15" />
    </div>
  )
}
