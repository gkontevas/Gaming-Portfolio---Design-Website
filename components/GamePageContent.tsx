'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { games } from '@/data/games'
import type { Game } from '@/types/game'

const GENRE_LABELS: Record<Game['genre'], string> = {
  'soulslike':  'Soulslike',
  'action-rpg': 'Action RPG',
  'jrpg':       'JRPG',
  'action':     'Action',
  'roguelike':  'Roguelike',
  'other':      'Other',
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────────

function DifficultyPips({ value }: { value: number }) {
  return (
    <div className="flex gap-1 items-center mt-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`h-[3px] w-5 ${i <= value ? 'bg-amber' : 'bg-gold/15'}`} />
      ))}
    </div>
  )
}

function HeroStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-[10px] tracking-[0.45em] text-bronze/55 uppercase">{label}</span>
      <div className="font-display text-sm tracking-wide text-gold">{children}</div>
    </div>
  )
}

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}>
      {children}
    </motion.div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className="shrink-0 text-gold/35 text-[9px]">◈</span>
      <span className="font-display text-[10px] tracking-[0.5em] text-bronze/60 uppercase">{children}</span>
      <div className="flex-1 h-px bg-gold/10" />
    </div>
  )
}

function Divider() {
  return (
    <div className="my-14 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/15" />
      <div className="flex items-center gap-1.5">
        <span className="text-gold/15 text-[6px]">◆</span>
        <span className="text-gold/30 text-xs">✦</span>
        <span className="text-gold/15 text-[6px]">◆</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/15" />
    </div>
  )
}

// ── MAIN ───────────────────────────────────────────────────────────────────────

export default function GamePageContent({ game }: { game: Game }) {
  const heroRef = useRef<HTMLElement>(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    window.__lenis?.scrollTo(0, { immediate: true })
  }, [])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const imageY      = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentY    = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const idx  = games.findIndex(g => g.id === game.id)
  const prev = games[idx - 1] ?? null
  const next = games[idx + 1] ?? null

  const achievementPct = game.achievements
    ? Math.round((game.achievements.earned / game.achievements.total) * 100)
    : null

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">

        {/* Background */}
        {game.image ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse"
                style={{ background: 'linear-gradient(135deg, #1C1409 0%, #0D0A07 50%, #1C1409 100%)' }} />
            )}
            <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: imageY, willChange: 'transform' }}>
              <Image
                src={game.image}
                alt={game.title}
                fill
                priority
                quality={85}
                sizes="100vw"
                className="object-cover object-center"
                onLoad={() => setImgLoaded(true)}
              />
            </motion.div>
          </>
        ) : (
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, #1C1409 0%, #0D0A07 80%)' }} />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ash via-ash/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ash/85 via-ash/25 to-transparent" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(13,10,7,0.6) 100%)' }} />

        {/* Back */}
        <Link href="/"
          className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10 flex items-center gap-3 font-display text-xs tracking-[0.4em] text-bronze/75 uppercase hover:text-gold transition-colors duration-300 group border border-gold/20 hover:border-gold/45 bg-ash/60 backdrop-blur-sm px-4 py-3 min-h-[44px]">
          <span className="group-hover:-translate-x-1 transition-transform duration-300 text-sm">←</span>
          <span>Archive</span>
        </Link>

        {/* Top-right corner bracket */}
        <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-10 pointer-events-none">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-t border-r border-gold/20" />
        </div>

        {/* Ghost index */}
        <span className="pointer-events-none select-none absolute right-6 top-1/2 -translate-y-1/2 font-display leading-none text-gold/[0.04]"
          style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}>
          {String(idx + 1).padStart(2, '0')}
        </span>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 right-7 sm:right-12 z-10 hidden sm:flex flex-col items-center gap-3"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
          >
            <span className="font-display text-[8px] tracking-[0.5em] text-bronze/35 uppercase">Scroll</span>
            <motion.div
              className="w-px h-9"
              style={{ background: 'linear-gradient(to bottom, rgba(201,169,110,0.4), transparent)' }}
              animate={{ opacity: [0.4, 1, 0.4], y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Hero text */}
        <motion.div className="absolute bottom-0 left-0 p-5 sm:p-8 md:p-16 max-w-4xl"
          style={{ y: contentY, opacity: heroOpacity }}>

          <motion.p
            className="mb-3 font-display text-[10px] tracking-[0.55em] text-bronze/60 uppercase"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
            {GENRE_LABELS[game.genre]} · {game.year}
          </motion.p>

          <motion.h1
            className="font-display uppercase leading-[0.88] text-gold mb-4"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)', textShadow: '0 4px 60px rgba(0,0,0,0.85)' }}
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
            {game.title}
          </motion.h1>

          <motion.p
            className="font-display text-sm tracking-[0.3em] text-bronze/75 uppercase mb-6"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
            {game.developer}
            {game.series && (
              <span className="ml-4 text-bronze/50">· {game.series}</span>
            )}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-5 sm:gap-8 border-t border-gold/20 pt-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}>
            {game.hours      !== undefined && <HeroStat label="Hours Bound">{game.hours}+</HeroStat>}
            {game.metacritic !== undefined && <HeroStat label="Metacritic">{game.metacritic}</HeroStat>}
            {game.difficulty !== undefined && (
              <HeroStat label="Difficulty"><DifficultyPips value={game.difficulty} /></HeroStat>
            )}
            {game.perfect && (
              <HeroStat label="Status"><span className="text-amber">Perfected ✦</span></HeroStat>
            )}
          </motion.div>

        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CONTENT
      ═══════════════════════════════════════════════════ */}
      <div className="bg-ash">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">

          {/* Ornamental content header */}
          <FadeUp className="mb-14">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/20" />
                <div className="flex items-center gap-2.5">
                  <span className="text-gold/20 text-[8px]">◆</span>
                  <span className="font-display text-[9px] tracking-[0.9em] text-gold/40 uppercase">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-gold/20 text-[8px]">◆</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/20" />
              </div>
              <span className="font-display text-[9px] tracking-[0.6em] text-bronze/35 uppercase">
                {GENRE_LABELS[game.genre]} · {game.year}
              </span>
            </div>
          </FadeUp>

          {/* Lore */}
          <FadeUp>
            <div className="relative">
              <span
                className="absolute -top-5 -left-2 font-body text-[5.5rem] sm:text-[7rem] leading-none text-gold/[0.07] select-none pointer-events-none"
                aria-hidden
              >❝</span>
              <blockquote className="border-l-2 border-gold/35 pl-6 sm:pl-8">
                <p className="font-body text-2xl sm:text-3xl leading-relaxed italic text-bronze/95">
                  {game.lore}
                </p>
              </blockquote>
            </div>
          </FadeUp>

          {/* Credits — director + composer */}
          {(game.director || game.composer) && (
            <FadeUp delay={0.08} className="mt-12">
              <div className="flex flex-wrap gap-10 border-t border-b border-gold/12 py-6">
                {game.director && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-display text-[10px] tracking-[0.5em] text-bronze/50 uppercase">Directed by</span>
                    <span className="font-display text-base tracking-wide text-bronze/90">{game.director}</span>
                  </div>
                )}
                {game.composer && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-display text-[10px] tracking-[0.5em] text-bronze/50 uppercase">Music by</span>
                    <span className="font-display text-base tracking-wide text-bronze/90">{game.composer}</span>
                  </div>
                )}
              </div>
            </FadeUp>
          )}

          {/* Description */}
          {game.description && (
            <>
              <Divider />
              <FadeUp delay={0.05}>
                <p className="font-body text-lg sm:text-xl leading-loose text-bronze/85">
                  {game.description}
                </p>
              </FadeUp>
            </>
          )}

          {/* Legacy */}
          {game.legacy && (
            <>
              <Divider />
              <FadeUp>
                <SectionLabel>Legacy</SectionLabel>
                <p className="font-body text-lg sm:text-xl leading-loose text-bronze/88">
                  {game.legacy}
                </p>
              </FadeUp>
            </>
          )}

          {/* Awards */}
          {game.awards && game.awards.length > 0 && (
            <>
              <Divider />
              <FadeUp>
                <SectionLabel>Accolades</SectionLabel>
                <div className="flex flex-col gap-3.5">
                  {game.awards.map((award, i) => (
                    <FadeUp key={i} delay={i * 0.06}>
                      <div className="flex items-center gap-4">
                        <span className="shrink-0 text-amber/65 text-xs">◈</span>
                        <span className="font-display text-sm sm:text-base tracking-wide text-bronze/85">{award}</span>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </FadeUp>
            </>
          )}

          {/* Features */}
          {game.features && game.features.length > 0 && (
            <>
              <Divider />
              <FadeUp>
                <SectionLabel>Inscriptions</SectionLabel>
                <div className="flex flex-col gap-5">
                  {game.features.map((f, i) => (
                    <FadeUp key={i} delay={i * 0.07}>
                      <div className="flex items-start gap-4">
                        <span className="mt-1.5 shrink-0 text-gold/50 text-xs">✦</span>
                        <p className="font-body text-base sm:text-lg leading-relaxed text-bronze/85">{f}</p>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </FadeUp>
            </>
          )}

          {/* Playtime */}
          {game.playtime && (
            <>
              <Divider />
              <FadeUp>
                <SectionLabel>Time Investment</SectionLabel>
                <div className={`grid gap-5 sm:gap-8 ${game.hours !== undefined ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-display text-[9px] tracking-[0.3em] sm:tracking-[0.45em] text-bronze/50 uppercase">Main Story</span>
                    <span className="font-display text-2xl sm:text-4xl text-gold leading-none">~{game.playtime.main}h</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-display text-[9px] tracking-[0.3em] sm:tracking-[0.45em] text-bronze/50 uppercase">Completionist</span>
                    <span className="font-display text-2xl sm:text-4xl text-gold leading-none">~{game.playtime.complete}h</span>
                  </div>
                  {game.hours !== undefined && (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-display text-[9px] tracking-[0.3em] sm:tracking-[0.45em] text-amber/70 uppercase">My Playtime</span>
                      <span className="font-display text-2xl sm:text-4xl text-amber leading-none">{game.hours}h+</span>
                    </div>
                  )}
                </div>
              </FadeUp>
            </>
          )}

          {/* Achievements + Platforms */}
          {(game.achievements || game.platforms) && (
            <>
              <Divider />
              <FadeUp>
                <div className="flex flex-col gap-10">

                  {game.achievements && (
                    <div>
                      <div className="mb-4 flex justify-between font-display text-xs sm:text-sm tracking-widest">
                        <span className="text-bronze/65 uppercase">Achievements</span>
                        <span className={game.perfect ? 'text-amber' : 'text-gold'}>
                          {game.achievements.earned} / {game.achievements.total} · {achievementPct}%
                        </span>
                      </div>
                      <div className="relative h-[3px] w-full overflow-hidden"
                        style={{ background: 'rgba(201,169,110,0.09)' }}>
                        <motion.div
                          className={`absolute inset-y-0 left-0 h-full ${game.perfect ? 'bg-amber' : 'bg-gold'}`}
                          initial={{ width: '0%' }}
                          whileInView={{ width: `${achievementPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {game.platforms && (
                    <div className="flex flex-col gap-3">
                      <span className="font-display text-[10px] tracking-[0.5em] text-bronze/55 uppercase">
                        Available On
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {game.platforms.map(p => (
                          <span key={p}
                            className="font-display text-xs sm:text-sm tracking-widest text-bronze/88 border border-gold/20 px-3 py-1.5 uppercase">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </FadeUp>
            </>
          )}

          {/* Prev / Next */}
          <Divider />
          <FadeUp>
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link href={`/games/${prev.id}`}
                  className="group flex flex-col gap-2 max-w-[45%] py-2">
                  <span className="font-display text-[10px] tracking-[0.45em] text-bronze/45 uppercase">← Previous</span>
                  <span className="font-display text-sm sm:text-base tracking-wide text-gold/75 group-hover:text-gold transition-colors duration-300 leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : <div />}

              {next ? (
                <Link href={`/games/${next.id}`}
                  className="group flex flex-col items-end gap-2 max-w-[45%] text-right py-2">
                  <span className="font-display text-[10px] tracking-[0.45em] text-bronze/45 uppercase">Next →</span>
                  <span className="font-display text-sm sm:text-base tracking-wide text-gold/75 group-hover:text-gold transition-colors duration-300 leading-snug">
                    {next.title}
                  </span>
                </Link>
              ) : <div />}
            </div>
          </FadeUp>

        </div>
      </div>
    </>
  )
}
