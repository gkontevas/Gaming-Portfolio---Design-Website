import Image from "next/image"
import FadeIn from "@/components/FadeIn"

const relics = [
  {
    rank: 1,
    title: "Clair Obscur: Expedition 33",
    hours: 126, achievements: "55/55",
    note: "Too bad Ubisoft. Your ex-devs know how to make a game.",
    image: "/clair.avif",
  },
  {
    rank: 2,
    title: "Sekiro: Shadows Die Twice",
    hours: 77, achievements: "34/34",
    note: "PARRY IT.",
    image: "/sekiro.jpg",
  },
  {
    rank: 3,
    title: "Elden Ring",
    hours: 300, achievements: "42/42",
    note: "What can I say about this game? Closest game to perfection ever.",
    image: "/elden ring.jpg",
  },
  {
    rank: 4,
    title: "Black Myth: Wukong",
    hours: 81, achievements: "81/81",
    note: "Amazing depiction of Chinese mythology.",
    image: "/wukong.webp",
  },
  {
    rank: 5,
    title: "Bloodborne",
    hours: 100, achievements: "40/40 PS4",
    note: "The best atmosphere out of all games I've played.",
    image: "/bloodborne.avif",
  },
]

export default function SacredRelics() {
  return (
    <section id="arsenal" className="px-8 py-24">
      <div className="mx-auto max-w-4xl">

        <FadeIn className="mb-16 flex flex-col items-center text-center">
          <p className="mb-3 font-display text-xs tracking-[0.5em] text-bronze uppercase">
            Achievement Unlocked
          </p>
          <h2 className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
            Sacred Relics
          </h2>
          <div className="my-6 h-px w-16 bg-gold/40" />
          <p className="max-w-md font-body text-sm leading-relaxed text-bronze">
            Five worlds above all others. Not chosen lightly.
          </p>
        </FadeIn>

        <div className="flex flex-col">
          {relics.map((entry, i) => (
            <FadeIn key={entry.rank} delay={i * 0.08}>
              <div className={`group relative flex items-center gap-6 sm:gap-10 border-t py-12 sm:py-14 last:border-b overflow-hidden transition-all duration-500 ${
                entry.rank === 1
                  ? "border-amber/25 hover:border-amber/50"
                  : "border-gold/15 hover:border-gold/30"
              }`}>

                {/* Background image — always visible at low opacity, brightens on hover */}
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  className="object-cover object-center opacity-[0.12] group-hover:opacity-[0.28] transition-opacity duration-700 pointer-events-none"
                  sizes="(min-width: 1024px) 896px, 100vw"
                />
                {/* Left-heavy gradient keeps the text readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-ash via-ash/90 to-ash/50 pointer-events-none" />

                {/* Left accent bar — rank 1 always glowing, others reveal on hover */}
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 ${
                  entry.rank === 1
                    ? "bg-amber/70 group-hover:bg-amber"
                    : "bg-transparent group-hover:bg-gold/40"
                }`} />

                {/* Ghost rank — massive number in the background, purely atmospheric */}
                <span className="pointer-events-none absolute right-4 select-none font-display text-[7rem] leading-none text-gold/[0.05] group-hover:text-gold/[0.10] transition-colors duration-500">
                  {String(entry.rank).padStart(2, "0")}
                </span>

                {/* Visible rank — rank 1 gets amber, others are muted */}
                <span className={`relative z-10 font-display text-5xl sm:text-7xl leading-none shrink-0 w-16 sm:w-24 tabular-nums pl-4 sm:pl-6 transition-colors duration-300 ${
                  entry.rank === 1 ? "text-amber/60 group-hover:text-amber" : "text-bronze/20 group-hover:text-bronze/50"
                }`}>
                  {String(entry.rank).padStart(2, "0")}
                </span>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col gap-2 pr-16 sm:pr-24">
                  <h3 className={`font-display tracking-[0.15em] uppercase transition-colors duration-300 ${
                    entry.rank === 1
                      ? "text-xl sm:text-2xl text-amber group-hover:text-amber"
                      : "text-lg text-gold group-hover:text-amber"
                  }`}>
                    {entry.title}
                  </h3>
                  <p className="font-body text-base italic leading-relaxed text-bronze">
                    {entry.note}
                  </p>
                  <div className="mt-2 flex gap-6 font-display text-xs tracking-widest text-bronze/50 uppercase">
                    <span>{entry.hours}h</span>
                    <span>·</span>
                    <span>{entry.achievements}</span>
                  </div>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  )
}
