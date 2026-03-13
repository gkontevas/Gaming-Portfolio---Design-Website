'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileWarning() {
  const [dismissed, setDismissed] = useState(false)

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[9996] sm:hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="m-3 rounded-sm border border-gold/20 bg-cinder/95 backdrop-blur-sm px-5 py-4">
            <p className="font-display text-[10px] tracking-[0.4em] text-bronze/60 uppercase mb-1">
              Notice
            </p>
            <p className="font-body text-sm text-gold leading-relaxed">
              For the full experience, a desktop is recommended.
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="mt-3 font-display text-[10px] tracking-[0.3em] text-gold/70 uppercase hover:text-gold transition-colors duration-200"
            >
              Understood
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
