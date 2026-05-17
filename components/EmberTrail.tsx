'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import FadeIn from './FadeIn'
import RevealText from './RevealText'

type Entry = {
  title: string
  note: string | null
  perfect: boolean
  image: string | null
  inscription: string
}

const PATH: Entry[] = [
  {
    title: 'Bloodborne',
    note: 'The Old Hunters',
    perfect: true,
    image: '/bloodborne.avif',
    inscription: 'The first hunt. Nothing before prepared me for Yharnam. Nothing after was ever quite the same.',
  },
  {
    title: 'Sekiro',
    note: 'Shadows Die Twice',
    perfect: true,
    image: '/sekiro.jpg',
    inscription: 'Death was not failure — death was the lesson. Every hour spent dying was an hour spent learning.',
  },
  {
    title: 'Elden Ring',
    note: '+ Shadow of the Erdtree',
    perfect: true,
    image: '/elden ring.jpg',
    inscription: 'Three hundred hours. Every grace lit, every secret unearthed. The world that defined everything after it.',
  },
  {
    title: 'Dark Souls: Remastered',
    note: null,
    perfect: true,
    image: '/ds.jpg',
    inscription: 'Played after the Lands Between. Finally understood what the fire was always about.',
  },
  {
    title: 'Dark Souls II',
    note: 'Scholar of the First Sin',
    perfect: true,
    image: '/ds2.jpg',
    inscription: 'The one they call lesser. I found patience given form here. All crowns claimed. The cycle, witnessed.',
  },
  {
    title: 'Dark Souls III',
    note: '+ Ashes of Ariandel · The Ringed City',
    perfect: true,
    image: '/ds3.webp',
    inscription: 'The last linking. Both DLCs carried through. The age of fire, witnessed at last to its full end.',
  },
  {
    title: 'Elden Ring: Nightreign',
    note: null,
    perfect: true,
    image: '/nightreign.avif',
    inscription: 'A different shape of the same flame. The nights do not end — and neither, it turns out, does the hunter.',
  },
]

function TrailEntry({ entry, index }: { entry: Entry; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const isEven = index % 2 === 0
  const nodeColor   = entry.perfect ? '#C9A96E' : '#8B2A1A'
  const glowColor   = entry.perfect ? 'rgba(201,169,110,0.35)' : 'rgba(139,42,26,0.35)'
  const borderColor = entry.perfect ? 'rgba(201,169,110,0.45)' : 'rgba(139,42,26,0.45)'

  const textContent = (
    <motion.div
      className={`flex flex-col gap-3 ${isEven ? 'items-end text-right' : 'items-start text-left'}`}
      initial={{ opacity: 0, x: isEven ? -24 : 24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <p className="font-display text-lg tracking-[0.15em] text-gold uppercase md:text-xl">
        {entry.title}
      </p>
      {entry.note && (
        <p className="font-display text-[9px] tracking-[0.45em] text-bronze/55 uppercase">
          {entry.note}
        </p>
      )}
      <div className={`h-px w-8 bg-gold/30 ${isEven ? 'self-end' : 'self-start'}`} />
      <p className="font-body text-sm leading-relaxed text-bronze/75 italic max-w-[260px]">
        {entry.inscription}
      </p>
    </motion.div>
  )

  const imageContent = (
    <motion.div
      initial={{ opacity: 0, x: isEven ? 24 : -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      {entry.image ? (
        <div
          className="relative h-36 w-full md:h-44 overflow-hidden"
          style={{
            outline: `1px solid ${borderColor}`,
            outlineOffset: '0px',
            boxShadow: isInView ? `0 0 48px rgba(0,0,0,0.7), 0 0 20px ${glowColor}` : 'none',
            transition: 'box-shadow 1s ease',
          }}
        >
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 380px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ash/60 via-transparent to-transparent" />
        </div>
      ) : (
        <div
          className="relative h-36 w-full md:h-44"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,42,26,0.10) 0%, rgba(13,10,7,0.9) 70%)',
            outline: '1px solid rgba(139,42,26,0.18)',
          }}
        />
      )}
    </motion.div>
  )

  const node = (
    <div className="flex justify-center relative z-10">
      <motion.div
        className="w-11 h-11 rounded-full flex items-center justify-center border"
        style={{
          background: '#0D0A07',
          borderColor: isInView ? borderColor : 'rgba(122,101,69,0.12)',
          transition: 'border-color 0.8s ease',
        }}
        animate={isInView ? {
          boxShadow: [
            `0 0 14px ${glowColor}`,
            `0 0 28px ${glowColor}`,
            `0 0 14px ${glowColor}`,
          ],
        } : { boxShadow: '0 0 0px rgba(0,0,0,0)' }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="font-display text-xs select-none"
          style={{ color: nodeColor }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          ✦
        </motion.span>
      </motion.div>
    </div>
  )

  return (
    <div ref={ref}>
      {/* Mobile */}
      <div className="flex flex-col items-center gap-5 py-10 md:hidden">
        {node}
        {imageContent}
        <div className="flex flex-col items-center text-center gap-3 px-4">
          <p className="font-display text-lg tracking-[0.15em] text-gold uppercase">{entry.title}</p>
          {entry.note && (
            <p className="font-display text-[9px] tracking-[0.45em] text-bronze/55 uppercase">{entry.note}</p>
          )}
          <div className="h-px w-8 bg-gold/30" />
          <p className="font-body text-sm leading-relaxed text-bronze/75 italic">{entry.inscription}</p>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[1fr_3.5rem_1fr] md:items-center md:gap-10 md:py-14">
        {isEven ? textContent : imageContent}
        {node}
        {isEven ? imageContent : textContent}
      </div>
    </div>
  )
}

export default function EmberTrail() {
  const entriesRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: entriesRef,
    offset: ['start 80%', 'end 20%'],
  })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="trail"
      className="px-8 py-36 scroll-mt-20"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #191007 0%, #0D0A07 55%)' }}
    >
      <div className="mx-auto max-w-3xl">

        <FadeIn className="mb-20 flex flex-col items-center text-center">
          <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
            Path Discovered
          </p>
          <RevealText delay={0.1} className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
            Trail of Embers
          </RevealText>
          <div className="my-6 h-px w-16 bg-gold/40" />
          <p className="font-body text-sm leading-relaxed text-bronze max-w-xs">
            In the order they were faced. In the order they changed everything.
          </p>
        </FadeIn>

        {/* Spine + entries */}
        <div ref={entriesRef} className="relative">

          {/* Ghost line — faint full-height guide */}
          <div
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
            style={{ background: 'rgba(201,169,110,0.06)' }}
          />
          {/* Animated fill line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 overflow-hidden md:block">
            <motion.div
              className="h-full w-full"
              style={{
                scaleY: lineScaleY,
                transformOrigin: 'top',
                background: 'linear-gradient(to bottom, rgba(201,169,110,0.55), rgba(201,169,110,0.2), rgba(201,169,110,0.05))',
              }}
            />
          </div>

          {PATH.map((entry, i) => (
            <TrailEntry key={entry.title} entry={entry} index={i} />
          ))}

        </div>

      </div>
    </section>
  )
}
