'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { games, perfectGames } from '@/data/games'
import AnimatedCounter from './AnimatedCounter'
import FadeIn from './FadeIn'
import RevealText from './RevealText'

// ── COMPUTED STATS ─────────────────────────────────────────────────────────────
const totalHours        = Math.floor(games.reduce((sum, g) => sum + (g.hours ?? 0), 0))
const totalAchievements = games.reduce((sum, g) => sum + (g.achievements?.earned ?? 0), 0)
const totalWorlds       = games.length

// Genre distribution
const genreData = [
  { label: 'Soulslike',   key: 'soulslike',   grad: ['#C97828', '#7A4A18'] },
  { label: 'Action',      key: 'action',      grad: ['#C9A96E', '#8B7355'] },
  { label: 'Action RPG',  key: 'action-rpg',  grad: ['#8B7355', '#5A4A35'] },
  { label: 'Roguelike',   key: 'roguelike',   grad: ['#E8A040', '#A06020'] },
  { label: 'JRPG',        key: 'jrpg',        grad: ['#C9A96E', '#C9A96E80'] },
].map(g => ({ ...g, count: games.filter(x => x.genre === g.key).length }))
  .filter(g => g.count > 0)

const maxCount = Math.max(...genreData.map(g => g.count))

// Records
const hardestGames = games
  .filter(g => g.difficulty === 5 && g.perfect)
  .map(g => g.title.split(':')[0].split(' –')[0])
  .join(' · ')

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────────

function StatCard({ value, suffix = '', label, delay }: {
  value: number; suffix?: string; label: string; delay: number
}) {
  return (
    <div className="relative flex flex-col items-center text-center px-4 py-8">
      {/* Corner ticks */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/30" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/30" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/30" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/30" />

      <p className="font-display text-5xl sm:text-6xl md:text-7xl text-gold leading-none tabular-nums">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
      <p className="mt-4 font-display text-[9px] tracking-[0.45em] text-bronze/60 uppercase">
        {label}
      </p>
    </div>
  )
}

function GenreBar({ label, count, grad, delay }: {
  label: string; count: number; grad: string[]; delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const pct = (count / maxCount) * 100

  return (
    <div ref={ref} className="group">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-display text-[9px] tracking-[0.45em] text-bronze/70 uppercase group-hover:text-bronze transition-colors duration-300">
          {label}
        </span>
        <span className="font-display text-xs text-gold/80">{count}</span>
      </div>
      <div className="relative h-[2px] w-full overflow-hidden" style={{ background: 'rgba(201,169,110,0.08)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 h-full"
          style={{ background: `linear-gradient(to right, ${grad[0]}, ${grad[1]})` }}
          initial={{ width: '0%' }}
          animate={inView ? { width: `${pct}%` } : { width: '0%' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </div>
  )
}

function RecordPill({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-6 relative">
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/20" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold/20" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold/20" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold/20" />
      <p className="mb-2 font-display text-[9px] tracking-[0.45em] text-bronze/50 uppercase">{label}</p>
      <p className="font-display text-base tracking-[0.1em] text-gold uppercase leading-snug">{value}</p>
      <p className="mt-1 font-display text-[10px] tracking-[0.3em] text-amber/80 uppercase">{sub}</p>
    </div>
  )
}

// ── MAIN ───────────────────────────────────────────────────────────────────────

export default function LedgerSection() {
  return (
    <section
      id="ledger"
      className="relative scroll-mt-20 px-8 py-36 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1C1409 0%, #0D0A07 55%)' }}
    >
      {/* Ambient bottom glow */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[60%] h-32 blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(201,120,40,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-5xl">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <FadeIn className="mb-20 flex flex-col items-center text-center">
          <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze/70 uppercase">
            Archive Entry
          </p>
          <RevealText delay={0.1} className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
            Ledger of the Unlit
          </RevealText>
          <div className="my-6 h-px w-16 bg-gold/40" />
          <p className="max-w-md font-body text-sm leading-relaxed text-bronze/70">
            Every world endured, every hour surrendered, every achievement clawed from the dark.
            The record does not lie.
          </p>
        </FadeIn>

        {/* ── STAT COUNTERS ────────────────────────────────────────────────── */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mb-20">
            <StatCard value={totalHours}        suffix="+"  label="Hours Surrendered" delay={0.0} />
            <StatCard value={perfectGames.length}           label="Worlds Perfected"  delay={0.1} />
            <StatCard value={totalAchievements} suffix="+"  label="Trials Completed"  delay={0.2} />
            <StatCard value={totalWorlds}                   label="Worlds Catalogued" delay={0.3} />
          </div>
        </FadeIn>

        {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
        <FadeIn delay={0.15}>
          <div className="flex items-center gap-4 mb-16">
            <div className="flex-1 h-px bg-gold/15" />
            <span className="font-display text-[10px] text-gold/30 tracking-[0.4em] uppercase">Codex</span>
            <div className="flex-1 h-px bg-gold/15" />
          </div>
        </FadeIn>

        {/* ── GENRE BARS + RECORDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

          {/* Genre breakdown */}
          <FadeIn delay={0.2}>
            <div>
              <p className="mb-6 font-display text-[9px] tracking-[0.55em] text-bronze/50 uppercase">
                Genre Distribution
              </p>
              <div className="flex flex-col gap-5">
                {genreData.map((g, i) => (
                  <GenreBar
                    key={g.key}
                    label={g.label}
                    count={g.count}
                    grad={g.grad}
                    delay={i * 0.1}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Records */}
          <FadeIn delay={0.3}>
            <div>
              <p className="mb-6 font-display text-[9px] tracking-[0.55em] text-bronze/50 uppercase">
                Records of Note
              </p>
              <div className="flex flex-col gap-3">
                <RecordPill
                  label="Most Time Consumed"
                  value="Elden Ring"
                  sub="300+ hours"
                />
                <RecordPill
                  label="Highest Acclaimed"
                  value="Elden Ring"
                  sub="Metacritic · 96"
                />
                <RecordPill
                  label="Hardest Conquered"
                  value={hardestGames || 'Sekiro · DS III'}
                  sub="Difficulty V"
                />
              </div>
            </div>
          </FadeIn>

        </div>

      </div>
    </section>
  )
}
