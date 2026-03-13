'use client'

import { motion } from 'framer-motion'

/*
  DescendButton — the animated "Descend" indicator at the bottom of the hero.

  Why a separate file?
  page.tsx is a Server Component and cannot have onClick handlers.
  Any element that needs interactivity must live in its own 'use client' file.
  This component is tiny but it IS a client boundary — that's intentional.
*/
export default function DescendButton() {
  return (
    <motion.button
      onClick={() => window.__lenis?.scrollTo('#origins')}
      className="absolute bottom-10 flex flex-col items-center gap-3 hidden sm:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.9 }}
    >
      <p className="font-display text-xs tracking-[0.5em] text-bronze uppercase">
        Descend
      </p>
    </motion.button>
  )
}
