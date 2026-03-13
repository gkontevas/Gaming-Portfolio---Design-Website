'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function CustomScrollbar() {
  const thumbRef        = useRef<HTMLDivElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const isDragging      = useRef(false)
  const dragStartY      = useRef(0)
  const dragStartScroll = useRef(0)

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

  // When the user presses down on the thumb, record the starting positions
  function onThumbMouseDown(e: React.MouseEvent) {
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
      if (!isDragging.current) return
      const { maxScroll, maxThumbTop } = getMetrics()
      // How far did the mouse move? Convert that to a scroll distance.
      // The ratio is: (mouse delta / available track space) = (scroll delta / max scroll)
      const deltaY      = e.clientY - dragStartY.current
      const scrollDelta = (deltaY / maxThumbTop) * maxScroll
      window.scrollTo({ top: dragStartScroll.current + scrollDelta })
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

  // Clicking the track (not the thumb) jumps to that position
  function onTrackClick(e: React.MouseEvent) {
    if (e.target === thumbRef.current) return
    const track = trackRef.current
    if (!track) return
    const { maxScroll, maxThumbTop, thumbHeight } = getMetrics()
    // Center the thumb on the click point
    const clickY    = e.clientY - track.getBoundingClientRect().top - thumbHeight / 2
    const scrollTo  = (clickY / maxThumbTop) * maxScroll
    window.scrollTo({ top: scrollTo, behavior: 'smooth' })
  }

  return (
    // Track — now pointer-events auto so it receives clicks
    <div
      ref={trackRef}
      className="fixed right-0 top-0 h-full w-[6px] z-[9997]"
      onClick={onTrackClick}
    >
      <div
        ref={thumbRef}
        className="absolute w-full rounded-full bg-bronze/60 hover:bg-gold/70 transition-colors duration-150"
        style={{ top: 0 }}
        onMouseDown={onThumbMouseDown}
      />
    </div>
  )
}
