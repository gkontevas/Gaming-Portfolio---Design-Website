'use client'

import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
}: Props) {
  const offset = 60

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        scale: 0.97,
        filter: 'blur(6px)',
        y: direction === 'up' ? offset : 0,
        x: direction === 'left' ? -offset : direction === 'right' ? offset : 0,
      }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
