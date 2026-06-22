import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { getDemoState, TOTAL_DURATION, T, CHAPTERS } from './timeline'

const DemoContext = createContext(null)

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>')
  return ctx
}

export function DemoProvider({ children }) {
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [view, setView] = useState('operations') // operations | counterfeit | map | shield
  const [selectedNode, setSelectedNode] = useState(null)

  const rafRef = useRef(null)
  const lastTsRef = useRef(null)
  const playingRef = useRef(false)
  const elapsedRef = useRef(0)
  const stopAtRef = useRef(null) // auto-pause target for stepped chapters

  const tick = useCallback((ts) => {
    if (lastTsRef.current == null) lastTsRef.current = ts
    const dt = ts - lastTsRef.current
    lastTsRef.current = ts
    if (playingRef.current) {
      let next = elapsedRef.current + dt
      const stopAt = stopAtRef.current
      if (stopAt != null && next >= stopAt) {
        // reached the end of this chapter → hold here for narration
        next = stopAt
        stopAtRef.current = null
        playingRef.current = false
        setPlaying(false)
      } else if (next >= TOTAL_DURATION) {
        next = TOTAL_DURATION
        playingRef.current = false
        setPlaying(false)
      }
      elapsedRef.current = next
      setElapsed(next)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const ensureLoop = useCallback(() => {
    if (rafRef.current == null) {
      lastTsRef.current = null
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [tick])

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    // restart cleanly if at the end
    if (elapsedRef.current >= TOTAL_DURATION) {
      elapsedRef.current = 0
      setElapsed(0)
    }
    setView('operations')
    stopAtRef.current = null // full play → run to the end
    playingRef.current = true
    setPlaying(true)
    lastTsRef.current = null
    ensureLoop()
  }, [ensureLoop])

  // Play one chapter: jump to its start, run, then auto-pause at its end.
  const playSegment = useCallback(
    (start, stop) => {
      setView('operations')
      const s = Math.max(0, Math.min(TOTAL_DURATION, start))
      elapsedRef.current = s
      setElapsed(s)
      stopAtRef.current = stop
      playingRef.current = true
      setPlaying(true)
      lastTsRef.current = null
      ensureLoop()
    },
    [ensureLoop],
  )

  const playChapter = useCallback(
    (n) => {
      const ch = CHAPTERS[n - 1]
      if (ch) playSegment(ch.start, ch.stop)
    },
    [playSegment],
  )

  const pause = useCallback(() => {
    stopAtRef.current = null
    playingRef.current = false
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (playingRef.current) pause()
    else play()
  }, [play, pause])

  const reset = useCallback(() => {
    playingRef.current = false
    setPlaying(false)
    stopAtRef.current = null
    stopLoop()
    elapsedRef.current = 0
    setElapsed(0)
    setSelectedNode(null)
    setView('operations')
  }, [stopLoop])

  const seek = useCallback((ms) => {
    const v = Math.max(0, Math.min(TOTAL_DURATION, ms))
    elapsedRef.current = v
    setElapsed(v)
  }, [])

  // Jump to a labelled chapter (used by the chapter rail)
  const seekTo = useCallback((key) => {
    if (T[key] != null) seek(T[key] + 50)
  }, [seek])

  useEffect(() => () => stopLoop(), [stopLoop])

  // Keyboard shortcuts (the only way to drive the demo now — controls are hidden):
  //   1–6 → step through each beat   SPACE → play all / pause   R → reset   L → replay
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key >= '1' && e.key <= '6') {
        e.preventDefault()
        playChapter(Number(e.key))
      } else if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        reset()
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault()
        reset()
        setTimeout(play, 40)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, reset, play, playChapter])

  // URL controls (handy for recording / deep-linking a moment):
  //   ?t=12000  → seek to 12s    ?play=1 → autoplay on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('t')
    if (t != null && !Number.isNaN(Number(t))) seek(Number(t))
    if (params.get('play') === '1') play()
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const state = useMemo(() => getDemoState(elapsed), [elapsed])

  const value = useMemo(
    () => ({
      elapsed,
      playing,
      view,
      setView,
      selectedNode,
      setSelectedNode,
      play,
      pause,
      toggle,
      reset,
      seek,
      seekTo,
      playChapter,
      total: TOTAL_DURATION,
      state,
    }),
    [elapsed, playing, view, selectedNode, play, pause, toggle, reset, seek, seekTo, playChapter, state],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
