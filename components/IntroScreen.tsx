'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.6 },
  },
}

const letterVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
}

const LETTERS = 'VESTIGES'.split('')

/*
  CornerOrnament — inline SVG medieval corner piece.

  Anatomy:
  - Outer L-shape:  the main structural lines
  - Inner L-shape:  a second parallel line 10px inward — double-line = manuscript style
  - Diamond:        small rotated square at the corner vertex — the medieval "rivet"
  - End ticks:      short perpendicular serifs at each line tip — stops the eye at the edge
  - Inner dot:      tiny diamond at the inner L corner for depth

  We draw only the top-left version. The other three corners are the same SVG
  with CSS transform: scaleX(-1) / scaleY(-1) / scale(-1,-1).
  This avoids duplicating 4 slightly different SVGs.
*/
function CornerOrnament({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      width="88" height="88"
      viewBox="0 0 88 88"
      fill="none"
      className="absolute"
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.1 }}
    >
      {/* Outer L — main frame lines */}
      <path d="M 6 84 L 6 6 L 84 6" stroke="#C9A96E" strokeWidth="1" opacity="0.35" />

      {/* Inner L — parallel line 14px inside, gives the double-line medieval look */}
      <path d="M 16 84 L 16 16 L 84 16" stroke="#C9A96E" strokeWidth="0.5" opacity="0.18" />

      {/* Diamond at outer corner vertex — the decorative rivet */}
      <rect
        x="2.3" y="2.3" width="7" height="7"
        transform="rotate(45 6 6)"
        fill="#7A6545" stroke="#C9A96E" strokeWidth="0.5" opacity="0.7"
      />

      {/* Small dot at inner corner intersection */}
      <rect
        x="13.8" y="13.8" width="4.5" height="4.5"
        transform="rotate(45 16 16)"
        fill="#C9A96E" opacity="0.2"
      />

      {/* End tick — bottom of vertical outer line */}
      <line x1="2" y1="84" x2="10" y2="84" stroke="#C9A96E" strokeWidth="1" opacity="0.3" />
      {/* End tick — right of horizontal outer line */}
      <line x1="84" y1="2" x2="84" y2="10" stroke="#C9A96E" strokeWidth="1" opacity="0.3" />

      {/* End tick — bottom of inner vertical line (offset inward) */}
      <line x1="12" y1="84" x2="20" y2="84" stroke="#C9A96E" strokeWidth="0.5" opacity="0.15" />
      {/* End tick — right of inner horizontal line */}
      <line x1="84" y1="12" x2="84" y2="20" stroke="#C9A96E" strokeWidth="0.5" opacity="0.15" />
    </motion.svg>
  )
}

// Reusable fade-in helper so we don't repeat the same motion.div pattern everywhere
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Thin ornamental divider — the ✦ separator used throughout the site
function Divider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="flex items-center gap-4 w-72"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      <div className="flex-1 h-px bg-gold/20" />
      <span className="text-gold/40 text-xs">✦</span>
      <div className="flex-1 h-px bg-gold/20" />
    </motion.div>
  )
}

export default function IntroScreen() {
  // step 0 = disclaimer, step 1 = intro, step 2 = dismissed
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [mounted, setMounted] = useState(false)
  const skippedRef = useRef(false)

  useEffect(() => {
    // Check sessionStorage BEFORE revealing anything, then remove the cover
    if (sessionStorage.getItem('intro-seen')) {
      skippedRef.current = true
      setStep(2)
    } else {
      document.body.style.overflow = 'hidden'
    }
    // Remove cover only after we know the step — React batches these into one render
    document.getElementById('intro-cover')?.remove()
    setMounted(true)
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (step === 0) {
      function advance() { setStep(1) }
      document.addEventListener('keydown', advance)
      document.addEventListener('click',   advance)
      return () => {
        document.removeEventListener('keydown', advance)
        document.removeEventListener('click',   advance)
      }
    }
    if (step === 1) {
      function dismiss() {
        document.body.style.overflow = ''
        sessionStorage.setItem('intro-seen', '1')
        setStep(2)
      }
      document.addEventListener('keydown', dismiss)
      document.addEventListener('click',   dismiss)
      return () => {
        document.removeEventListener('keydown', dismiss)
        document.removeEventListener('click',   dismiss)
      }
    }
  }, [step])

  // Don't render anything until we've checked sessionStorage — prevents the disclaimer flash
  if (!mounted || step === 2) return null

  const visible = step < 2

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-ash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: skippedRef.current ? 0 : 1.5, ease: 'easeInOut' }}
        >
          {/* ── DISCLAIMER STEP ─────────────────────────────── */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                key="disclaimer"
                className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative z-10 max-w-md w-full text-center">
                  {/* corner marks */}
                  <div className="absolute -top-5 -left-5  w-5 h-5 border-t border-l border-gold/40" />
                  <div className="absolute -top-5 -right-5 w-5 h-5 border-t border-r border-gold/40" />
                  <div className="absolute -bottom-5 -left-5  w-5 h-5 border-b border-l border-gold/40" />
                  <div className="absolute -bottom-5 -right-5 w-5 h-5 border-b border-r border-gold/40" />

                  <motion.p
                    className="mb-3 font-display text-[10px] tracking-[0.5em] text-bronze/60 uppercase"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Before You Enter
                  </motion.p>

                  <motion.h2
                    className="font-display text-lg sm:text-xl tracking-[0.2em] text-gold uppercase mb-5"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Asset Credits
                  </motion.h2>

                  <motion.div
                    className="h-px w-10 bg-gold/30 mx-auto mb-5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  />

                  <motion.p
                    className="font-body text-sm leading-relaxed text-bronze/80 mb-3"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Some visual and audio assets featured on this site — including game artwork,
                    screenshots, and music — belong to their respective creators and publishers.
                    They are used here solely for personal, non-commercial portfolio purposes.
                    No ownership or affiliation is claimed.
                  </motion.p>

                  <motion.p
                    className="font-body text-sm leading-relaxed text-bronze/60 mb-8"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    If you have a concern, contact me at{' '}
                    <span className="text-amber">dimosgkontevas1@gmail.com</span>
                    {' '}and it will be addressed promptly.
                  </motion.p>

                  <motion.p
                    className="font-display text-sm tracking-[0.4em] text-gold uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.85 }}
                    style={{ animation: 'blink 1.4s ease-in-out infinite', animationDelay: '0.85s' }}
                  >
                    <span className="sm:hidden">Tap to continue</span>
                    <span className="hidden sm:inline">Click anywhere to continue</span>
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── INTRO STEP ──────────────────────────────────── */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                key="intro"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* VIDEO BACKGROUND */}
                <video
                  src="/fire-bg.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Single overlay: full ash at edges, lighter in the centre */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, #0D0A07 0%, rgba(13,10,7,0.70) 22%, rgba(13,10,7,0.70) 78%, #0D0A07 100%)'
                }} />

                {/* ALL CONTENT */}
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
                    <motion.div
                      className="flex justify-center gap-[0.2em] sm:gap-[0.3em]"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {LETTERS.map((letter, i) => (
                        <motion.span
                          key={i}
                          variants={letterVariants}
                          className="block text-6xl text-gold sm:text-7xl md:text-8xl lg:text-9xl"
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </motion.div>

                    <motion.span
                      className="mt-4 block text-xl tracking-[0.8em] text-bronze"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.7 }}
                    >
                      of the Unlit
                    </motion.span>
                  </h1>

                  <Divider delay={1.8} />

                  <FadeUp delay={2.0} className="relative mt-6 text-center">
                    <p className="font-display text-xs tracking-[0.5em] text-bronze uppercase">
                      Age of Fire · Year 2026
                    </p>
                  </FadeUp>

                  <motion.p
                    className="relative mt-10 font-display text-sm tracking-[0.4em] text-gold uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 2.5 }}
                    style={{ animation: 'blink 1.4s ease-in-out infinite', animationDelay: '2.5s' }}
                  >
                    <span className="sm:hidden">Tap to continue</span>
                    <span className="hidden sm:inline">Press any key to continue</span>
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
