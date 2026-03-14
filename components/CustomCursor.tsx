'use client'

/*
  CustomCursor.tsx
  ────────────────
  Two layers:
  1. <canvas>      → falling ember particles  (pure canvas, zero React re-renders)
  2. <motion.div>  → cursor ring              (Framer Motion spring)

  Ember physics per frame:
    vy += GRAVITY          → accelerates downward
    vx *= AIR_RESISTANCE   → slight horizontal drag
    x  += vx
    y  += vy
    life -= decay          → fades and shrinks until dead

  Spawn count scales with mouse speed so fast flicks produce bursts,
  slow drifts produce a gentle trickle.
*/

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Ember {
  x:     number
  y:     number
  vx:    number   // horizontal velocity (px/frame)
  vy:    number   // vertical velocity   (px/frame, negative = up)
  life:  number   // 1 → 0
  decay: number   // life lost per frame
  size:  number   // radius at full life
  r: number; g: number; b: number  // warm ember color components
}

const MAX_EMBERS    = 180
const GRAVITY       = 0.055   // added to vy each frame — feels like real rising sparks
const AIR_RESIST    = 0.985   // multiplied on vx each frame — gentle drag
const GLOW_BLUR     = 7       // canvas shadowBlur — the ember glow radius

export default function CustomCursor() {
  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const embersRef       = useRef<Ember[]>([])
  const rafRef          = useRef<number>(0)
  const mouseRef        = useRef({ x: -999, y: -999 })
  const lastSpawnRef    = useRef({ x: -999, y: -999 })  // last position we spawned at

  const cursorX = useMotionValue(-999)
  const cursorY = useMotionValue(-999)
  const springX = useSpring(cursorX, { stiffness: 600, damping: 35 })
  const springY = useSpring(cursorY, { stiffness: 600, damping: 35 })

  useEffect(() => {
    // No hover cursor on touch devices — skip entirely
    if (window.matchMedia('(hover: none)').matches) return

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Spawn embers at (x, y) ─────────────────────────────────────────────
    function spawnEmbers(x: number, y: number, speed: number) {
      if (embersRef.current.length >= MAX_EMBERS) return

      // 1 ember for slow movement, up to 3 for fast flicks
      const count = speed < 4 ? 1 : speed < 12 ? 2 : 3

      for (let i = 0; i < count; i++) {
        // Pick a warm color — mix of gold, orange, and deep ember red
        const roll = Math.random()
        let r: number, g: number, b: number
        if (roll > 0.65) {
          // Amber / gold
          r = 225 + Math.random() * 15
          g = 165 + Math.random() * 30
          b = 60  + Math.random() * 40
        } else if (roll > 0.3) {
          // Orange
          r = 220 + Math.random() * 20
          g = 80  + Math.random() * 60
          b = 10  + Math.random() * 20
        } else {
          // Deep ember red
          r = 160 + Math.random() * 50
          g = 30  + Math.random() * 40
          b = 10
        }

        embersRef.current.push({
          x,
          y,
          // Horizontal: small random drift
          vx: (Math.random() - 0.5) * 2.2,
          // Vertical: slight downward drift from spawn — no upward kick
          vy: Math.random() * 0.8,
          life:  1,
          decay: 0.016 + Math.random() * 0.014,  // dies in ~40–62 frames (0.65–1s)
          size:  Math.random() * 2.2 + 0.9,
          r, g, b,
        })
      }
    }

    // ── Mouse move — only update position, no spawning here ──────────────
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      cursorX.set(e.clientX - 12)
      cursorY.set(e.clientY - 12)
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation loop ────────────────────────────────────────────────────
    function draw() {
      if (document.hidden) { rafRef.current = requestAnimationFrame(draw); return }

      // Spawn embers once per frame at the spring position —
      // this is exactly where the cursor ring is drawn, so particles
      // are always perfectly in sync with the visible cursor
      const sx   = springX.get() + 12
      const sy   = springY.get() + 12
      const last = lastSpawnRef.current
      // Only act once the spring has settled on a real position
      if (sx > -100) {
        const moved = last.x === -999 ? 0 : Math.hypot(sx - last.x, sy - last.y)
        if (moved > 1.5) spawnEmbers(sx, sy, moved)
        // Always update so next frame has a valid reference point
        lastSpawnRef.current = { x: sx, y: sy }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const embers = embersRef.current

      // Set glow once for the whole batch — cheaper than per-particle
      ctx.shadowBlur = GLOW_BLUR

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]

        // ── Physics ──────────────────────────────────────
        e.vy  += GRAVITY
        e.vx  *= AIR_RESIST
        e.x   += e.vx
        e.y   += e.vy
        e.life -= e.decay

        if (e.life <= 0) { embers.splice(i, 1); continue }

        // Quadratic fade: fades slowly at first then quickly near end
        const alpha  = e.life * e.life
        const radius = e.size * e.life   // shrinks as it dies

        // ── Draw ─────────────────────────────────────────
        ctx.shadowColor = `rgba(${e.r},${e.g},${e.b},${(alpha * 0.7).toFixed(2)})`
        ctx.fillStyle   = `rgba(${e.r},${e.g},${e.b},${alpha.toFixed(2)})`

        ctx.beginPath()
        ctx.arc(e.x, e.y, Math.max(0.1, radius), 0, Math.PI * 2)
        ctx.fill()
      }

      // Reset shadow so it doesn't bleed into other canvas operations
      ctx.shadowBlur = 0

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Ember trail canvas — full-screen, sits below the cursor ring */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9990]"
      />

      {/* Cursor — glowing ember point, spring-smoothed */}
      <motion.div
        className="pointer-events-none fixed z-[9999] top-0 left-0 h-6 w-6"
        style={{ x: springX, y: springY }}
      >
        {/* Outer soft glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(220,120,20,0.35) 0%, transparent 70%)' }}
        />
        {/* Inner bright core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-amber"
          style={{ boxShadow: '0 0 6px 2px rgba(232,180,50,0.9), 0 0 14px 4px rgba(200,80,10,0.5)' }}
        />
      </motion.div>
    </>
  )
}
