'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface LoreTerm {
  subtitle: string
  description: string
}

const terms: Record<string, LoreTerm> = {
  'Remembrances': {
    subtitle: 'Achievement · Plural',
    description: 'Objects imbued with the power of a vanquished world. Proof that something vast was fully witnessed and conquered.',
  },
  'Tarnished': {
    subtitle: 'Class · Exile',
    description: 'One who has lost the grace of gold. Called back from beyond the Fog to face what was left behind.',
  },
  'Hollow': {
    subtitle: 'Condition · Terminal',
    description: 'An Undead who has surrendered their sense of self. Not death — something quieter, and harder to return from.',
  },
  'mastered': {
    subtitle: 'Verb · Past tense',
    description: 'To have learned something so thoroughly that failure becomes impossible. The highest form of completion.',
  },
  'Soulslike': {
    subtitle: 'Genre · Philosophy',
    description: 'A philosophy more than a genre. Deliberate combat, environmental narrative, and the belief that difficulty is a form of respect.',
  },
  'Completionist': {
    subtitle: 'Title · Earned',
    description: 'One who leaves nothing behind. Every achievement earned. Every secret found. Every world fully witnessed.',
  },
}

type Props = {
  word: keyof typeof terms
  children: React.ReactNode
  className?: string
}

export default function LoreWord({ word, children, className = '' }: Props) {
  const [visible, setVisible] = useState(false)
  const term = terms[word]
  if (!term) return <>{children}</>

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {/* The word itself — subtle amber underline signals interactivity */}
      <span
        className="text-amber font-semibold transition-all duration-200 hover:text-amber"
        style={{
          cursor: 'help',
          textShadow: '0 0 12px rgba(232,201,122,0.45)',
        }}
      >
        {children}
      </span>

      <AnimatePresence>
        {visible && (
          <motion.span
            className="absolute bottom-full left-1/2 z-[9000] mb-3 w-56 border border-gold/30 bg-ash pointer-events-none"
            style={{
              display: 'block',
              x: '-50%',
              boxShadow: '0 0 40px rgba(0,0,0,0.9), 0 0 20px rgba(201,169,110,0.05) inset',
            }}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1   }}
            exit={{    opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block px-4 py-3">
              <span className="block font-display text-[9px] tracking-[0.45em] text-bronze/60 uppercase mb-1">
                {term.subtitle}
              </span>
              <span className="block font-body text-xs leading-relaxed text-bronze/85 italic">
                {term.description}
              </span>
            </span>
            <span
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid rgba(201,169,110,0.3)',
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
