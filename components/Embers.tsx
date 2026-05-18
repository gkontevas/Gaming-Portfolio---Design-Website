'use client'

// Deterministic LCG — same values on server and client, no hydration mismatch,
// no useEffect delay, embers are present on first paint.
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0
    return s / 0xffffffff
  }
}

const rand = seeded(42)
const EMBERS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left:     rand() * 100,
  size:     rand() * 2 + 1.5,
  duration: rand() * 5 + 6,
  delay:    rand() * 8,
  drift:    (rand() - 0.5) * 60,
}))

export default function Embers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {EMBERS.map((e) => (
        <div
          key={e.id}
          className="absolute bottom-0 rounded-full bg-amber"
          style={{
            left:      `${e.left}%`,
            width:     e.size,
            height:    e.size,
            animation: `ember-rise ${e.duration}s ${e.delay}s infinite ease-out`,
            '--drift': `${e.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
