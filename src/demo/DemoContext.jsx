import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { getDemoState, TOTAL_DURATION, T } from './timeline'

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

  const tick = useCallback((ts) => {
    if (lastTsRef.current == null) lastTsRef.current = ts
    const dt = ts - lastTsRef.current
    lastTsRef.current = ts
    if (playingRef.current) {
      let next = elapsedRef.current + dt
      if (next >= TOTAL_DURATION) {
        next = TOTAL_DURATION
        elapsedRef.current = next
        setElapsed(next)
        playingRef.current = false
        setPlaying(false)
        return // stop the loop at the end
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
    playingRef.current = true
    setPlaying(true)
    lastTsRef.current = null
    ensureLoop()
  }, [ensureLoop])

  const pause = useCallback(() => {
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
      total: TOTAL_DURATION,
      state,
    }),
    [elapsed, playing, view, selectedNode, play, pause, toggle, reset, seek, seekTo, state],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
