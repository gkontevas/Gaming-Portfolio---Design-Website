'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ── SLIDES ────────────────────────────────────────────────────────────────────
// 'disclaimer' renders as a structured card.
// 'text' renders as a single italic cinematic line.
// hold = ms the slide stays visible AFTER the fade-in completes.

type Slide =
  | { kind: 'disclaimer'; hold: number }
  | { kind: 'text'; text: string; hold: number }

const SLIDES: Slide[] = [
  { kind: 'disclaimer',                                                                                 hold: 5500 },
  { kind: 'text', text: "You stand at the threshold of something personal.",                           hold: 2200 },
  { kind: 'text', text: "This is not a portfolio.",                                                    hold: 1800 },
  { kind: 'text', text: "It is an archive of obsession —\nevery world consumed, every flame carried beyond reason.", hold: 3400 },
  { kind: 'text', text: "The largest project I have ever built\nfor myself alone.",                    hold: 2600 },
  { kind: 'text', text: "Welcome.",                                                                    hold: 1600 },
]

const FADE_IN  = 700
const FADE_OUT = 380

// ── HELPERS ───────────────────────────────────────────────────────────────────

const easeSpring = [0.16, 1, 0.3, 1] as [number, number, number, number]

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.6 } },
}
const letterVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeSpring } },
}
const LETTERS = 'VESTIGES'.split('')

function CornerOrnament({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg width="88" height="88" viewBox="0 0 88 88" fill="none"
      className="absolute" style={style}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }}>
      <path d="M 6 84 L 6 6 L 84 6"     stroke="#C9A96E" strokeWidth="1"   opacity="0.35" />
      <path d="M 16 84 L 16 16 L 84 16" stroke="#C9A96E" strokeWidth="0.5" opacity="0.18" />
      <rect x="2.3"  y="2.3"  width="7"   height="7"   transform="rotate(45 6 6)"   fill="#7A6545" stroke="#C9A96E" strokeWidth="0.5" opacity="0.7"  />
      <rect x="13.8" y="13.8" width="4.5" height="4.5" transform="rotate(45 16 16)" fill="#C9A96E" opacity="0.2"  />
      <line x1="2"  y1="84" x2="10" y2="84" stroke="#C9A96E" strokeWidth="1"   opacity="0.3"  />
      <line x1="84" y1="2"  x2="84" y2="10" stroke="#C9A96E" strokeWidth="1"   opacity="0.3"  />
      <line x1="12" y1="84" x2="20" y2="84" stroke="#C9A96E" strokeWidth="0.5" opacity="0.15" />
      <line x1="84" y1="12" x2="84" y2="20" stroke="#C9A96E" strokeWidth="0.5" opacity="0.15" />
    </motion.svg>
  )
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

function Divider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div className="flex items-center gap-4 w-72"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay }}>
      <div className="flex-1 h-px bg-gold/20" />
      <span className="text-gold/40 text-xs">✦</span>
      <div className="flex-1 h-px bg-gold/20" />
    </motion.div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
// step 0 = cinematic (disclaimer + welcome slides, fully auto)
// step 1 = VESTIGES title (click / key to enter)
// step 2 = dismissed

export default function IntroScreen() {
  const [step,       setStep]       = useState<0 | 1 | 2>(0)
  const [mounted,    setMounted]    = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [exiting,    setExiting]    = useState(false)
  const skippedRef  = useRef(false)
  // Single ref tracks the active timer so cleanup always cancels the right one.
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slideRef    = useRef(0)

  // ── INIT ────────────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (sessionStorage.getItem('intro-seen')) {
      skippedRef.current = true
      setStep(2)
    } else {
      document.body.style.overflow = 'hidden'
    }
    document.getElementById('intro-cover')?.remove()
    setMounted(true)
    return () => { document.body.style.overflow = '' }
  }, [])

  // ── CINEMATIC TIMER (only depends on `step`) ────────────────────────────────
  // Using refs for slide state so the effect never re-runs mid-sequence.
  useEffect(() => {
    if (step !== 0) return

    slideRef.current = 0
    setSlideIndex(0)
    setExiting(false)

    function schedule() {
      const slide = SLIDES[slideRef.current]

      timerRef.current = setTimeout(() => {
        // Start exit animation
        setExiting(true)

        timerRef.current = setTimeout(() => {
          const next = slideRef.current + 1
          if (next >= SLIDES.length) {
            setStep(1)
          } else {
            slideRef.current = next
            setSlideIndex(next)
            setExiting(false)
            schedule()
          }
        }, FADE_OUT)

      }, FADE_IN + slide.hold)
    }

    schedule()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [step])  // intentionally excludes slideIndex / exiting

  // ── VESTIGES: click / key to dismiss ────────────────────────────────────────
  useEffect(() => {
    if (step !== 1) return
    function dismiss() {
      document.body.style.overflow = ''
      sessionStorage.setItem('intro-seen', '1')
      window.dispatchEvent(new Event('intro-dismissed'))
      setStep(2)
    }
    document.addEventListener('keydown', dismiss)
    document.addEventListener('click',   dismiss)
    return () => {
      document.removeEventListener('keydown', dismiss)
      document.removeEventListener('click',   dismiss)
    }
  }, [step])

  function skipCinematic() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStep(1)
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  if (!mounted || step === 2) return null

  return (
    <AnimatePresence>
      {step < 2 && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-ash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: skippedRef.current ? 0 : 1.5, ease: 'easeInOut' }}
        >

          {/* ── STEP 0: CINEMATIC SEQUENCE ──────────────────────────────── */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div key="cinematic"
                className="absolute inset-0 flex flex-col items-center justify-center px-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}>

                {/* Subtle bottom ember glow */}
                <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-48"
                  style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,120,40,0.09) 0%, transparent 70%)' }} />

                {/* Slide */}
                <motion.div
                  key={slideIndex}
                  className="relative max-w-lg w-full text-center"
                  animate={{ opacity: exiting ? 0 : 1, y: exiting ? -10 : 0 }}
                  initial={{ opacity: 0, y: 12 }}
                  transition={{ duration: exiting ? FADE_OUT / 1000 : FADE_IN / 1000, ease: easeSpring }}
                >
                  {SLIDES[slideIndex].kind === 'disclaimer' ? (

                    /* ── DISCLAIMER CARD ─────────────────────────────────── */
                    <div className="relative px-8 py-10">
                      <div className="absolute top-0 left-0  w-4 h-4 border-t border-l border-gold/35" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/35" />
                      <div className="absolute bottom-0 left-0  w-4 h-4 border-b border-l border-gold/35" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/35" />

                      <p className="mb-3 font-display text-[9px] tracking-[0.55em] text-bronze/60 uppercase">
                        Before You Enter
                      </p>
                      <h2 className="font-display text-lg tracking-[0.2em] text-gold uppercase mb-5">
                        Asset Credits
                      </h2>
                      <div className="h-px w-10 bg-gold/30 mx-auto mb-5" />
                      <p className="font-body text-sm leading-relaxed text-bronze/80 mb-3">
                        Some visual and audio assets — including game artwork, screenshots, and music —
                        belong to their respective creators and publishers.
                        Used here solely for personal, non-commercial portfolio purposes.
                        No ownership or affiliation is claimed.
                      </p>
                      <p className="font-body text-sm leading-relaxed text-bronze/55">
                        Concerns? Contact me at{' '}
                        <span className="text-amber">dimosgkontevas1@gmail.com</span>
                      </p>
                    </div>

                  ) : (

                    /* ── CINEMATIC TEXT SLIDE ────────────────────────────── */
                    <div>
                      <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-px w-8 bg-gold/20" />
                        <span className="text-gold/20 text-[8px]">✦</span>
                        <div className="h-px w-8 bg-gold/20" />
                      </div>
                      <p className="font-body text-xl sm:text-2xl italic leading-relaxed text-bronze/85 whitespace-pre-line">
                        {(SLIDES[slideIndex] as Extract<Slide, { kind: 'text' }>).text}
                      </p>
                      <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="h-px w-8 bg-gold/20" />
                        <span className="text-gold/20 text-[8px]">✦</span>
                        <div className="h-px w-8 bg-gold/20" />
                      </div>
                    </div>

                  )}
                </motion.div>

                {/* Progress dots */}
                <div className="absolute bottom-16 flex items-center gap-2">
                  {SLIDES.map((_, i) => (
                    <motion.div key={i} className="rounded-full bg-gold"
                      animate={{ width: i === slideIndex ? 20 : 5, height: 5, opacity: i === slideIndex ? 0.65 : 0.18 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }} />
                  ))}
                </div>

                {/* Skip hint — bottom right corner */}
                <motion.button
                  onClick={skipCinematic}
                  className="absolute bottom-8 right-8 font-display text-[9px] tracking-[0.4em] text-bronze/65 uppercase hover:text-gold transition-colors duration-300"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                  <span className="sm:hidden">Double tap to skip</span>
                  <span className="hidden sm:inline">Click to skip</span>
                </motion.button>

              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STEP 1: VESTIGES TITLE ──────────────────────────────────── */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div key="vestiges"
                className="absolute inset-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

                <video src="/fire-bg.mp4" autoPlay muted loop playsInline preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, #0D0A07 0%, rgba(13,10,7,0.70) 22%, rgba(13,10,7,0.70) 78%, #0D0A07 100%)'
                }} />

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                  <CornerOrnament style={{ top: 24, left: 24 }} />
                  <CornerOrnament style={{ top: 24, right: 24, transform: 'scaleX(-1)' }} />
                  <CornerOrnament style={{ bottom: 24, left: 24, transform: 'scaleY(-1)' }} />
                  <CornerOrnament style={{ bottom: 24, right: 24, transform: 'scale(-1,-1)' }} />

                  <FadeUp delay={0.2} className="relative mb-10 text-center">
                    <p className="font-display text-xs tracking-[0.2em] sm:tracking-[0.6em] text-bronze uppercase px-4">
                      A Record of Worlds Consumed
                    </p>
                  </FadeUp>

                  <Divider delay={0.4} />

                  <h1 className="relative font-display text-center uppercase mt-8 mb-4">
                    <motion.div className="flex justify-center gap-[0.2em] sm:gap-[0.3em]"
                      variants={containerVariants} initial="hidden" animate="visible">
                      {LETTERS.map((letter, i) => (
                        <motion.span key={i} variants={letterVariants}
                          className="block text-6xl text-gold sm:text-7xl md:text-8xl lg:text-9xl">
                          {letter}
                        </motion.span>
                      ))}
                    </motion.div>
                    <motion.span className="mt-4 block text-xl tracking-[0.8em] text-bronze"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.7 }}>
                      of the Unlit
                    </motion.span>
                  </h1>

                  <Divider delay={1.8} />

                  <FadeUp delay={2.0} className="relative mt-6 text-center">
                    <p className="font-display text-xs tracking-[0.5em] text-bronze uppercase">
                      Age of Fire · Year 2026
                    </p>
                  </FadeUp>

                  <motion.p className="relative mt-10 font-display text-sm tracking-[0.4em] text-gold uppercase"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 2.5 }}
                    style={{ animation: 'blink 1.4s ease-in-out infinite', animationDelay: '2.5s' }}>
                    <span className="sm:hidden">Tap to enter</span>
                    <span className="hidden sm:inline">Press any key to enter</span>
                  </motion.p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
