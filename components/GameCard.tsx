'use client'

import { useRef } from 'react'
import Image from "next/image";
import { motion, useInView } from 'framer-motion'
import { Game } from "@/types/game";

type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  const achievementPercent = game.achievements
    ? Math.round((game.achievements.earned / game.achievements.total) * 100)
    : null;

  // useInView fires once when the card scrolls into the viewport (15% threshold).
  // We pass this boolean to the motion.div below so the bar animates on entry.
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <article ref={ref} className={`group h-full flex flex-col gap-3 border p-5 transition-all duration-500 relative overflow-hidden
      ${game.perfect
        ? 'border-amber/30 bg-cinder hover:border-amber/70 hover:shadow-[0_0_48px_rgba(232,201,122,0.22),0_0_16px_rgba(232,201,122,0.1)_inset]'
        : 'border-gold/25 bg-cinder hover:border-gold/60 hover:shadow-[0_0_40px_rgba(201,169,110,0.18)]'
      } hover:scale-[1.02]`}>

      {/* Shimmer sweep — slides diagonally across card on hover, CSS-only */}
      <div className="card-shimmer pointer-events-none absolute inset-0 z-20 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Background image — only rendered when game.image is set */}
      {game.image && (
        <>
          <Image
            src={game.image}
            alt={game.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="object-cover object-center opacity-50 group-hover:opacity-65 transition-opacity duration-300"
          />
          {/* Gradient so text stays readable over the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinder via-cinder/80 to-cinder/30" />
        </>
      )}

      {/* All content sits above the bg image layers */}
      <div className="relative z-10 flex flex-col gap-3 h-full [text-shadow:0_1px_12px_rgba(0,0,0,0.9),0_0_4px_rgba(0,0,0,0.8)]">

        {/* ── HEADER ─────────────────────────────────────── */}
        <h3 className="font-display text-sm leading-snug tracking-wide text-gold">
          {game.title}
        </h3>

        {/* ── META ─────────────────────────────────────────── */}
        <p className="font-display text-xs tracking-widest text-bronze uppercase">
          {game.developer} · {game.year}
        </p>

        {/* ── LORE ─────────────────────────────────────────── */}
        <p className="font-body text-sm leading-relaxed text-bronze border-t border-gold/15 pt-3">
          {game.lore}
        </p>

        {/* ── STATS ────────────────────────────────────────── */}
        <div className="mt-auto flex flex-col gap-2 border-t border-gold/15 pt-3">

          <div className="flex justify-between font-display text-xs tracking-widest text-bronze">
            <span>Hours Bound</span>
            {game.hours !== undefined
              ? <span className="text-gold">{game.hours}h+</span>
              : <span className="text-bronze italic">Time uncounted</span>
            }
          </div>

          {game.achievements && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-display text-xs tracking-widest text-bronze">
                <span>Achievements</span>
                <span className={game.perfect ? "text-amber" : "text-gold"}>
                  {game.achievements.earned}/{game.achievements.total}
                </span>
              </div>
              <div className="relative h-px w-full bg-gold/20 overflow-hidden">
                {/* motion.div animates from 0% → actual% when the card enters view */}
                <motion.div
                  className={`absolute inset-y-0 left-0 h-full ${game.perfect ? "bg-amber" : "bg-gold"}`}
                  initial={{ width: '0%' }}
                  animate={isInView ? { width: `${achievementPercent}%` } : { width: '0%' }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                />
              </div>
            </div>
          )}

          {!game.achievements && !game.perfect && (
            <p className="font-display text-xs tracking-widest text-ember uppercase">
              Chronicle Unfinished
            </p>
          )}

        </div>

        {/* ── REMEMBRANCE BADGE ────────────────────────────── */}
        {game.perfect && (
          <div className="flex justify-center border-t border-amber/20 pt-3">
            <span className="font-display text-xs tracking-[0.2em] text-amber border border-amber/40 px-3 py-1 uppercase">
              Remembrance
            </span>
          </div>
        )}

        {/* ── INSPECT PROMPT ───────────────────────────────── */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-px flex-1 bg-gold/20" />
          <span className="font-display text-[10px] tracking-[0.3em] text-gold/50 uppercase">⚔ Inspect</span>
          <div className="h-px flex-1 bg-gold/20" />
        </div>

      </div>
    </article>
  );
}
