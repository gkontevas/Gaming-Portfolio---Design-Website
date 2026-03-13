'use client'

/*
  SoundManager.tsx
  ────────────────
  Two audio systems:

  1. Ambient loop — Web Audio API with crossfade looping.
     Fetches the WAV, decodes it into an AudioBuffer, then plays it in a
     loop where the end of one play overlaps with the start of the next,
     both fading through each other. The loop seam becomes inaudible.

  2. Nav hush — short bandpass noise burst on nav clicks.

  Why switch ambient from new Audio() to Web Audio?
  HTML Audio's built-in loop has no crossfade — it hard-cuts from end to start.
  Web Audio lets us schedule two overlapping BufferSourceNodes with precise timing,
  fading one out as the other fades in. That's the only way to hide a bad loop point.

  Node graph:
  BufferSource → fadeGain → ambientGain ─┐
                                          ├→ masterGain → destination
  noiseSource → filters → hushGain ──────┘
*/

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window { __playChime?: () => void }
}

const AUDIO_SRC  = '/ambient.mp3'
const CROSSFADE  = 2.5   // seconds of overlap between loop end and next loop start
const AMBIENT_VOL = 0.15 // ambient volume relative to master

export default function SoundManager() {
  const [muted, setMuted] = useState(false)
  const gainRef           = useRef<GainNode | null>(null)  // master — controls everything
  const ctxRef            = useRef<AudioContext | null>(null)
  const mutedRef          = useRef(false)

  useEffect(() => {
    const savedMuted = localStorage.getItem('muted') === 'true'
    setMuted(savedMuted)
    mutedRef.current = savedMuted

    // Fetch the file immediately — no gesture needed for network requests.
    // We store the Promise so it's already resolving by the time we need to decode.
    const bufferPromise = fetch(AUDIO_SRC).then(r => r.arrayBuffer())

    // Create the AudioContext early — it starts in 'suspended' state on most
    // browsers until a user gesture, which is fine. We resume it on first interaction.
    const ctx = new AudioContext()
    ctxRef.current = ctx

    // ── GAIN HIERARCHY ────────────────────────────────────
    // masterGain: value 0/1 — the mute toggle. Controls ALL sound.
    // ambientGain: value 0.15 — sets ambient volume independently from chimes.
    // fadeGain (per source): 0→1→0 — the crossfade envelope for each loop instance.
    const masterGain = ctx.createGain()
    masterGain.gain.value = savedMuted ? 0 : 1
    masterGain.connect(ctx.destination)
    gainRef.current = masterGain

    const ambientGain = ctx.createGain()
    ambientGain.gain.value = AMBIENT_VOL
    ambientGain.connect(masterGain)

    // ── CROSSFADE LOOP ────────────────────────────────────
    let stopped = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    async function startAmbient() {
      try {
        const arrayBuffer = await bufferPromise
        // decodeAudioData: converts raw file bytes → AudioBuffer (decoded PCM samples).
        // AudioBuffer is reusable — we create new BufferSourceNodes from it each loop.
        // BufferSourceNode is one-shot: once stopped it can't restart, so we make a
        // fresh one each iteration.
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
        if (stopped) return

        function scheduleLoop(startAt: number) {
          if (stopped) return

          const source   = ctx.createBufferSource()
          source.buffer  = audioBuffer

          // Per-instance fade gain — handles the crossfade envelope for THIS instance
          const fadeGain = ctx.createGain()

          // Fade IN: silence → full over CROSSFADE seconds from startAt
          fadeGain.gain.setValueAtTime(0, startAt)
          fadeGain.gain.linearRampToValueAtTime(1, startAt + CROSSFADE)

          // Fade OUT: starts CROSSFADE seconds before the track ends
          const fadeOutAt = startAt + audioBuffer.duration - CROSSFADE
          fadeGain.gain.setValueAtTime(1, fadeOutAt)
          fadeGain.gain.linearRampToValueAtTime(0, fadeOutAt + CROSSFADE)

          source.connect(fadeGain)
          fadeGain.connect(ambientGain)

          source.start(startAt)
          source.stop(startAt + audioBuffer.duration)

          // Schedule the NEXT loop to start exactly when this one begins fading out.
          // The two instances will overlap for CROSSFADE seconds — inaudible seam.
          // We use setTimeout to trigger the scheduling, but startAt uses ctx.currentTime
          // (the Web Audio clock) for sample-accurate scheduling.
          const msUntilNext = (fadeOutAt - ctx.currentTime) * 1000
          const id = setTimeout(() => {
            scheduleLoop(ctx.currentTime)
          }, Math.max(0, msUntilNext))
          timeouts.push(id)
        }

        scheduleLoop(ctx.currentTime)
      } catch (e) {
        console.warn('SoundManager: failed to load or decode audio', e)
      }
    }

    // ── NAV HUSH ─────────────────────────────────────────
    window.__playChime = () => {
      if (!ctx || ctx.state === 'suspended' || mutedRef.current) return

      const t       = ctx.currentTime
      const bufSize = Math.floor(ctx.sampleRate * 0.35)
      const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const data    = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

      const src = ctx.createBufferSource()
      src.buffer = buf

      // Highpass + lowpass in series = wide bandpass (1800–7000Hz) = "shh" range
      const hipass = ctx.createBiquadFilter()
      hipass.type = 'highpass'; hipass.frequency.value = 1800

      const lopass = ctx.createBiquadFilter()
      lopass.type = 'lowpass'; lopass.frequency.value = 7000

      const hushGain = ctx.createGain()
      hushGain.gain.setValueAtTime(0, t)
      hushGain.gain.linearRampToValueAtTime(0.12, t + 0.02)
      hushGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)

      src.connect(hipass)
      hipass.connect(lopass)
      lopass.connect(hushGain)
      hushGain.connect(masterGain)
      src.start(t)
    }

    // ── START AFTER FIRST GESTURE ─────────────────────────
    // AudioContext starts suspended — resume + start ambient on first interaction.
    // The intro screen's dismiss keypress/click triggers this.
    function resumeAndStart() {
      ctx.resume().then(() => startAmbient())
      document.removeEventListener('click',   resumeAndStart)
      document.removeEventListener('keydown', resumeAndStart)
    }

    if (ctx.state === 'suspended') {
      document.addEventListener('click',   resumeAndStart)
      document.addEventListener('keydown', resumeAndStart)
    } else {
      startAmbient()
    }

    return () => {
      stopped = true
      timeouts.forEach(clearTimeout)
      document.removeEventListener('click',   resumeAndStart)
      document.removeEventListener('keydown', resumeAndStart)
      ctx.close()
    }
  }, [])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    mutedRef.current = next
    localStorage.setItem('muted', String(next))
    // masterGain controls all Web Audio — ambient + hush both go silent
    if (gainRef.current) gainRef.current.gain.value = next ? 0 : 1
  }

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 left-6 z-[200] flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-cinder/80 backdrop-blur-sm transition-colors duration-300 hover:border-gold/40"
      title={muted ? 'Unmute' : 'Mute'}
    >
      <span
        className="font-display text-xs"
        style={{ color: muted ? '#7A6545' : '#C9A96E' }}
      >
        {muted ? '✕' : '♪'}
      </span>
    </button>
  )
}
