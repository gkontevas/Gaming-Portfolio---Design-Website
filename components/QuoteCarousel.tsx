'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const quotes = [
  {
    quote: "Hesitation is defeat.",
    source: "Genichiro Ashina",
    game: "Sekiro: Shadows Die Twice",
  },
  {
    quote: "We are born of the blood, made men by the blood, undone by the blood. Our eyes are yet to open. Fear the old blood.",
    source: "Intro Narration",
    game: "Bloodborne",
  },
  {
    quote: "Don't be sorry. Be better.",
    source: "Kratos",
    game: "God of War",
  },
  {
    quote: "I have never known defeat.",
    source: "Malenia, Blade of Miquella",
    game: "Elden Ring",
  },
  {
    quote: "Don't you dare go hollow.",
    source: "Firelink Shrine",
    game: "Dark Souls",
  },
  {
    quote: "Not all shackles are made of iron.",
    source: "The Narrator",
    game: "Black Myth: Wukong",
  },
  {
    quote: "The cycle ends here. We must be better than this.",
    source: "Kratos",
    game: "God of War: Ragnarök",
  },
  {
    quote: "Maidenless behaviour.",
    source: "White Mask Varre",
    game: "Elden Ring",
  },
]

const DURATION = 5500

/*
  quoteSize — maps character count → Tailwind size class.

  Short, punchy lines ("Hesitation is defeat.") should fill the screen.
  Long quotes shrink to stay readable.
*/
function quoteSize(q: string): string {
  if (q.length < 30) return 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none'
  if (q.length < 80) return 'text-3xl sm:text-4xl md:text-5xl leading-snug'
  return 'text-xl sm:text-2xl md:text-3xl leading-relaxed'
}

export default function QuoteCarousel() {
  const [index, setIndex]       = useState(0)
  const [paused, setPaused]     = useState(false)
  const [progress, setProgress] = useState(0)

  const goTo = useCallback((next: number) => {
    setIndex(next)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => goTo((index + 1) % quotes.length), DURATION)
    return () => clearInterval(timer)
  }, [index, paused, goTo])

  useEffect(() => { setProgress(0) }, [index])

  useEffect(() => {
    if (paused) return
    const tick = setInterval(() => {
      setProgress(p => Math.min(p + (50 / DURATION) * 100, 100))
    }, 50)
    return () => clearInterval(tick)
  }, [index, paused])

  const current = quotes[index]

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── GHOST QUOTATION MARK ──────────────────────────────
          Enormous, barely visible — atmosphere, not decoration.
          Bleeds off the top-left of the container intentionally.
          This is the only "visual" element around the quote;
          boxes and borders would cage it. This liberates it.
      */}
      <span
        className="pointer-events-none absolute -top-8 -left-4 sm:-top-12 sm:left-0 select-none font-body text-[16rem] sm:text-[22rem] leading-none text-gold/[0.04]"
        aria-hidden
      >
        &ldquo;
      </span>

      {/* ── QUOTE STAGE ───────────────────────────────────────
          Fixed height so layout never shifts between quotes.
          Lots of vertical padding — negative space IS the design.
      */}
      <div className="relative min-h-[28rem] flex flex-col items-center justify-center py-16 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Game label — tiny, floating above, barely there */}
            <motion.p
              className="mb-8 font-display text-[9px] tracking-[0.6em] text-bronze/40 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {current.game}
            </motion.p>

            {/* The quote — this IS the section */}
            <p className={`font-body italic text-gold max-w-5xl ${quoteSize(current.quote)}`}>
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Source — a single thin line and a name, nothing more */}
            <motion.div
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="h-px w-8 bg-gold/30" />
              <p className="font-display text-xs tracking-[0.4em] text-bronze/60 uppercase">
                {current.source}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CONTROLS ──────────────────────────────────────────
          Kept minimal so they don't compete with the quote.
          Progress bar is full-width and very faint —
          you notice it's counting down, but it doesn't shout.
      */}

      {/* Full-width progress line */}
      <div className="w-full h-px bg-gold/10">
        <motion.div
          className="h-px bg-gold/40 origin-left"
          style={{ scaleX: progress / 100 }}
          transition={{ duration: 0 }}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => goTo((index - 1 + quotes.length) % quotes.length)}
          className="font-display text-xs tracking-widest text-bronze/50 uppercase hover:text-gold transition-colors duration-300"
        >
          ← Prev
        </button>

        {/* Dot indicators */}
        <div className="flex gap-3">
          {quotes.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="flex items-center justify-center">
              <motion.div
                animate={{
                  width:           i === index ? 20 : 5,
                  backgroundColor: i === index ? '#C9A96E' : 'rgba(201,169,110,0.2)',
                }}
                transition={{ duration: 0.3 }}
                className="h-px rounded-full"
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => goTo((index + 1) % quotes.length)}
          className="font-display text-xs tracking-widest text-bronze/50 uppercase hover:text-gold transition-colors duration-300"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
