'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Game } from '@/types/game'

type Props = {
  game: Game
  onClose: () => void
}

const genreLabel: Record<Game['genre'], string> = {
  'soulslike':  'Soulslike',
  'action-rpg': 'Action RPG',
  'jrpg':       'JRPG',
  'action':     'Action',
  'roguelike':  'Roguelike',
  'other':      'Other',
}

/*
  Color-code the Metacritic score like a traffic light:
  90+  → amber  (masterpiece territory)
  80–89 → gold   (great)
  70–79 → bronze (decent)
  <70  → ember red (rough)
*/
function metacriticColor(score: number): string {
  if (score >= 90) return 'text-amber'
  if (score >= 80) return 'text-gold'
  if (score >= 70) return 'text-bronze'
  return 'text-ember'
}

/*
  Thin corner ornament — same design language as the intro screen.
  We draw only the top-left; CSS transforms handle the other three.
*/
function CornerOrnament({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="52" height="52"
      viewBox="0 0 52 52"
      fill="none"
      className="absolute pointer-events-none"
      style={style}
    >
      <path d="M 4 50 L 4 4 L 50 4" stroke="#C9A96E" strokeWidth="0.8" opacity="0.4" />
      <path d="M 10 50 L 10 10 L 50 10" stroke="#C9A96E" strokeWidth="0.4" opacity="0.2" />
      <rect x="1.3" y="1.3" width="5" height="5" transform="rotate(45 4 4)" fill="#7A6545" stroke="#C9A96E" strokeWidth="0.5" opacity="0.7" />
      <line x1="0" y1="50" x2="8" y2="50" stroke="#C9A96E" strokeWidth="0.8" opacity="0.3" />
      <line x1="50" y1="0" x2="50" y2="8" stroke="#C9A96E" strokeWidth="0.8" opacity="0.3" />
    </svg>
  )
}

/* A thin ornamental divider — the ✦ separator used throughout the site */
function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-gold/20" />
      <span className="text-gold/30 text-[10px]">✦</span>
      <div className="h-px flex-1 bg-gold/20" />
    </div>
  )
}

export default function GameModal({ game, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Freeze the Lenis RAF loop + hide custom scrollbar + block native scroll
  useEffect(() => {
    window.__lenisLocked = true
    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('scrolllock', { detail: true }))
    return () => {
      window.__lenisLocked = false
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('scrolllock', { detail: false }))
      // Snap Lenis's internal target to actual position — prevents post-close scroll jump
      window.__lenis?.scrollTo(window.scrollY, { immediate: true })
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const achievementPercent = game.achievements
    ? Math.round((game.achievements.earned / game.achievements.total) * 100)
    : null

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9995] flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Panel — outer frame for border/corners, inner div scrolls */}
        <motion.div
          className="relative z-10 w-full max-w-lg border border-gold/30 bg-ash"
          style={{ boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(201,169,110,0.06) inset' }}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.96, y: 16  }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
        >
          {/* Corner ornaments — anchored to outer frame, never scroll */}
          <CornerOrnament style={{ top: 0, left: 0 }} />
          <CornerOrnament style={{ top: 0, right: 0, transform: 'scaleX(-1)' }} />
          <CornerOrnament style={{ bottom: 0, left: 0, transform: 'scaleY(-1)' }} />
          <CornerOrnament style={{ bottom: 0, right: 0, transform: 'scale(-1,-1)' }} />

          {/* Scrollable inner container */}
          <div className="max-h-[85vh] overflow-y-auto overscroll-contain" data-lenis-prevent>

          {/* ── GAME IMAGE ─────────────────────────────────── */}
          {game.image && (
            <div className="relative h-48 w-full sm:h-56 overflow-hidden">
              <Image
                src={game.image}
                alt={game.title}
                fill
                sizes="(min-width: 640px) 512px, 100vw"
                className="object-cover object-center"
              />
              {/* Gradient: transparent top → solid ash bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-ash" />
            </div>
          )}

          {/* ── CONTENT ────────────────────────────────────── */}
          <div className="px-8 pb-8 pt-4">

            {/* ── HEADER ──────────────────────────────────── */}

            {/* Genre tag */}
            <p className="font-display text-xs tracking-[0.5em] text-bronze/80 uppercase mb-2">
              {genreLabel[game.genre]}
            </p>

            {/* Title */}
            <h2 className="font-display text-2xl tracking-[0.12em] text-gold uppercase leading-snug sm:text-3xl">
              {game.title}
            </h2>

            {/* Developer · Year */}
            <p className="mt-1 font-display text-sm tracking-[0.3em] text-bronze/80 uppercase">
              {game.developer} · {game.year}
            </p>

            {/* Series */}
            {game.series && (
              <p className="mt-1 font-display text-xs tracking-[0.25em] text-bronze/60 uppercase">
                {game.series}
              </p>
            )}

            <Divider />

            {/* ── DESCRIPTION ─────────────────────────────── */}
            <p className="font-body text-base leading-relaxed text-bronze italic">
              {game.description ?? game.lore}
            </p>

            <Divider />

            {/* ── STATS GRID ──────────────────────────────── */}
            <div className="flex flex-col gap-3">

              {/* Metacritic score */}
              {game.metacritic !== undefined && (
                <div className="flex flex-col gap-0.5">
                  <span className="font-display text-xs tracking-[0.3em] text-bronze/70 uppercase">Metacritic</span>
                  <span className={`font-display text-3xl font-bold tracking-tight ${metacriticColor(game.metacritic)}`}>
                    {game.metacritic}
                  </span>
                </div>
              )}

              {/* Platforms */}
              {game.platforms && game.platforms.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-display text-xs tracking-[0.3em] text-bronze/70 uppercase">Platforms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {game.platforms.map((p) => (
                      <span
                        key={p}
                        className="font-display text-xs tracking-widest text-bronze/90 border border-gold/30 px-2.5 py-0.5 uppercase"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Playtime */}
              {game.playtime && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-display text-xs tracking-[0.3em] text-bronze/70 uppercase">Playtime</span>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-xs tracking-widest text-bronze/60 uppercase">Main Story</span>
                      <span className="font-display text-base text-bronze">~{game.playtime.main}h</span>
                    </div>
                    <div className="h-full w-px bg-gold/15 self-stretch" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-xs tracking-widest text-bronze/60 uppercase">Completionist</span>
                      <span className="font-display text-base text-gold">~{game.playtime.complete}h</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hours Bound (personal) */}
              {game.hours !== undefined && (
                <div className="flex justify-between font-display text-sm tracking-widest text-bronze">
                  <span>Hours Bound</span>
                  <span className="text-gold">{game.hours}h+</span>
                </div>
              )}

              {/* Achievements */}
              {game.achievements && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-display text-sm tracking-widest text-bronze">
                    <span>Achievements</span>
                    <span className="text-amber">
                      {game.achievements.earned} / {game.achievements.total} · {achievementPercent}%
                    </span>
                  </div>
                  <div className="relative h-px w-full bg-gold/20 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 h-full bg-amber"
                      initial={{ width: '0%' }}
                      animate={{ width: `${achievementPercent}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* ── FEATURES ────────────────────────────────── */}
            {game.features && game.features.length > 0 && (
              <>
                <Divider />
                <div className="flex flex-col gap-2">
                  <span className="font-display text-xs tracking-[0.3em] text-bronze/70 uppercase mb-1">Inscriptions</span>
                  {game.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-gold/60 text-xs mt-0.5 shrink-0">✦</span>
                      <p className="font-body text-sm leading-relaxed text-bronze/90">{f}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="mt-8 w-full border border-gold/25 py-2.5 font-display text-sm tracking-[0.4em] text-bronze/70 uppercase transition-colors duration-300 hover:border-gold/50 hover:text-gold/90"
            >
              Close
            </button>

          </div>
          </div>{/* end scrollable inner container */}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
