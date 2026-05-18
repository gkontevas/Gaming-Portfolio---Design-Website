import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import FadeIn from "@/components/FadeIn";
import RevealText from "@/components/RevealText";
import AnimatedCardGrid from "@/components/AnimatedCardGrid";
import Embers from "@/components/Embers";
import AnimatedCounter from "@/components/AnimatedCounter";
import Parallax from "@/components/Parallax";
import DescendButton from "@/components/DescendButton";
import HollowedOrigins from "@/components/HollowedOrigins";
import HollowTrigger from "@/components/HollowTrigger";
import HeroTitle from "@/components/HeroTitle";
import LoreWord from "@/components/LoreWord";
const EldenRingCinematic = dynamic(() => import("@/components/EldenRingCinematic"))
const SacredRelics        = dynamic(() => import("@/components/SacredRelics"))
const EmberTrail          = dynamic(() => import("@/components/EmberTrail"))

// Loaded only when near the viewport — reduces initial JS bundle
const BossShowcase      = dynamic(() => import("@/components/BossShowcase"))
const QuoteCarousel     = dynamic(() => import("@/components/QuoteCarousel"))
const BonfireMessages   = dynamic(() => import("@/components/BonfireMessages"))
const LedgerSection     = dynamic(() => import("@/components/LedgerSection"))
import { games, perfectGames, currentlyPlaying } from "@/data/games";

const totalHours = Math.floor(games.reduce((sum, g) => sum + (g.hours ?? 0), 0));

export default function Home() {
  return (
    <>
      <Nav />

      <main className="min-h-screen" style={{ overflowX: 'clip' }}>

        {/* ═══════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════ */}
        <section
          className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 40%, #221608 0%, #0D0A07 65%)" }}
        >
          <Embers />

          {/* Film grain — static SVG noise, no JS, negligible cost */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
            style={{ opacity: 0.032, mixBlendMode: 'screen' }}
          >
            <filter id="hero-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#hero-grain)" />
          </svg>

          <FadeIn delay={0}>
            <Parallax depth={0.15}>
              <p className="mb-6 font-display text-sm tracking-[0.2em] text-bronze uppercase sm:tracking-[0.7em]">
                A record of worlds consumed
              </p>
            </Parallax>
          </FadeIn>

          <HeroTitle />

          <FadeIn delay={0.6}>
            <Parallax depth={0.1}>
              <HollowTrigger />
            </Parallax>
          </FadeIn>

          {/* Currently playing — bottom-left HUD element */}
          <FadeIn delay={0.85} className="absolute bottom-14 left-3 hidden sm:flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
              </span>
              <span className="font-display text-xs tracking-[0.4em] text-bronze/70 uppercase">
                Currently Playing
              </span>
            </div>
            <p className="font-display text-base tracking-[0.15em] text-gold uppercase">
              {currentlyPlaying}
            </p>
          </FadeIn>

          {/* Total hours — bottom-right HUD element */}
          <FadeIn delay={0.75} className="absolute bottom-14 right-3 hidden sm:flex flex-col items-end gap-1">
            <p className="font-display text-3xl tracking-wide text-gold leading-none">
              <AnimatedCounter value={totalHours} suffix="+" />
            </p>
            <p className="font-display text-xs tracking-[0.4em] text-bronze/70 uppercase">
              Hours Surrendered
            </p>
          </FadeIn>

          <DescendButton />
        </section>

        <HollowedOrigins />

        {/* ═══════════════════════════════════════════════════
            REMEMBRANCES
        ═══════════════════════════════════════════════════ */}
        <section id="remembrances" className="bg-cinder px-8 py-36 scroll-mt-20">
          <div className="mx-auto max-w-6xl">

            <FadeIn className="mb-16 flex flex-col items-center text-center">
              <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
                Location Discovered
              </p>
              <RevealText delay={0.1} className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
                <LoreWord word="Remembrances">Remembrances</LoreWord> of the Fallen
              </RevealText>
              <div className="my-6 h-px w-16 bg-gold/40" />
              <p className="max-w-md font-body text-sm leading-relaxed text-bronze">
                Worlds fully conquered. Every secret unearthed, every trial endured.
                These are not merely completed — they are <LoreWord word="mastered">mastered</LoreWord>.
              </p>
              <p className="mt-4 font-display text-sm tracking-widest text-amber">
                {perfectGames.length} worlds sealed
              </p>
            </FadeIn>

            <AnimatedCardGrid games={perfectGames} />

          </div>
        </section>

        <EldenRingCinematic />

        <EmberTrail />

        <SacredRelics />

        {/* ═══════════════════════════════════════════════════
            THE WORTHY — boss showcase
        ═══════════════════════════════════════════════════ */}
        <BossShowcase />

        {/* ═══════════════════════════════════════════════════
            LEDGER OF THE UNLIT — stats
        ═══════════════════════════════════════════════════ */}
        <LedgerSection />

        {/* ═══════════════════════════════════════════════════
            WORDS OF SCHOLARS
        ═══════════════════════════════════════════════════ */}
        <section
          id="scholars"
          className="px-8 py-36 scroll-mt-20"
          style={{ background: 'radial-gradient(ellipse at 50% 20%, #1C1409 0%, #0D0A07 60%)' }}
        >
          <div className="mx-auto max-w-4xl">

            <FadeIn className="mb-16 flex flex-col items-center text-center">
              <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
                Location Discovered
              </p>
              <RevealText delay={0.1} className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
                Words of Scholars
              </RevealText>
              <div className="my-6 h-px w-16 bg-gold/40" />
              <p className="font-body text-sm leading-relaxed text-bronze">
                Inscriptions found across the worlds. Carried out.
              </p>
            </FadeIn>

            <FadeIn>
              <QuoteCarousel />
            </FadeIn>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            BONFIRE MESSAGES
        ═══════════════════════════════════════════════════ */}
        <BonfireMessages />

        {/* ═══════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════ */}
        <FadeIn>
          <footer className="border-t border-gold/20 px-8 py-24 text-center">

            <div className="flex items-center justify-center gap-6 mb-10">
              <div className="h-px w-16 bg-gold/20" />
              <span className="font-display text-xl text-gold/30">✦</span>
              <div className="h-px w-16 bg-gold/20" />
            </div>

            <p className="font-display text-xs tracking-[0.4em] text-bronze uppercase">
              Age of Fire, Year 2026 · All embers preserved
            </p>
            <p className="mt-3 font-body text-sm italic text-bronze/60">
              The flame fades. But it never dies.
            </p>

            <p className="mt-8 hidden sm:block font-display text-[10px] tracking-[0.35em] text-bronze/30 uppercase">
              Press 1 – 5 to navigate · Esc to return to top
            </p>

          </footer>
        </FadeIn>

      </main>
    </>
  );
}
