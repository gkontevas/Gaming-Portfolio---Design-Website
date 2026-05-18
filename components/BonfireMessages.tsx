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
      className="relative scroll-mt-20 overflow-hidden px-8 py-36"
      style={{ background: 'radial-gradient(ellipse at 50% 100%, #1C0D04 0%, #0D0A07 55%)' }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true"
        style={{ opacity: 0.025, mixBlendMode: 'screen' }}>
        <filter id="bonfire-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bonfire-grain)" />
      </svg>
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-64"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,120,40,0.14) 0%, transparent 70%)' }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ash/40 to-transparent" />

      <div className="relative mx-auto max-w-2xl">

        {/* ── HEADER ── */}
        <FadeIn className="mb-20 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-gold/20" />
            <span className="font-display text-gold/20 text-xs">✦</span>
            <div className="h-px w-12 bg-gold/20" />
          </div>
          <p className="mb-3 font-display text-[10px] tracking-[0.55em] text-bronze/70 uppercase">
            Visitor Inscriptions
          </p>
          <RevealText delay={0.1} className="font-display text-2xl tracking-[0.2em] text-gold uppercase">
            Bonfire Messages
          </RevealText>
          <div className="my-6 h-px w-10 bg-gold/30" />
          <p className="max-w-xs font-body text-sm leading-relaxed text-bronze/60">
            Leave a message for the next Tarnished who passes through.
          </p>
          {count !== null && (
            <p className="mt-4 font-display text-[9px] tracking-[0.4em] text-bronze/40 uppercase">
              {count} inscription{count !== 1 ? 's' : ''} across the realm
            </p>
          )}
        </FadeIn>

        {/* ── COMPOSER ── */}
        <FadeIn delay={0.2} className="mb-14">
          <div className="relative border border-gold/15 bg-gradient-to-b from-cinder/80 to-ash/60 backdrop-blur-sm">
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/40" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/40" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/40" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/40" />

            <div className="p-8">
              <p className="mb-6 text-center font-display text-[9px] tracking-[0.55em] text-bronze/60 uppercase">
                Compose your inscription
              </p>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.slice(0, 24))}
                    placeholder="Your name (optional)"
                    className="w-56 bg-ash/80 border border-gold/20 px-4 py-2.5 font-display text-xs tracking-widest text-gold placeholder:text-bronze/45 focus:outline-none focus:border-gold/50 transition-colors duration-200 text-center"
                  />
                  {username && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-[8px] tracking-[0.4em] text-bronze/60 uppercase bg-cinder px-2">
                      Tarnished
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <select value={prefix} onChange={e => setPrefix(e.target.value)}
                  className="font-display text-xs tracking-widest text-gold bg-ash/80 border border-gold/20 px-4 py-2.5 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors duration-200 appearance-none">
                  {PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <span className="font-display text-gold/25 text-sm select-none">—</span>
                <select value={suffix} onChange={e => setSuffix(e.target.value)}
                  className="font-display text-xs tracking-widest text-gold bg-ash/80 border border-gold/20 px-4 py-2.5 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors duration-200 appearance-none">
                  {SUFFIXES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="mb-8 text-center">
                <div className="inline-block border-t border-b border-gold/10 py-4 px-6">
                  <p className="font-body text-lg italic text-bronze/70 leading-snug">
                    &ldquo;{prefix} {suffix}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-1 h-px bg-gold/10" />
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || cooldown}
                    className={`font-display text-[10px] tracking-[0.5em] uppercase px-7 py-3 border transition-all duration-300 ${
                      cooldown
                        ? 'border-gold/10 text-bronze/30 cursor-not-allowed'
                        : 'border-gold/35 text-gold hover:border-amber/60 hover:text-amber hover:bg-amber/[0.04] active:scale-95'
                    }`}
                  >
                    {submitting ? 'Inscribing…' : cooldown ? 'Already Inscribed' : '⚔ Inscribe'}
                  </button>
                  <div className="flex-1 h-px bg-gold/10" />
                </div>
                {cooldown && (
                  <p className="font-display text-[9px] tracking-[0.4em] text-bronze/50 uppercase">
                    One message per visit, Tarnished.
                  </p>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── FEED ── */}
        <FadeIn delay={0.3}>

          {/* Sort toggle + label */}
          <div className="flex items-center justify-between mb-5">
            <p className="font-display text-[9px] tracking-[0.5em] text-bronze/55 uppercase">
              Inscriptions
            </p>
            <div className="flex items-center gap-1">
              {(['recent', 'top'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`font-display text-[8px] tracking-[0.35em] uppercase px-2.5 py-1 border transition-all duration-200 ${
                    sort === s
                      ? 'border-gold/40 text-gold bg-gold/5'
                      : 'border-gold/15 text-bronze/40 hover:border-gold/25 hover:text-bronze/60'
                  }`}
                >
                  {s === 'recent' ? 'Recent' : 'Top'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => {
                const isNew      = msg.id === newId
                const msgReacted = reacted[msg.id] ?? new Set<Reaction>()

                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{
                      opacity: 1, scale: 1,
                      boxShadow: isNew
                        ? '0 0 32px rgba(201,120,40,0.22), inset 0 0 12px rgba(201,120,40,0.05)'
                        : 'none',
                    }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease }}
                    className={`group relative flex items-stretch border transition-colors duration-500 ${
                      isNew ? 'border-amber/30 bg-cinder/70' : 'border-gold/10 bg-cinder/30 hover:border-gold/20'
                    }`}
                  >
                    <div className={`w-[2px] shrink-0 transition-colors duration-500 ${
                      isNew ? 'bg-amber/60' : 'bg-gold/10 group-hover:bg-gold/20'
                    }`} />

                    <div className="flex flex-1 flex-col justify-between gap-3 px-4 py-3">
                      <p className="font-body italic text-xs leading-relaxed text-bronze/80">
                        &ldquo;{msg.text}&rdquo;
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-display text-[8px] tracking-[0.3em] text-gold/60 uppercase truncate">
                            {msg.username}
                          </span>
                          <span className="text-bronze/40 text-[8px] shrink-0">·</span>
                          <span className="font-display text-[8px] tracking-[0.3em] text-bronze/50 uppercase shrink-0">
                            {timeAgo(msg.created_at)}
                          </span>
                        </div>

                        {/* Reaction buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {REACTIONS.map(({ key, icon, active }) => (
                            <button
                              key={key}
                              onClick={() => handleReact(msg, key)}
                              disabled={msgReacted.has(key)}
                              title={key}
                              className={`flex items-center gap-0.5 px-1.5 py-0.5 border transition-all duration-200 active:scale-90 ${
                                msgReacted.has(key)
                                  ? active
                                  : 'border-gold/20 text-bronze/40 hover:border-gold/40 hover:text-bronze/70'
                              }`}
                            >
                              <span style={{ fontSize: '7px', lineHeight: 1 }}>{icon}</span>
                              <span className="font-display" style={{ fontSize: '8px', letterSpacing: '0.04em' }}>
                                {msg[key]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {messages.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-display text-[10px] tracking-[0.5em] text-bronze/50 uppercase">
                No inscriptions yet
              </p>
              <p className="mt-2 font-body text-xs italic text-bronze/40">
                Be the first to leave your mark.
              </p>
            </div>
          )}

          {/* Load more */}
          {hasMore && messages.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="font-display text-[9px] tracking-[0.45em] uppercase px-6 py-2.5 border border-gold/20 text-bronze/50 hover:border-gold/35 hover:text-gold transition-all duration-200 disabled:opacity-40"
              >
                {loadingMore ? 'Loading…' : 'Read more inscriptions'}
              </button>
            </div>
          )}

        </FadeIn>

        <FadeIn delay={0.4} className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-gold/10" />
          <span className="font-display text-[8px] tracking-[0.6em] text-bronze/40 uppercase">Bonfire Lit</span>
          <div className="flex-1 h-px bg-gold/10" />
        </FadeIn>

      </div>
    </section>
  )
}
