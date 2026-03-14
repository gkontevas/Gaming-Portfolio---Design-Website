'use client'

import { useEffect, useState } from 'react'
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
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Remove the server-side cover — IntroScreen has taken over
    document.getElementById('intro-cover')?.remove()

    // Hide scrollbar while intro is covering the page
    document.body.style.overflow = 'hidden'

    function dismiss() {
      document.body.style.overflow = ''
      setVisible(false)
    }

    document.addEventListener('keydown', dismiss)
    document.addEventListener('click',   dismiss)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', dismiss)
      document.removeEventListener('click',   dismiss)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-ash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >

          {/* ── VIDEO BACKGROUND ──────────────────────────────
              autoPlay + muted required by browsers for autoplay to work.
              playsInline prevents iOS from opening the system player.
              object-cover fills the screen at any aspect ratio.
          */}
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

          {/* ── ALL CONTENT — relative so it paints above the absolute overlays ── */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">

            {/* ── CORNER ORNAMENTS ────────────────────────────── */}
            <CornerOrnament style={{ top: 24, left: 24 }} />
            <CornerOrnament style={{ top: 24, right: 24, transform: 'scaleX(-1)' }} />
            <CornerOrnament style={{ bottom: 24, left: 24, transform: 'scaleY(-1)' }} />
            <CornerOrnament style={{ bottom: 24, right: 24, transform: 'scale(-1,-1)' }} />

            {/* ── TOP LABEL ───────────────────────────────────── */}
            <FadeUp delay={0.2} className="relative mb-10 text-center">
              <p className="font-display text-xs tracking-[0.2em] sm:tracking-[0.6em] text-bronze uppercase px-4">
                A Record of Worlds Consumed
              </p>
            </FadeUp>

            {/* ── DIVIDER above title ───────────────────────── */}
            <Divider delay={0.4} />

            {/* ── TITLE ────────────────────────────────────────
                Much larger — text-7xl on desktop.
                Letters stagger in one by one, 60ms apart.
            */}
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

            {/* ── DIVIDER below title ───────────────────────── */}
            <Divider delay={1.8} />

            {/* ── YEAR / LORE LINE ─────────────────────────────
                Sets the fictional date — matches the footer.
            */}
            <FadeUp delay={2.0} className="relative mt-6 text-center">
              <p className="font-display text-xs tracking-[0.5em] text-bronze uppercase">
                Age of Fire · Year 2026
              </p>
            </FadeUp>

            {/* ── PRESS ANY KEY ────────────────────────────────  */}
            <motion.p
              className="relative mt-10 font-display text-sm tracking-[0.4em] text-gold uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.5 }}
              style={{ animation: 'blink 1.4s ease-in-out infinite', animationDelay: '2.5s' }}
            >
              {/* Show different text depending on device input method */}
              <span className="sm:hidden">Tap to continue</span>
              <span className="hidden sm:inline">Press any key to continue</span>
            </motion.p>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
