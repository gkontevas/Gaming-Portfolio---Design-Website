import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#0D0A07' }}
    >
      <p className="font-display text-xs tracking-[0.5em] text-bronze/50 uppercase mb-10">
        Error · 404 · The Fog Wall
      </p>

      <h1
        className="font-display uppercase leading-none"
        style={{
          fontSize: 'clamp(5rem, 22vw, 13rem)',
          color: '#8B2A1A',
          textShadow: '0 0 60px rgba(139,42,26,0.85), 0 0 140px rgba(139,42,26,0.3)',
        }}
      >
        You Died
      </h1>

      <p className="mt-8 font-display text-sm tracking-[0.35em] text-bronze/50 uppercase">
        The path you sought does not exist.
      </p>
      <p className="mt-2 font-body text-sm italic text-bronze/35">
        Perhaps it never did.
      </p>

      <div className="my-10 h-px w-16 bg-gold/25" />

      <Link
        href="/"
        className="font-display text-xs tracking-[0.45em] text-bronze/70 uppercase border border-gold/25 px-8 py-3 transition-colors duration-300 hover:border-gold/55 hover:text-gold/90"
      >
        Return to Bonfire
      </Link>
    </div>
  )
}
