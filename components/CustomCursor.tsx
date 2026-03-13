'use client'

/*
  CustomCursor.tsx
  ────────────────
  Two layers:
  1. <canvas>         → ember trail  (pure JS, requestAnimationFrame, zero React re-renders)
  2. <motion.div>     → cursor ring  (Framer Motion spring — lags slightly behind for feel)

  Why split them?
  The trail needs to draw and CLEAR 60 times per second. If that were React state,
  the whole component would re-render 60×/s. Canvas sidesteps React entirely.
  The ring is a single div — Framer Motion updates its CSS transform directly
  (also bypassing React reconciliation) via useMotionValue.
*/

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// One recorded position in the trail
interface TrailPoint {
  x: number
  y: number
  age: number  // 0 = just added, increases each frame
}

const TRAIL_LENGTH = 22   // how many points we keep in the ring buffer
const TRAIL_LIFE   = 22   // frames before a point fully fades out
const POINT_RADIUS = 2    // px radius of each ember dot

export default function CustomCursor() {
  // ── refs ─────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef  = useRef<TrailPoint[]>([])
  const rafRef    = useRef<number>(0)
  const mouseRef  = useRef({ x: -999, y: -999 })

  // ── spring cursor ring ────────────────────────────────
  // useMotionValue: like useState but updates the DOM directly, no re-render
  const cursorX = useMotionValue(-999)
  const cursorY = useMotionValue(-999)

  // useSpring: wraps a MotionValue with physics.
  // stiffness = how fast it catches up. damping = how much it overshoots.
  // 600/35 = fast spring, very little wobble — feels snappy but alive.
  const springX = useSpring(cursorX, { stiffness: 600, damping: 35 })
  const springY = useSpring(cursorY, { stiffness: 600, damping: 35 })

  useEffect(() => {
    // Skip on touch devices — they have no hover cursor
    if (window.matchMedia('(hover: none)').matches) return

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    // ── resize canvas to always fill the screen ──────────
    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── track mouse position ──────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      // Update the spring cursor ring position
      // subtract half the ring size (24px) so it centers on the cursor
      cursorX.set(e.clientX - 12)
      cursorY.set(e.clientY - 12)

      // Push current pos into trail
      trailRef.current.push({ x: e.clientX, y: e.clientY, age: 0 })

      // Keep only TRAIL_LENGTH most recent points (drop oldest)
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.shift()
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── animation loop ────────────────────────────────────
    // requestAnimationFrame calls our function before each screen repaint.
    // Typically 60 times per second. We clear and redraw the entire canvas.
    function draw() {
      if (document.hidden) { rafRef.current = requestAnimationFrame(draw); return }
      // clearRect erases everything from last frame
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const trail = trailRef.current

      for (let i = 0; i < trail.length; i++) {
        const pt = trail[i]
        pt.age++   // age increases each frame

        // alpha fades from 0.6 (fresh) to 0 (old)
        // We also scale by position in array: points at the back are oldest
        const lifeFraction = 1 - pt.age / TRAIL_LIFE
        if (lifeFraction <= 0) continue

        // Size shrinks as the point ages
        const radius = POINT_RADIUS * lifeFraction

        // Draw the ember dot
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)

        // Colour: interpolate from amber (#E8C97A) to ember red (#8B2A1A)
        // Older points are more red, newer points are more gold
        const r = Math.round(232 * lifeFraction + 139 * (1 - lifeFraction))
        const g = Math.round(201 * lifeFraction +  42 * (1 - lifeFraction))
        const b = Math.round(122 * lifeFraction +  26 * (1 - lifeFraction))
        ctx.fillStyle = `rgba(${r},${g},${b},${lifeFraction * 0.7})`
        ctx.fill()
      }

      // Remove fully dead points to keep the array clean
      trailRef.current = trail.filter((pt) => pt.age < TRAIL_LIFE)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    // ── cleanup on unmount ────────────────────────────────
    // useEffect returns a cleanup fn — React calls it when the component unmounts.
    // We MUST cancel the animation frame, or it keeps running after the page changes.
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* The ember trail canvas — full-screen, non-interactive */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
      />

      {/*
        The cursor ring — a motion.div positioned at the spring-smoothed coords.
        style={{ x, y }} is Framer Motion shorthand for transform: translateX/Y.
        This avoids layout recalculations (faster than changing left/top).
      */}
      <motion.div
        className="pointer-events-none fixed z-[9999] top-0 left-0"
        style={{ x: springX, y: springY }}
      >
        {/* Outer ring */}
        <div
          className="h-6 w-6 rounded-full border border-amber/60"
          style={{ boxShadow: '0 0 8px rgba(232,201,122,0.3)' }}
        />
        {/* Inner amber dot — offset to center inside the ring */}
        <div
          className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber"
        />
      </motion.div>
    </>
  )
}
