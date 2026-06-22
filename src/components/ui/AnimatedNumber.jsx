import { useEffect, useRef, useState } from 'react'
import { formatINR, formatINRCompact } from '../../lib/utils'

// Smoothly eases the displayed number toward `value` whenever it changes.
export default function AnimatedNumber({
  value,
  duration = 900,
  money = false,
  compact = false,
  className = '',
}) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    startRef.current = null

    const step = (ts) => {
      if (startRef.current == null) startRef.current = ts
      const t = Math.min(1, (ts - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const current = from + (to - from) * eased
      setDisplay(current)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = to
        setDisplay(to)
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => rafRef.current && cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  let text
  if (money) text = compact ? formatINRCompact(display) : formatINR(display)
  else text = Math.round(display).toLocaleString('en-IN')

  return <span className={className}>{text}</span>
}
