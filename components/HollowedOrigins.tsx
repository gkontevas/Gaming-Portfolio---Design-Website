import Image from "next/image"
import FadeIn from "@/components/FadeIn"
import AnimatedStatBars from "@/components/AnimatedStatBars"
import AnimatedCounter from "@/components/AnimatedCounter"
import { perfectGames } from "@/data/games"

export default function HollowedOrigins() {
  return (
    <section
      id="origins"
      className="px-8 py-24"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1C1409 0%, #0D0A07 75%)' }}
    >
      <div className="mx-auto max-w-5xl">

        <FadeIn className="mb-16 flex flex-col items-center text-center">
          <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
            Location Discovered
          </p>
          <h2 className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
            Hollowed Origins
          </h2>
          <div className="my-6 h-px w-16 bg-gold/40" />
          <p className="max-w-md font-body text-sm leading-relaxed text-bronze">
            What the character screen reveals that no cutscene can.
          </p>
        </FadeIn>

        {/* Steam screenshot — edge-to-edge, corner-framed, no outer box */}
        <FadeIn>
          <div className="relative w-full mb-1">
            {/* Corner tick marks — same technique as the quote carousel */}
            <div className="absolute top-0 left-0   z-10 w-6 h-6 border-t-2 border-l-2 border-gold/50" />
            <div className="absolute top-0 right-0  z-10 w-6 h-6 border-t-2 border-r-2 border-gold/50" />
            <Image
              src="/steam.png"
              alt="Steam profile"
              width={1540}
              height={784}
              className="w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ash" />
          </div>
        </FadeIn>

        {/* ── IDENTITY BLOCK ──────────────────────────────────────
            Relative container so the ghost kanji can be positioned
            behind the text content absolutely.
        */}
        <FadeIn direction="left">
          <div className="relative overflow-hidden border-b border-gold/15 pb-10 mb-10">

            {/* Ghost kanji — the most visually interesting element in the section.
                Positioned top-right, huge, barely visible.
                Gives the identity block atmosphere without competing with text. */}
            <span className="pointer-events-none select-none absolute -right-4 -top-6 font-display text-[8rem] sm:text-[11rem] md:text-[14rem] leading-none text-gold/[0.06]">
              両面宿儺
            </span>

            <p className="mb-3 font-display text-xs tracking-[0.6em] text-bronze/70 uppercase">
              Ashen One · Greece
            </p>
            {/* Visible kanji — intentionally smaller than the ghost, acts as a title */}
            <h3 className="font-display text-4xl tracking-[0.1em] text-gold sm:text-5xl">
              両面宿儺
            </h3>
            <p className="mt-2 font-display text-sm tracking-[0.35em] text-bronze uppercase">
              Dimos Gkontevas
            </p>
            {/* "Domain Expansion" — treated as a standalone quote, not a data row */}
            <p className="mt-6 font-body text-xl italic text-bronze/80 sm:text-2xl">
              Domain Expansion: Panic Roll.
            </p>
          </div>
        </FadeIn>

        {/* ── TWO COLUMNS ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

          {/* LEFT */}
          <FadeIn direction="left" className="flex flex-col gap-8">
            <p className="font-body text-lg leading-relaxed text-bronze">
              No incantation ever whispered. No phantom summoned from beyond the fog.
              Only the blade and the muscle memory of ten thousand deaths.
              Swift where others are heavy. Patient where others are reckless.
              Dexterity is not a build — it is a philosophy.
            </p>

            <div className="flex flex-col gap-5 border-t border-gold/15 pt-6">
              {[
                { label: "Weapons",   value: "Katanas · Twin Blades · Curved Swords · Spears", accent: false },
                { label: "Playstyle", value: "Parry & punish — or aggressive dodge on recovery", accent: false },
                { label: "Summons",   value: "None. Ever.",                                      accent: true  },
                { label: "Magic",     value: "Not once.",                                        accent: true  },
                { label: "Covenant",  value: "None — allegiance to the self",                   accent: false },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-4 font-display text-xs tracking-widest">
                  <span className="text-bronze/60 uppercase shrink-0">{row.label}</span>
                  <span className={`text-right ${row.accent ? 'text-amber' : 'text-gold'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* RIGHT — animated stat bars */}
          <FadeIn direction="right">
            <AnimatedStatBars stats={[
              { name: "Dexterity",    value: 99, color: "bg-amber"  },
              { name: "Endurance",    value: 86, color: "bg-gold"   },
              { name: "Vigor",        value: 70, color: "bg-gold"   },
              { name: "Strength",     value: 18, color: "bg-bronze" },
              { name: "Intelligence", value:  6, color: "bg-ember"  },
              { name: "Faith",        value:  6, color: "bg-ember"  },
            ]} />
          </FadeIn>

        </div>

        {/* ── STEAM STATS STRIP ─────────────────────────────────── */}
        <FadeIn delay={0.2} className="mt-14 grid grid-cols-2 gap-6 border-t border-gold/15 pt-10 sm:grid-cols-4">
          {[
            { label: "Achievements", value: 1073, suffix: ''  },
            { label: "Perfect Games", value: perfectGames.length, suffix: ''  },
            { label: "Completion",    value: 44,  suffix: '%' },
            { label: "Library",       value: 46,  suffix: ''  },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <span className="font-display text-3xl sm:text-4xl tracking-wide text-gold leading-none">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <div className="h-px w-8 bg-gold/20" />
              <span className="font-display text-[10px] tracking-[0.4em] text-bronze/60 uppercase">{stat.label}</span>
            </div>
          ))}
        </FadeIn>

      </div>
    </section>
  )
}
