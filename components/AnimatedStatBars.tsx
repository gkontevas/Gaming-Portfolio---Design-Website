'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Stat = {
  name: string
  value: number
  color: string
}

export default function AnimatedStatBars({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="flex flex-col justify-center gap-6">
      {stats.map((stat, i) => (
        <div key={stat.name}>
          <div className="mb-2 flex justify-between font-display text-xs tracking-widest">
            <span className="text-bronze uppercase">{stat.name}</span>
            <span className="text-gold">{stat.value}</span>
          </div>
          <div className="h-px w-full bg-gold/20">
            <motion.div
              className={`h-px ${stat.color}`}
              initial={{ width: '0%' }}
              animate={inView ? { width: `${(stat.value / 99) * 100}%` } : {}}
              transition={{
                duration: 1.6,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.12,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
