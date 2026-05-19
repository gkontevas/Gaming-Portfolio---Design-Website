'use client'

/*
  CustomCursor.tsx
  ────────────────
  Two layers:
  1. <canvas>     → falling ember particles  (pure canvas, zero React re-renders)
  2. <motion.div> → cursor ring              (Framer Motion spring)

  Cursor states:
  - default : small ember dot
  - pointer : dot + expanding ring (hovering links / buttons)
  - text    : vertical I-beam bar  (hovering inputs / textareas)
  - pressing: everything scales down on mousedown
*/

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'

interface Ember {
  x: number; y: number
  vx: number; vy: number
  life: number; decay: number; size: number
  r: number; g: number; b: number
}

const MAX_EMBERS = 180
const GRAVITY    = 0.055
const AIR_RESIST = 0.985
const GLOW_BLUR  = 7

type CursorState = 'default' | 'pointer' | 'text'

function detectState(el: Element): CursorState {
  if (el.closest('input, textarea')) return 'text'
  if (el.closest('a, button, [role="button"], label, select, [tabindex]')) return 'pointer'
  return 'default'
}

export default function CustomCursor() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const embersRef    = useRef<Ember[]>([])
  const rafRef       = useRef<number>(0)
  const lastSpawnRef = useRef({ x: -999, y: -999 })

  const [isHoverDevice, setIsHoverDevice] = useState(false)
  const [cursorState, setCursorState]     = useState<CursorState>('default')
  const [pressing, setPressing]           = useState(false)

  // cursor position — direct tracking, no spring (spring velocity causes visible overshoot fling)
  const cursorX = useMotionValue(-999)
  const cursorY = useMotionValue(-999)

  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) setIsHoverDevice(true)
  }, [])

  // ── Canvas / ember effect ─────────────────────────────────
  useEffect(() => {
    if (!isHoverDevice) return

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function spawnEmbers(x: number, y: number, speed: number) {
      if (embersRef.current.length >= MAX_EMBERS) return
      const count = speed < 4 ? 1 : speed < 12 ? 2 : 3
      for (let i = 0; i < count; i++) {
        const roll = Math.random()
        let r: number, g: number, b: number
        if (roll > 0.65)      { r = 225 + Math.random() * 15; g = 165 + Math.random() * 30; b = 60  + Math.random() * 40 }
        else if (roll > 0.3)  { r = 220 + Math.random() * 20; g = 80  + Math.random() * 60; b = 10  + Math.random() * 20 }
        else                  { r = 160 + Math.random() * 50; g = 30  + Math.random() * 40; b = 10 }

        embersRef.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 2.2,
          vy: Math.random() * 0.8,
          life: 1,
          decay: 0.016 + Math.random() * 0.014,
          size: Math.random() * 2.2 + 0.9,
          r, g, b,
        })
      }
    }

    function onMouseMove(e: MouseEvent) {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMouseMove)

    function draw() {
      const sx   = cursorX.get()
      const sy   = cursorY.get()
      const last = lastSpawnRef.current
      if (sx > -100) {
        const moved = last.x === -999 ? 0 : Math.hypot(sx - last.x, sy - last.y)
        if (moved > 1.5) spawnEmbers(sx, sy, moved)
        lastSpawnRef.current = { x: sx, y: sy }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.shadowBlur = GLOW_BLUR

      for (let i = embersRef.current.length - 1; i >= 0; i--) {
        const e = embersRef.current[i]
        e.vy += GRAVITY; e.vx *= AIR_RESIST; e.x += e.vx; e.y += e.vy; e.life -= e.decay
        if (e.life <= 0) { embersRef.current.splice(i, 1); continue }
        const alpha  = e.life * e.life
        const radius = e.size * e.life
        ctx.shadowColor = `rgba(${e.r},${e.g},${e.b},${(alpha * 0.7).toFixed(2)})`
        ctx.fillStyle   = `rgba(${e.r},${e.g},${e.b},${alpha.toFixed(2)})`
        ctx.beginPath()
        ctx.arc(e.x, e.y, Math.max(0.1, radius), 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    function onVisibilityChange() {
      if (document.hidden) cancelAnimationFrame(rafRef.current)
      else rafRef.current = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isHoverDevice]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cursor state detection ────────────────────────────────
  useEffect(() => {
    if (!isHoverDevice) return

    function onPointerOver(e: PointerEvent) {
      setCursorState(detectState(e.target as Element))
    }
    function onMouseDown() { setPressing(true)  }
    function onMouseUp()   { setPressing(false) }

    window.addEventListener('pointerover', onPointerOver)
    window.addEventListener('mousedown',   onMouseDown)
    window.addEventListener('mouseup',     onMouseUp)
    return () => {
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('mousedown',   onMouseDown)
      window.removeEventListener('mouseup',     onMouseUp)
    }
  }, [isHoverDevice])

  if (!isHoverDevice) return null

  const isPointer = cursorState === 'pointer'
  const isText    = cursorState === 'text'

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[9990]" />

      {/* Cursor — outer motion.div tracks mouse directly, inner handles press scale */}
      <motion.div
        className="pointer-events-none fixed z-[9999] top-0 left-0"
        style={{ x: cursorX, y: cursorY }}
      >
      <motion.div
        animate={{ scale: pressing ? 0.7 : 1 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      >
        {/* Outer ring — pointer state only */}
        <AnimatePresence>
          {isPointer && (
            <motion.div
              className="absolute rounded-full border pointer-events-none"
              style={{
                width: 32, height: 32,
                top: -16, left: -16,
                borderColor: 'rgba(232,201,122,0.5)',
                boxShadow: '0 0 8px rgba(220,140,20,0.25)',
              }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{    scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </AnimatePresence>

        {/* I-beam — text state */}
        <AnimatePresence>
          {isText && (
            <motion.div
              className="absolute pointer-events-none"
              style={{ width: 2, height: 18, top: -9, left: -1, background: 'rgba(201,169,110,0.8)', borderRadius: 1 }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{    scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Soft outer glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 16, height: 16, top: -8, left: -8,
            background: 'radial-gradient(circle, rgba(220,120,20,0.35) 0%, transparent 70%)',
          }}
          animate={{ opacity: isText ? 0 : 1, scale: isPointer ? 1.4 : 1 }}
          transition={{ duration: 0.15 }}
        />
        {/* Bright core */}
        <motion.div
          className="absolute rounded-full bg-amber pointer-events-none"
          style={{
            width: 6, height: 6, top: -3, left: -3,
            boxShadow: '0 0 6px 2px rgba(232,180,50,0.9), 0 0 14px 4px rgba(200,80,10,0.5)',
          }}
          animate={{ opacity: isText ? 0 : 1, scale: isPointer ? 1.4 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
      </motion.div>
    </>
  )
}
