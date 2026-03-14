'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import type { Transition, TargetAndTransition, VariantLabels } from 'framer-motion'

const ease     = [0.16, 1, 0.3, 1] as [number, number, number, number]
const sections = ['origins', 'remembrances', 'arsenal', 'worthy', 'scholars']
const links    = [
  { label: 'Origins',      href: '#origins',      key: '1' },
  { label: 'Remembrances', href: '#remembrances', key: '2' },
  { label: 'Relics',       href: '#arsenal',      key: '3' },
  { label: 'The Worthy',   href: '#worthy',       key: '4' },
  { label: 'Scholars',     href: '#scholars',     key: '5' },
]

// ── MagneticLink — desktop only ──────────────────────────
interface MagneticLinkProps {
  href: string
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  color: string
  initial: boolean | TargetAndTransition | VariantLabels
  animate: boolean | TargetAndTransition | VariantLabels
  transition: Transition
  children: React.ReactNode
}

function MagneticLink({ href, onClick, color, initial, animate, transition, children }: MagneticLinkProps) {
  const ref    = useRef<HTMLAnchorElement>(null)
  const x      = useMotionValue(0)
  const y      = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 12 })
  const springY = useSpring(y, { stiffness: 150, damping: 12 })

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return
    const rect    = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width  / 2)) * 0.35)
    y.set((e.clientY - (rect.top  + rect.height / 2)) * 0.35)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      style={{ x: springX, y: springY, color }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className="font-display text-xs tracking-[0.2em] uppercase transition-colors duration-300"
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.a>
  )
}

// ── Nav ───────────────────────────────────────────────────
export default function Nav() {
  const [active, setActive]     = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [muted, setMuted]       = useState(false)

  // Sync initial mute state from localStorage + listen for changes from SoundManager
  useEffect(() => {
    setMuted(localStorage.getItem('muted') === 'true')
    function onMuteChange(e: Event) {
      setMuted((e as CustomEvent<boolean>).detail)
    }
    window.addEventListener('mutechange', onMuteChange)
    return () => window.removeEventListener('mutechange', onMuteChange)
  }, [])

  useEffect(() => {
    const observers = sections.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function onResize() { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    window.__playChime?.()
    window.__lenis?.scrollTo(href)
    setMenuOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-5 px-4 sm:px-6">
        <div className="flex items-center gap-2 w-full md:w-auto">
        <motion.nav
          className="flex w-full items-center justify-between rounded-full border border-gold/25 bg-cinder/90 px-5 py-3 sm:px-8 md:w-auto md:justify-start backdrop-blur-md"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(201,169,110,0.06)' }}
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          {/* Logo */}
          <motion.button
            onClick={() => window.__lenis?.scrollTo(0)}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
          >
            <span className="font-display text-xs tracking-[0.4em] text-gold uppercase leading-none sm:text-sm">
              Vestiges
            </span>
            <span className="font-display text-[7px] tracking-[0.5em] text-gold/70 uppercase leading-none sm:text-[8px] sm:tracking-[0.6em]">
              of the Unlit
            </span>
          </motion.button>

          {/* Desktop spacer + links */}
          <div className="mx-12 hidden md:block lg:mx-20" />
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((link, i) => (
              <MagneticLink
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                color={active === link.href.slice(1) ? '#E8C97A' : '#C9A96E'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease, delay: 0.6 + i * 0.08 }}
              >
                {link.label}
                <sup className="ml-0.5 text-[7px] opacity-30">{link.key}</sup>
              </MagneticLink>
            ))}

            {/* Divider */}
            <motion.div
              className="h-3 w-px bg-gold/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 1.1 }}
            />

            {/* Dev portfolio link */}
            <motion.a
              href="https://dimosgkontevas.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: '#7A6545' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A96E')}
              onMouseLeave={e => (e.currentTarget.style.color = '#7A6545')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 1.15 }}
            >
              Dev Portfolio
            </motion.a>

          </div>

          {/* Hamburger — mobile only */}
          <motion.button
            className="ml-5 flex md:hidden flex-col items-center justify-center gap-[5px] w-6"
            onClick={() => setMenuOpen(o => !o)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
            aria-label="Toggle menu"
          >
            {/*
              Three lines that animate into an X when open.
              Each line is a motion.div that rotates/translates on state change.
            */}
            <motion.span
              className="block h-px w-full bg-gold/70"
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block h-px w-full bg-gold/70"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-px w-full bg-gold/70"
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.nav>


        </div>
      </header>

      {/* Mute button — fixed bottom-left, all screens */}
      <motion.button
        onClick={() => window.__toggleMute?.()}
        title={muted ? 'Unmute' : 'Mute'}
        className="fixed bottom-3 left-3 z-[200] flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-cinder/80 backdrop-blur-sm transition-colors duration-300 hover:border-gold/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.3 }}
      >
        <span className="font-display text-xs" style={{ color: muted ? '#7A6545' : '#C9A96E' }}>
          {muted ? '✕' : '♪'}
        </span>
      </motion.button>

      {/* ── MOBILE MENU OVERLAY ───────────────────────────────
          Full-screen dark overlay with large centered nav links.
          AnimatePresence handles the mount/unmount fade.
          z-[49] so it sits below the nav bar (z-50) but above everything else.
      */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[49] flex flex-col items-center justify-center bg-ash/95 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative divider at top */}
            <div className="absolute top-28 flex items-center gap-4 w-48">
              <div className="flex-1 h-px bg-gold/20" />
              <span className="text-gold/30 text-xs">✦</span>
              <div className="flex-1 h-px bg-gold/20" />
            </div>

            <nav className="flex flex-col items-center gap-10">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="font-display text-2xl tracking-[0.3em] uppercase"
                  style={{ color: active === link.href.slice(1) ? '#E8C97A' : '#C9A96E' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Decorative divider at bottom */}
            <div className="absolute bottom-28 flex flex-col items-center gap-5">
              <div className="flex items-center gap-4 w-48">
                <div className="flex-1 h-px bg-gold/20" />
                <span className="text-gold/30 text-xs">✦</span>
                <div className="flex-1 h-px bg-gold/20" />
              </div>

              <a
                href="https://dimosgkontevas.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-xs tracking-[0.3em] uppercase text-bronze/60"
              >
                Dev Portfolio
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
