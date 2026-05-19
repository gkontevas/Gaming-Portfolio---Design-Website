'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease     = [0.16, 1, 0.3, 1] as [number, number, number, number]
const sections = ['origins', 'remembrances', 'arsenal', 'worthy', 'bonfire']
const links    = [
  { label: 'Origins',      href: '#origins',      key: '1' },
  { label: 'Remembrances', href: '#remembrances', key: '2' },
  { label: 'Relics',       href: '#arsenal',      key: '3' },
  { label: 'The Worthy',   href: '#worthy',       key: '4' },
  { label: 'Bonfire',      href: '#bonfire',      key: '5' },
]

function NavLink({
  href, onClick, active, children,
}: {
  href: string
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative py-2 font-display text-xs tracking-[0.35em] uppercase transition-colors duration-300 hover:text-amber ${
        active ? 'text-amber' : 'text-gold'
      }`}
    >
      {children}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="pointer-events-none absolute -bottom-1 left-0 right-0 h-px bg-amber/50"
          transition={{ duration: 0.3, ease }}
        />
      )}
    </a>
  )
}

export default function Nav() {
  const [active,      setActive]      = useState('')
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [muted,       setMuted]       = useState(false)
  const [scrolling,   setScrolling]   = useState(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMuted(localStorage.getItem('muted') === 'true')
    function onMuteChange(e: Event) { setMuted((e as CustomEvent<boolean>).detail) }
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

  useEffect(() => {
    function onResize() { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    window.__playChime?.()
    const target = document.querySelector(href)
    const dist   = target ? Math.abs(target.getBoundingClientRect().top) : 1200
    const dur    = Math.min(Math.max(dist / 1200, 0.8), 2.0)
    window.__lenis?.scrollTo(href, {
      duration: dur,
      easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    })
    setScrolling(true)
    window.__navScrolling = true
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      setScrolling(false)
      window.__navScrolling = false
    }, dur * 1000 + 600)
    setMenuOpen(false)
  }

  return (
    <>

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 pt-5 pb-5 backdrop-blur-md"
        style={{ background: 'linear-gradient(to bottom, rgba(13,10,7,0.55) 0%, rgba(13,10,7,0.15) 100%)' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
      >
        {/* Logo */}
        <button
          onClick={() => window.__lenis?.scrollTo(0)}
          className="flex flex-col gap-0.5 text-left"
        >
          <span className="font-display text-sm tracking-[0.45em] text-gold uppercase leading-none">
            Vestiges
          </span>
          <span className="font-display text-[9px] tracking-[0.4em] text-gold/60 uppercase leading-none">
            of the Unlit
          </span>
        </button>

        {/* Desktop links — centered */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              active={active === link.href.slice(1)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right — dev link + hamburger */}
        <div className="flex items-center gap-5">
          <a
            href="https://dimosgkontevas.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block font-display text-xs tracking-[0.35em] uppercase text-bronze/60 transition-colors duration-300 hover:text-gold"
          >
            Dev Portfolio
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden flex-col items-center justify-center gap-[5px] w-6"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <motion.span className="block h-px w-full bg-gold/60" animate={menuOpen ? { rotate: 45, y: 6 }  : { rotate: 0, y: 0 }}  transition={{ duration: 0.3 }} />
            <motion.span className="block h-px w-full bg-gold/60" animate={menuOpen ? { opacity: 0 }        : { opacity: 1 }}         transition={{ duration: 0.2 }} />
            <motion.span className="block h-px w-full bg-gold/60" animate={menuOpen ? { rotate: -45, y: -6 }: { rotate: 0, y: 0 }}  transition={{ duration: 0.3 }} />
          </button>
        </div>
      </motion.header>

      {/* Mute button — bottom left, always visible */}
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

      {/* Scroll motion blur — vignette + blur that pulses during nav scrolls */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[44]"
        animate={{ opacity: scrolling ? 1 : 0 }}
        transition={{ duration: scrolling ? 0.12 : 0.25, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(13,10,7,0.45) 100%)',
          backdropFilter: 'blur(1.5px)',
        }}
      />

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[49] flex flex-col items-center justify-center bg-ash/95 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
