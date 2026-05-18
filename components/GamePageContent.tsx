'use client'

import { useRef, useEffect } from 'react'
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
      <span className="font-display text-[9px] tracking-[0.5em] text-bronze/45 uppercase">{label}</span>
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

function Divider() {
  return (
    <div className="my-14 flex items-center gap-4">
      <div className="flex-1 h-px bg-gold/12" />
      <span className="text-gold/20 text-[10px]">✦</span>
      <div className="flex-1 h-px bg-gold/12" />
    </div>
  )
}

// ── MAIN ───────────────────────────────────────────────────────────────────────

export default function GamePageContent({ game }: { game: Game }) {
  const heroRef = useRef<HTMLElement>(null)

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
          <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: imageY, willChange: 'transform' }}>
            <Image
              src={game.image}
              alt={game.title}
              fill
              priority
              quality={85}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
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
          className="absolute top-7 left-7 z-10 flex items-center gap-3 font-display text-xs tracking-[0.4em] text-bronze/75 uppercase hover:text-gold transition-colors duration-300 group border border-gold/20 hover:border-gold/45 bg-ash/60 backdrop-blur-sm px-4 py-2.5">
          <span className="group-hover:-translate-x-1 transition-transform duration-300 text-sm">←</span>
          <span>Archive</span>
        </Link>

        {/* Ghost index */}
        <span className="pointer-events-none select-none absolute right-6 top-1/2 -translate-y-1/2 font-display leading-none text-gold/[0.04]"
          style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}>
          {String(idx + 1).padStart(2, '0')}
        </span>

        {/* Hero text */}
        <motion.div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl"
          style={{ y: contentY, opacity: heroOpacity }}>

          <motion.p
            className="mb-3 font-display text-[10px] tracking-[0.55em] text-bronze/55 uppercase"
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
            className="font-display text-sm tracking-[0.3em] text-bronze/70 uppercase mb-6"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
            {game.developer}
            {game.series && (
              <span className="ml-4 text-bronze/40">· {game.series}</span>
            )}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-8 border-t border-gold/20 pt-5"
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
        <div className="mx-auto max-w-3xl px-8 py-24">

          {/* Lore */}
          <FadeUp>
            <blockquote className="border-l-2 border-gold/30 pl-6">
              <p className="font-body text-xl leading-relaxed italic text-bronze/90 sm:text-2xl">
                {game.lore}
              </p>
            </blockquote>
          </FadeUp>

          {/* Credits — director + composer */}
          {(game.director || game.composer) && (
            <FadeUp delay={0.08} className="mt-10">
              <div className="flex flex-wrap gap-8 border-t border-b border-gold/10 py-5">
                {game.director && (
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-[9px] tracking-[0.5em] text-bronze/40 uppercase">Directed by</span>
                    <span className="font-display text-sm tracking-wide text-bronze/80">{game.director}</span>
                  </div>
                )}
                {game.composer && (
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-[9px] tracking-[0.5em] text-bronze/40 uppercase">Music by</span>
                    <span className="font-display text-sm tracking-wide text-bronze/80">{game.composer}</span>
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
                <p className="font-body text-base leading-loose text-bronze/72 sm:text-lg">
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
                <p className="mb-5 font-display text-[9px] tracking-[0.55em] text-bronze/45 uppercase">Legacy</p>
                <p className="font-body text-base leading-loose text-bronze/78 sm:text-lg">
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
                <p className="mb-6 font-display text-[9px] tracking-[0.55em] text-bronze/45 uppercase">Accolades</p>
                <div className="flex flex-col gap-3">
                  {game.awards.map((award, i) => (
                    <FadeUp key={i} delay={i * 0.06}>
                      <div className="flex items-center gap-3">
                        <span className="shrink-0 text-amber/60 text-[10px]">◈</span>
                        <span className="font-display text-sm tracking-wide text-bronze/75">{award}</span>
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
                <p className="mb-7 font-display text-[9px] tracking-[0.55em] text-bronze/45 uppercase">
                  Inscriptions
                </p>
                <div className="flex flex-col gap-5">
                  {game.features.map((f, i) => (
                    <FadeUp key={i} delay={i * 0.07}>
                      <div className="flex items-start gap-4">
                        <span className="mt-1 shrink-0 text-gold/45 text-xs">✦</span>
                        <p className="font-body text-base leading-relaxed text-bronze/78">{f}</p>
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
                <p className="mb-7 font-display text-[9px] tracking-[0.55em] text-bronze/45 uppercase">
                  Time Investment
                </p>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-display text-[9px] tracking-[0.45em] text-bronze/40 uppercase">Main Story</span>
                    <span className="font-display text-4xl text-gold leading-none">~{game.playtime.main}h</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-display text-[9px] tracking-[0.45em] text-bronze/40 uppercase">Completionist</span>
                    <span className="font-display text-4xl text-gold leading-none">~{game.playtime.complete}h</span>
                  </div>
                  {game.hours !== undefined && (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-display text-[9px] tracking-[0.45em] text-amber/60 uppercase">My Playtime</span>
                      <span className="font-display text-4xl text-amber leading-none">{game.hours}h+</span>
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
                <div className="flex flex-col gap-8">

                  {game.achievements && (
                    <div>
                      <div className="mb-3 flex justify-between font-display text-xs tracking-widest">
                        <span className="text-bronze/55 uppercase">Achievements</span>
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
                      <span className="font-display text-[9px] tracking-[0.5em] text-bronze/45 uppercase">
                        Available On
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {game.platforms.map(p => (
                          <span key={p}
                            className="font-display text-xs tracking-widest text-bronze/80 border border-gold/20 px-3 py-1 uppercase">
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
                  className="group flex flex-col gap-1.5 max-w-[45%]">
                  <span className="font-display text-[9px] tracking-[0.45em] text-bronze/35 uppercase">← Previous</span>
                  <span className="font-display text-sm tracking-wide text-gold/70 group-hover:text-gold transition-colors duration-300 leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : <div />}

              {next ? (
                <Link href={`/games/${next.id}`}
                  className="group flex flex-col items-end gap-1.5 max-w-[45%] text-right">
                  <span className="font-display text-[9px] tracking-[0.45em] text-bronze/35 uppercase">Next →</span>
                  <span className="font-display text-sm tracking-wide text-gold/70 group-hover:text-gold transition-colors duration-300 leading-snug">
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
