'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'
import RevealText from './RevealText'
import { getMessages, getMessageCount, addMessage, reactToMessage } from '@/app/actions/messages'
import type { BonfireMessage, Reaction } from '@/lib/supabase'

const PAGE_SIZE = 12

const PREFIXES = [
  'Praise the', 'Try', 'Beware of', 'Seek', 'Visions of',
  "Don't give up,", 'Be wary of', 'Imminent', 'Likely', 'Time for',
]

const SUFFIXES = [
  'bonfire', 'ember', 'ash', 'grace', 'the flame', 'darkness',
  'hollow', 'undead', 'ambush ahead', 'fog wall', 'light ahead',
  'treasure', 'despair', 'the abyss', 'victory', 'Tarnished',
]

const REACTIONS: { key: Reaction; icon: string; active: string }[] = [
  { key: 'praise',    icon: '▲', active: 'border-amber/50 text-amber'           },
  { key: 'brilliant', icon: '✦', active: 'border-gold/50 text-gold'             },
  { key: 'beware',    icon: '⚠', active: 'border-ember/60 text-ember'           },
]

const RATE_LIMIT_KEY = 'bonfire_last_message'
const USERNAME_KEY   = 'bonfire_username'
const REACTED_KEY    = 'bonfire_reacted'
const RATE_LIMIT_MS  = 60 * 60 * 1000

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

type Props = {
  initialMessages?: BonfireMessage[]
  initialCount?: number
}

export default function BonfireMessages({ initialMessages = [], initialCount }: Props) {
  const [messages,    setMessages]    = useState<BonfireMessage[]>(initialMessages)
  const [sort,        setSort]        = useState<'recent' | 'top'>('recent')
  const [count,       setCount]       = useState<number | null>(initialCount ?? null)
  const [hasMore,     setHasMore]     = useState(initialMessages.length === PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const [prefix,      setPrefix]      = useState(PREFIXES[0])
  const [suffix,      setSuffix]      = useState(SUFFIXES[0])
  const [username,    setUsername]    = useState('')
  const [reacted,     setReacted]     = useState<Record<string, Set<Reaction>>>({})
  const [submitting,  setSubmitting]  = useState(false)
  const [newId,       setNewId]       = useState<string | null>(null)
  const [cooldown,    setCooldown]    = useState(false)
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const isFirstMount = useRef(true)

  const loadFirst = useCallback(async (currentSort: 'recent' | 'top') => {
    const data = await getMessages(currentSort, 0)
    setMessages(data)
    setHasMore(data.length === PAGE_SIZE)
  }, [])

  useEffect(() => {
    // Skip the immediate fetch on first mount if we have server-pre-fetched data.
    // Sort change (non-initial) always re-fetches immediately.
    if (isFirstMount.current && initialMessages.length > 0) {
      isFirstMount.current = false
    } else {
      isFirstMount.current = false
      loadFirst(sort)
    }
    intervalRef.current = setInterval(() => loadFirst(sort), 8000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [sort, loadFirst]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialCount == null) getMessageCount().then(setCount)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const last = localStorage.getItem(RATE_LIMIT_KEY)
    if (last && Date.now() - Number(last) < RATE_LIMIT_MS) setCooldown(true)

    const saved = localStorage.getItem(USERNAME_KEY)
    if (saved) setUsername(saved)

    try {
      const raw = JSON.parse(localStorage.getItem(REACTED_KEY) || '{}')
      const initial: Record<string, Set<Reaction>> = {}
      for (const [id, arr] of Object.entries(raw)) {
        initial[id] = new Set(arr as Reaction[])
      }
      setReacted(initial)
    } catch { /* corrupted storage — start fresh */ }
  }, [])

  async function handleSubmit() {
    if (submitting || cooldown) return
    const text = `${prefix} ${suffix}`
    setSubmitting(true)
    if (username.trim()) localStorage.setItem(USERNAME_KEY, username.trim())
    const result = await addMessage(text, username)
    if (!result.error) {
      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()))
      setCooldown(true)
      const fresh = await getMessages(sort, 0)
      setMessages(fresh)
      setHasMore(fresh.length === PAGE_SIZE)
      const found = fresh.find(m => m.text === text)
      if (found) { setNewId(found.id); setTimeout(() => setNewId(null), 3500) }
      getMessageCount().then(setCount)
    }
    setSubmitting(false)
  }

  async function handleLoadMore() {
    setLoadingMore(true)
    const more = await getMessages(sort, messages.length)
    setMessages(prev => [...prev, ...more])
    setHasMore(more.length === PAGE_SIZE)
    setLoadingMore(false)
  }

  async function handleReact(msg: BonfireMessage, reaction: Reaction) {
    if (reacted[msg.id]?.has(reaction)) return

    setReacted(prev => {
      const next = { ...prev, [msg.id]: new Set([...(prev[msg.id] ?? []), reaction]) }
      const toSave: Record<string, string[]> = {}
      for (const [id, set] of Object.entries(next)) toSave[id] = [...set]
      localStorage.setItem(REACTED_KEY, JSON.stringify(toSave))
      return next
    })

    setMessages(prev =>
      prev.map(m => m.id === msg.id ? { ...m, [reaction]: m[reaction] + 1 } : m)
    )

    await reactToMessage(msg.id, reaction, msg[reaction])
  }

  return (
    <section
      id="bonfire"
      className="relative scroll-mt-20 overflow-hidden px-6 sm:px-8 py-36"
      style={{ background: 'radial-gradient(ellipse at 50% 100%, #200E03 0%, #0D0A07 60%)' }}
    >
      {/* Grain */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true"
        style={{ opacity: 0.028, mixBlendMode: 'screen' }}>
        <filter id="bonfire-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bonfire-grain)" />
      </svg>

      {/* Ember glow pools */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-80"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,90,20,0.18) 0%, transparent 68%)' }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[35%] h-48"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,140,30,0.10) 0%, transparent 70%)' }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ash/60 to-transparent" />

      {/* Floating embers — CSS only, zero JS */}
      <style>{`
        @keyframes ember-rise {
          0%   { transform: translateY(0) translateX(0);   opacity: 0; }
          12%  { opacity: 0.9; }
          80%  { opacity: 0.25; }
          100% { transform: translateY(-160px) translateX(var(--dx)); opacity: 0; }
        }
        .bonfire-ember {
          position: absolute; bottom: 8%; pointer-events: none;
          width: 2px; height: 2px; border-radius: 50%;
          background: rgb(220,110,30);
          animation: ember-rise var(--dur) var(--delay) ease-in infinite;
        }
      `}</style>
      {[
        { left: '44%', '--dur': '3.1s', '--delay': '0s',    '--dx': '-8px'  },
        { left: '48%', '--dur': '2.7s', '--delay': '0.8s',  '--dx': '6px'   },
        { left: '52%', '--dur': '3.6s', '--delay': '0.3s',  '--dx': '-4px'  },
        { left: '46%', '--dur': '2.4s', '--delay': '1.4s',  '--dx': '10px'  },
        { left: '50%', '--dur': '4.0s', '--delay': '0.6s',  '--dx': '-12px' },
        { left: '54%', '--dur': '2.9s', '--delay': '1.9s',  '--dx': '5px'   },
        { left: '42%', '--dur': '3.3s', '--delay': '2.2s',  '--dx': '9px'   },
        { left: '56%', '--dur': '2.6s', '--delay': '0.1s',  '--dx': '-7px'  },
      ].map((style, i) => (
        <div key={i} className="bonfire-ember" style={style as React.CSSProperties} />
      ))}

      <div className="relative mx-auto max-w-2xl">

        {/* ── HEADER ── */}
        <FadeIn className="mb-20 flex flex-col items-center text-center">

          {/* Flame icon */}
          <motion.div
            className="mb-8 relative"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <svg width="32" height="44" viewBox="0 0 32 44" fill="none" className="mx-auto">
              <motion.path
                d="M16 42 C8 38 4 30 6 22 C8 16 12 14 14 10 C15 14 13 18 15 20 C16 16 18 12 20 8 C22 16 20 22 22 26 C24 22 24 18 22 14 C26 18 28 26 26 32 C24 38 20 42 16 42Z"
                fill="url(#flame-grad)"
                animate={{ scaleY: [1, 1.04, 0.97, 1.02, 1], scaleX: [1, 0.97, 1.02, 0.98, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '16px 42px' }}
              />
              <motion.path
                d="M16 38 C12 35 11 30 12 26 C13 23 14 21 15 19 C16 22 14 25 16 27 C17 24 18 21 20 18 C21 23 20 28 22 30 C20 35 18 38 16 38Z"
                fill="rgba(255,200,80,0.55)"
                animate={{ scaleY: [1, 1.06, 0.96, 1.03, 1] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                style={{ transformOrigin: '16px 38px' }}
              />
              <defs>
                <linearGradient id="flame-grad" x1="16" y1="42" x2="16" y2="8" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#C9780A" />
                  <stop offset="55%"  stopColor="#E8A020" />
                  <stop offset="100%" stopColor="#F5D060" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-6 blur-lg"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,120,40,0.5) 0%, transparent 70%)' }} />
          </motion.div>

          <p className="mb-3 font-display text-[10px] tracking-[0.55em] text-bronze/70 uppercase">
            Visitor Inscriptions
          </p>
          <RevealText delay={0.1} className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
            Bonfire Messages
          </RevealText>
          <div className="my-6 h-px w-10 bg-gold/30" />
          <p className="max-w-xs font-body text-sm leading-relaxed text-bronze/65">
            Leave a message for the next Tarnished who passes through.
          </p>
          {count !== null && (
            <motion.p
              className="mt-5 font-display text-[9px] tracking-[0.4em] text-amber/50 uppercase"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            >
              {count} inscription{count !== 1 ? 's' : ''} across the realm
            </motion.p>
          )}
        </FadeIn>

        {/* ── COMPOSER (Inscription Altar) ── */}
        <FadeIn delay={0.2} className="mb-16">
          <div className="relative"
            style={{ background: 'linear-gradient(180deg, rgba(30,16,4,0.9) 0%, rgba(13,10,7,0.95) 100%)' }}>

            {/* Altar border */}
            <div className="absolute inset-0 border border-gold/20 pointer-events-none" />
            <div className="absolute inset-[3px] border border-gold/[0.07] pointer-events-none" />
            <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-amber/40" />
            <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber/40" />
            <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-amber/40" />
            <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-amber/40" />

            {/* Top altar label */}
            <div className="flex items-center gap-3 px-8 pt-6 pb-0">
              <div className="flex-1 h-px bg-gold/10" />
              <p className="font-display text-[9px] tracking-[0.55em] text-amber/50 uppercase">Inscription Altar</p>
              <div className="flex-1 h-px bg-gold/10" />
            </div>

            <div className="px-6 sm:px-10 pt-6 pb-8">

              {/* Name input */}
              <div className="flex justify-center mb-7">
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.slice(0, 24))}
                    placeholder="Your name (optional)"
                    className="w-60 bg-transparent border-b border-gold/25 px-2 py-2 font-display text-xs tracking-widest text-gold placeholder:text-bronze/35 focus:outline-none focus:border-amber/50 transition-colors duration-300 text-center"
                  />
                  {username && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-[8px] tracking-[0.4em] text-amber/60 uppercase bg-[#130D04] px-2">
                      Tarnished
                    </span>
                  )}
                </div>
              </div>

              {/* Selectors */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <select value={prefix} onChange={e => setPrefix(e.target.value)}
                  className="font-display text-xs tracking-widest text-gold bg-black/30 border border-gold/25 px-4 py-2.5 focus:outline-none focus:border-amber/50 cursor-pointer transition-colors duration-200 appearance-none">
                  {PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <span className="font-display text-amber/30 text-base select-none">·</span>
                <select value={suffix} onChange={e => setSuffix(e.target.value)}
                  className="font-display text-xs tracking-widest text-gold bg-black/30 border border-gold/25 px-4 py-2.5 focus:outline-none focus:border-amber/50 cursor-pointer transition-colors duration-200 appearance-none">
                  {SUFFIXES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Preview — large, centred inscription */}
              <div className="relative mb-8 py-6 text-center">
                <div className="absolute inset-x-0 top-0 h-px"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.15), transparent)' }} />
                <div className="absolute inset-x-0 bottom-0 h-px"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.15), transparent)' }} />
                <p className="font-body text-xl sm:text-2xl italic leading-snug text-bronze/85">
                  &ldquo;{prefix} {suffix}&rdquo;
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || cooldown}
                className={`relative w-full py-4 font-display text-[10px] tracking-[0.55em] uppercase transition-all duration-400 overflow-hidden group ${
                  cooldown
                    ? 'border border-gold/10 text-bronze/25 cursor-not-allowed bg-transparent'
                    : 'border border-amber/30 text-amber hover:border-amber/60 bg-amber/[0.03] hover:bg-amber/[0.07] active:scale-[0.99]'
                }`}
              >
                {!cooldown && (
                  <span className="absolute inset-x-0 bottom-0 h-px transition-all duration-300 group-hover:opacity-100 opacity-0"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(201,120,40,0.5), transparent)' }} />
                )}
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>✦</motion.span>
                    Inscribing into the realm…
                  </span>
                ) : cooldown ? (
                  'Mark Already Left'
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span>⚔</span> Leave Your Mark
                  </span>
                )}
              </button>
              {cooldown && (
                <p className="mt-3 text-center font-display text-[9px] tracking-[0.4em] text-bronze/40 uppercase">
                  One inscription per visit, Tarnished.
                </p>
              )}

            </div>
          </div>
        </FadeIn>

        {/* ── FEED ── */}
        <FadeIn delay={0.3}>

          <div className="flex items-center justify-between mb-7">
            <p className="font-display text-[9px] tracking-[0.5em] text-bronze/50 uppercase">
              Found Inscriptions
            </p>
            <div className="flex items-center gap-1">
              {(['recent', 'top'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`font-display text-[8px] tracking-[0.35em] uppercase px-3 py-1.5 border transition-all duration-200 ${
                    sort === s
                      ? 'border-amber/35 text-amber bg-amber/[0.05]'
                      : 'border-gold/15 text-bronze/35 hover:border-gold/30 hover:text-bronze/55'
                  }`}
                >
                  {s === 'recent' ? 'Recent' : 'Top Rated'}
                </button>
              ))}
            </div>
          </div>

          {/* Single-column inscription list */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => {
                const isNew      = msg.id === newId
                const msgReacted = reacted[msg.id] ?? new Set<Reaction>()

                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: 1, y: 0,
                      boxShadow: isNew
                        ? '0 0 40px rgba(201,120,40,0.20), inset 0 0 20px rgba(201,120,40,0.04)'
                        : 'none',
                    }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease }}
                    className={`group relative border-y transition-colors duration-500 ${
                      isNew ? 'border-amber/25' : 'border-gold/[0.08] hover:border-gold/15'
                    }`}
                    style={{
                      background: isNew
                        ? 'linear-gradient(to right, rgba(30,16,4,0.7), rgba(20,12,3,0.5))'
                        : 'linear-gradient(to right, rgba(20,12,3,0.4), transparent)',
                    }}
                  >
                    <div className="flex items-start gap-5 px-5 py-5">

                      {/* Glyph */}
                      <span className={`mt-0.5 shrink-0 font-display text-base leading-none transition-colors duration-500 ${
                        isNew ? 'text-amber/80' : 'text-gold/25 group-hover:text-gold/45'
                      }`}>✦</span>

                      <div className="flex-1 min-w-0">
                        {/* Message text */}
                        <p className={`font-body italic leading-relaxed mb-3 transition-colors duration-300 ${
                          isNew ? 'text-gold/95 text-base' : 'text-bronze/90 text-sm sm:text-base group-hover:text-bronze/100'
                        }`}>
                          &ldquo;{msg.text}&rdquo;
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-[9px] tracking-[0.35em] text-gold/70 uppercase">
                              {msg.username}
                            </span>
                            <span className="text-bronze/40 text-[9px]">·</span>
                            <span className="font-display text-[9px] tracking-[0.3em] text-bronze/55 uppercase">
                              {timeAgo(msg.created_at)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {REACTIONS.map(({ key, icon, active }) => (
                              <button
                                key={key}
                                onClick={() => handleReact(msg, key)}
                                disabled={msgReacted.has(key)}
                                title={key}
                                className={`flex items-center gap-1 px-2 py-1 border transition-all duration-200 active:scale-90 ${
                                  msgReacted.has(key)
                                    ? active
                                    : 'border-gold/15 text-bronze/35 hover:border-gold/35 hover:text-bronze/65'
                                }`}
                              >
                                <span style={{ fontSize: '9px', lineHeight: 1 }}>{icon}</span>
                                <span className="font-display" style={{ fontSize: '9px', letterSpacing: '0.04em' }}>
                                  {msg[key]}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {messages.length === 0 && (
            <div className="py-20 text-center">
              <div className="mb-4 font-display text-gold/15 text-3xl">✦</div>
              <p className="font-display text-[10px] tracking-[0.5em] text-bronze/40 uppercase">
                No inscriptions yet
              </p>
              <p className="mt-2 font-body text-sm italic text-bronze/30">
                Be the first to leave your mark upon this place.
              </p>
            </div>
          )}

          {hasMore && messages.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="group font-display text-[9px] tracking-[0.45em] uppercase px-8 py-3 border border-gold/15 text-bronze/40 hover:border-gold/30 hover:text-bronze/70 transition-all duration-300 disabled:opacity-30"
              >
                {loadingMore ? 'Reading…' : 'Read more inscriptions'}
              </button>
            </div>
          )}

        </FadeIn>

        {/* Footer brand */}
        <FadeIn delay={0.4} className="mt-20 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.12))' }} />
            <span className="font-display text-[8px] tracking-[0.6em] text-amber/30 uppercase">Bonfire Lit</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.12))' }} />
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
