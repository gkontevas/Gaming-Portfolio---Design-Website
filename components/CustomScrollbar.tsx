'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

export default function CustomScrollbar() {
  const thumbRef        = useRef<HTMLDivElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const isDragging      = useRef(false)
  const dragStartY      = useRef(0)
  const dragStartScroll = useRef(0)
  const [locked, setLocked] = useState(false)

  // All the measurements we need, calculated fresh each time
  function getMetrics() {
    const docHeight   = document.documentElement.scrollHeight
    const viewHeight  = window.innerHeight
    const thumbHeight = Math.max((viewHeight / docHeight) * viewHeight, 40)
    const maxScroll   = docHeight - viewHeight
    const maxThumbTop = viewHeight - thumbHeight
    return { docHeight, viewHeight, thumbHeight, maxScroll, maxThumbTop }
  }

  // Move the thumb to match the current scroll position
  const updateThumb = useCallback(() => {
    const thumb = thumbRef.current
    if (!thumb) return
    const { thumbHeight, maxScroll, maxThumbTop } = getMetrics()
    const thumbTop = maxScroll > 0 ? (window.scrollY / maxScroll) * maxThumbTop : 0
    thumb.style.height    = `${thumbHeight}px`
    thumb.style.transform = `translateY(${thumbTop}px)`
  }, [])

  // Keep thumb in sync with scroll + resize
  useEffect(() => {
    updateThumb()
    window.addEventListener('scroll', updateThumb, { passive: true })
    window.addEventListener('resize', updateThumb, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateThumb)
      window.removeEventListener('resize', updateThumb)
    }
  }, [updateThumb])

  // Hide when a modal locks scroll
  useEffect(() => {
    function onLock(e: Event) { setLocked((e as CustomEvent<boolean>).detail) }
    window.addEventListener('scrolllock', onLock)
    return () => window.removeEventListener('scrolllock', onLock)
  }, [])

  // When the user presses down on the thumb, record the starting positions
  function onThumbMouseDown(e: React.MouseEvent) {
    if (window.__lenisLocked) return
    e.preventDefault()
    isDragging.current      = true
    dragStartY.current      = e.clientY
    dragStartScroll.current = window.scrollY
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none'
  }

  // mousemove and mouseup must be on the document, not the thumb —
  // so dragging still works even if the mouse leaves the thumb
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || window.__lenisLocked) return
      const { maxScroll, maxThumbTop } = getMetrics()
      const deltaY      = e.clientY - dragStartY.current
      const scrollDelta = (deltaY / maxThumbTop) * maxScroll
      const target      = Math.max(0, Math.min(dragStartScroll.current + scrollDelta, maxScroll))
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { immediate: true })
      } else {
        window.scrollTo({ top: target })
      }
    }

    function onMouseUp() {
      isDragging.current             = false
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup',   onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup',   onMouseUp)
    }
  }, [])

  if (locked) return null

  return (
    // Track is pointer-events-none — visual only, never intercepts clicks
    <div
      ref={trackRef}
      className="fixed right-0 top-0 h-full w-[6px] z-[40] pointer-events-none"
    >
      <div
        ref={thumbRef}
        className="absolute w-full rounded-full bg-bronze/60 hover:bg-gold/70 transition-colors duration-150 pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ top: 0 }}
        onMouseDown={onThumbMouseDown}
      />
    </div>
  )
}
