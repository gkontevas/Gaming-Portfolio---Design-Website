'use client'

/*
  Parallax.tsx
  ────────────
  A scroll-based depth wrapper that works for ANY element on the page,
  not just elements near the top.

  WHY THE OLD VERSION WAS BROKEN:
  The old version used global scrollY with a fixed range [0, 800px].
  Elements below the fold (e.g. "Remembrances" at ~1200px scroll) had
  already passed that range before they entered view — so parallax was
  frozen at max offset and never animated.

  THE FIX — element-relative scroll:
  useScroll({ target: ref, offset: ['start end', 'end start'] })
  This tracks how far THIS SPECIFIC ELEMENT has traveled through the
  viewport, as a 0→1 progress value:
    0 = element's top just entered the bottom of the viewport
    1 = element's bottom just left the top of the viewport
  This works identically whether the element is at pixel 0 or pixel 5000.

  WHY NO useSpring:
  Lenis smooth scroll is already running on the page. It smooths all
  scroll input before Framer Motion even sees it. Adding useSpring on top
  = smoothing something already smooth = sluggish, over-damped motion.
  Direct useTransform (no spring) feels crisp and natural with Lenis.

  depth = 0.1 → subtle (used for text/content)
  depth = 0.3 → moderate (used for titles)
  depth = 0.5 → strong (used for background layers)

  The output range [depth*60, depth*-60] means:
  - Element starts slightly below its natural position (pushed down)
  - As it scrolls through, it rises to slightly above its natural position
  - Net movement = depth * 120px total
*/

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxProps {
  children: React.ReactNode
  depth?: number      // 0–1, how strongly this layer moves
  className?: string
}

export default function Parallax({ children, depth = 0.2, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Track scroll progress relative to THIS element's position in the viewport.
  // offset: when does tracking start and end?
  //   'start end' = start tracking when element's top hits viewport bottom
  //   'end start' = stop tracking when element's bottom hits viewport top
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Map 0→1 scroll progress to a pixel Y offset.
  // At progress=0 (entering viewport): element is nudged down by depth*60px
  // At progress=1 (leaving viewport):  element is nudged up by depth*60px
  // The motion is continuous and smooth throughout the scroll.
  const y = useTransform(scrollYProgress, [0, 1], [depth * 60, depth * -60])

  return (
    <motion.div ref={ref} style={{ y }} className={`relative ${className ?? ''}`}>
      {children}
    </motion.div>
  )
}
