import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import FadeIn from "@/components/FadeIn";
import AnimatedCardGrid from "@/components/AnimatedCardGrid";
import Embers from "@/components/Embers";
import AnimatedCounter from "@/components/AnimatedCounter";
import Parallax from "@/components/Parallax";
import DescendButton from "@/components/DescendButton";
import HollowedOrigins from "@/components/HollowedOrigins";
import HollowTrigger from "@/components/HollowTrigger";
import SacredRelics from "@/components/SacredRelics";

// Loaded only when near the viewport — reduces initial JS bundle
const BossShowcase   = dynamic(() => import("@/components/BossShowcase"))
const QuoteCarousel  = dynamic(() => import("@/components/QuoteCarousel"))
import { games, perfectGames, currentlyPlaying } from "@/data/games";

const totalHours = Math.floor(games.reduce((sum, g) => sum + (g.hours ?? 0), 0));

export default function Home() {
  return (
    <>
      <Nav />

      <main className="min-h-screen overflow-x-hidden">

        {/* ═══════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════ */}
        <section
          className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 50%, #1C1409 0%, #0D0A07 70%)" }}
        >
          <Embers />
          <FadeIn delay={0}>
            <Parallax depth={0.15}>
              <p className="mb-6 font-display text-sm tracking-[0.2em] text-bronze uppercase sm:tracking-[0.7em]">
                A record of worlds consumed
              </p>
            </Parallax>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Parallax depth={0.3}>
              <h1 className="mt-2 font-display uppercase">
                <span className="block text-5xl tracking-[0.15em] text-gold sm:text-7xl sm:tracking-[0.3em] md:text-9xl">
                  Vestiges
                </span>
                <span className="mt-3 block text-lg tracking-[0.3em] text-bronze sm:text-2xl sm:tracking-[0.65em]">
                  of the Unlit
                </span>
              </h1>
            </Parallax>
          </FadeIn>

          <FadeIn delay={0.4}>
            <Parallax depth={0.2}>
              <div className="my-10 flex w-56 items-center gap-3">
                <div className="h-px flex-1 bg-gold/50" />
                <span className="text-sm text-gold/80">✦</span>
                <div className="h-px flex-1 bg-gold/50" />
              </div>
            </Parallax>
          </FadeIn>

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

        {/* ── SECTION DIVIDER ── */}
        <FadeIn>
          <div className="flex items-center gap-6 px-16 py-12">
            <div className="h-px flex-1 bg-gold/25" />
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold/50" />
              <span className="font-display text-sm text-gold/70">✦</span>
              <div className="h-px w-8 bg-gold/50" />
            </div>
            <div className="h-px flex-1 bg-gold/25" />
          </div>
        </FadeIn>

        <HollowedOrigins />

        {/* ── SECTION DIVIDER ── */}
        <FadeIn>
          <div className="flex items-center gap-6 px-16 py-12">
            <div className="h-px flex-1 bg-gold/25" />
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold/50" />
              <span className="font-display text-sm text-gold/70">✦</span>
              <div className="h-px w-8 bg-gold/50" />
            </div>
            <div className="h-px flex-1 bg-gold/25" />
          </div>
        </FadeIn>

        {/* ═══════════════════════════════════════════════════
            REMEMBRANCES
        ═══════════════════════════════════════════════════ */}
        <section id="remembrances" className="bg-cinder px-8 py-24">
          <div className="mx-auto max-w-6xl">

            <FadeIn className="mb-16 flex flex-col items-center text-center">
              <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
                Location Discovered
              </p>
              <h2 className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
                Remembrances of the Fallen
              </h2>
              <div className="my-6 h-px w-16 bg-gold/40" />
              <p className="max-w-md font-body text-sm leading-relaxed text-bronze">
                Worlds fully conquered. Every secret unearthed, every trial endured.
                These are not merely completed — they are mastered.
              </p>
              <p className="mt-4 font-display text-sm tracking-widest text-amber">
                {perfectGames.length} worlds sealed
              </p>
            </FadeIn>

            <AnimatedCardGrid games={perfectGames} />

          </div>
        </section>

        {/* ── SECTION DIVIDER ── */}
        <FadeIn>
          <div className="flex items-center gap-6 px-16 py-12">
            <div className="h-px flex-1 bg-gold/25" />
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold/50" />
              <span className="font-display text-sm text-gold/70">✦</span>
              <div className="h-px w-8 bg-gold/50" />
            </div>
            <div className="h-px flex-1 bg-gold/25" />
          </div>
        </FadeIn>

        <SacredRelics />

        {/* ═══════════════════════════════════════════════════
            THE WORTHY — boss showcase
        ═══════════════════════════════════════════════════ */}
        <BossShowcase />

        {/* ═══════════════════════════════════════════════════
            WORDS OF SCHOLARS
        ═══════════════════════════════════════════════════ */}
        <section
          id="scholars"
          className="px-8 py-24"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #1C1409 0%, #0D0A07 70%)' }}
        >
          <div className="mx-auto max-w-4xl">

            <FadeIn className="mb-16 flex flex-col items-center text-center">
              <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
                Location Discovered
              </p>
              <h2 className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
                Words of Scholars
              </h2>
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
            FOOTER
        ═══════════════════════════════════════════════════ */}
        <FadeIn>
          <footer className="border-t border-gold/20 px-8 py-16 text-center">

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
