'use client'

import { motion } from 'framer-motion'
import GameCard from './GameCard'
import type { Game } from '@/types/game'

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export default function AnimatedCardGrid({ games }: { games: Game[] }) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {games.map((game) => (
        <motion.div
          key={game.id}
          variants={item}
          className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)]"
        >
          <GameCard game={game} />
        </motion.div>
      ))}
    </motion.div>
  )
}
