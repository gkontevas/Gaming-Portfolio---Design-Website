import FadeIn from "@/components/FadeIn"
import RevealText from "@/components/RevealText"
import AnimatedStatBars from "@/components/AnimatedStatBars"
import SteamReveal from "@/components/SteamReveal"
import HollowedIdentity from "@/components/HollowedIdentity"

export default function HollowedOrigins() {
  return (
    <section
      id="origins"
      className="px-8 py-36 scroll-mt-20"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #211507 0%, #0D0A07 65%)' }}
    >
      <div className="mx-auto max-w-5xl">

        <FadeIn className="mb-16 flex flex-col items-center text-center">
          <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
            Location Discovered
          </p>
          <RevealText delay={0.1} className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
            Hollowed Origins
          </RevealText>
          <div className="my-6 h-px w-16 bg-gold/40" />
          <p className="max-w-md font-body text-sm leading-relaxed text-bronze">
            What the character screen reveals that no cutscene can.
          </p>
        </FadeIn>

        {/* Steam screenshot — scan-line reveal */}
        <SteamReveal />

        {/* ── IDENTITY BLOCK — individually animated elements */}
        <HollowedIdentity />

        {/* ── TWO COLUMNS ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

          {/* LEFT */}
          <FadeIn direction="left" className="flex flex-col gap-8">
            <p className="font-body text-lg leading-relaxed text-bronze">
              Every build tried. Every school of magic studied. Every weapon class mastered.
              Always alone — no phantoms, no summons, no shortcuts.
              The world deserves to be conquered on your own terms.
            </p>

            <div className="flex flex-col gap-5 border-t border-gold/15 pt-6">
              {[
                { label: "Weapons",   value: "All classes — blade, staff, bow, fist, hex", accent: false },
                { label: "Playstyle", value: "Adapts to the encounter. Always.",           accent: false },
                { label: "Summons",   value: "None. Solo, always.",                       accent: true  },
                { label: "Magic",     value: "Sorcery · Incantations · Pyromancy",        accent: false },
                { label: "Covenant",  value: "All of them. Every questline. No NPC left.", accent: true  },
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
              { name: "Vigor",        value: 99, color: "bg-amber"  },
              { name: "Dexterity",    value: 99, color: "bg-amber"  },
              { name: "Strength",     value: 99, color: "bg-gold"   },
              { name: "Intelligence", value: 99, color: "bg-gold"   },
              { name: "Faith",        value: 99, color: "bg-gold"   },
              { name: "Endurance",    value: 99, color: "bg-bronze" },
            ]} />
          </FadeIn>

        </div>

      </div>
    </section>
  )
}
