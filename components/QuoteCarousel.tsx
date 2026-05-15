'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'

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
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

function quoteSize(q: string): string {
  if (q.length < 30) return 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none'
  if (q.length < 80) return 'text-3xl sm:text-4xl md:text-5xl leading-snug'
  return 'text-xl sm:text-2xl md:text-3xl leading-relaxed'
}

// Word-level variants for short punchy quotes
const wordContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const wordVariants = {
  hidden:  { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease } },
}

export default function QuoteCarousel() {
  const [index, setIndex]   = useState(0)
  const [paused, setPaused] = useState(false)
  const barControls         = useAnimation()

  const goTo = useCallback((next: number) => { setIndex(next) }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => goTo((index + 1) % quotes.length), DURATION)
    return () => clearInterval(timer)
  }, [index, paused, goTo])

  useEffect(() => {
    barControls.set({ scaleX: 0 })
    if (!paused) barControls.start({ scaleX: 1, transition: { duration: DURATION / 1000, ease: 'linear' } })
  }, [index, barControls, paused])

  useEffect(() => {
    if (paused) {
      barControls.stop()
    } else {
      barControls.start({ scaleX: 1, transition: { duration: DURATION / 1000, ease: 'linear' } })
    }
  }, [paused, barControls])

  const current = quotes[index]
  const isShort = current.quote.length < 40
  const words   = current.quote.split(' ')

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ghost quotation mark */}
      <span
        className="pointer-events-none absolute -top-8 -left-4 sm:-top-12 sm:left-0 select-none font-body text-[16rem] sm:text-[22rem] leading-none text-gold/[0.04]"
        aria-hidden
      >
        &ldquo;
      </span>

      {/* Quote stage */}
      <div className="relative min-h-[28rem] flex flex-col items-center justify-center py-16 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{   opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease }}
            className="flex flex-col items-center"
          >
            {/* Game label */}
            <motion.p
              className="mb-8 font-display text-[9px] tracking-[0.6em] text-bronze/40 uppercase"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
            >
              {current.game}
            </motion.p>

            {/* Quote — word stagger for short quotes, plain blur-in for long */}
            {isShort ? (
              <motion.div
                className={`flex flex-wrap justify-center gap-x-[0.28em] font-body italic text-gold max-w-5xl ${quoteSize(current.quote)}`}
                variants={wordContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {words.map((word, i) => (
                  <motion.span key={i} variants={wordVariants}>
                    {i === 0 ? `“${word}` : i === words.length - 1 ? `${word}”` : word}
                  </motion.span>
                ))}
              </motion.div>
            ) : (
              <motion.p
                className={`font-body italic text-gold max-w-5xl ${quoteSize(current.quote)}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease, delay: 0.1 }}
              >
                &ldquo;{current.quote}&rdquo;
              </motion.p>
            )}

            {/* Source — slides in from the left */}
            <motion.div
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: isShort ? 0.55 : 0.4 }}
            >
              <div className="h-px w-8 bg-gold/30" />
              <p className="font-display text-xs tracking-[0.4em] text-bronze/60 uppercase">
                {current.source}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full h-px bg-gold/10">
        <motion.div
          className="h-px bg-gold/40"
          style={{ originX: 0 }}
          animate={barControls}
        />
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => goTo((index - 1 + quotes.length) % quotes.length)}
          className="font-display text-xs tracking-widest text-bronze/50 uppercase hover:text-gold transition-colors duration-300"
        >
          ← Prev
        </button>

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
