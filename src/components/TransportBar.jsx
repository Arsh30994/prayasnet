import { motion } from 'framer-motion'
import { useDemo } from '../demo/DemoContext'
import { PHASE_LABEL, T } from '../demo/timeline'
import { cn } from '../lib/utils'

const CHAPTERS = [
  { key: 'incoming', label: 'Signal' },
  { key: 'scamWake', label: 'Scam Call' },
  { key: 'graphWake', label: 'Network' },
  { key: 'fusionWake', label: 'Fusion' },
  { key: 'shieldWake', label: 'Shield' },
  { key: 'neutralized', label: 'Resolved' },
]

export default function TransportBar() {
  const { elapsed, total, seek, seekTo, state } = useDemo()
  const pct = (elapsed / total) * 100

  const handleScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const f = (e.clientX - rect.left) / rect.width
    seek(f * total)
  }

  return (
    <div className="relative z-10 flex items-center gap-4 px-6 py-2.5 border-b border-hairline/60 bg-black/20">
      {/* Phase indicator */}
      <div className="flex min-w-[210px] items-center gap-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
          Phase
        </span>
        <motion.span
          key={state.phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-md px-2 py-0.5 text-[12px] font-bold tracking-wide',
            state.phase === 'neutralized'
              ? 'bg-safe/15 text-safe'
              : state.phase === 'idle'
                ? 'bg-white/5 text-ink-dim'
                : 'bg-cyan/15 text-cyan',
          )}
        >
          {PHASE_LABEL[state.phase]}
        </motion.span>
      </div>

      {/* Scrubber */}
      <div className="group relative flex-1">
        <div
          onClick={handleScrub}
          className="relative h-2 cursor-pointer rounded-full bg-white/5"
        >
          {/* chapter ticks */}
          {CHAPTERS.map((c) => {
            const left = (T[c.key] / total) * 100
            const reached = elapsed >= T[c.key]
            return (
              <button
                key={c.key}
                onClick={(e) => {
                  e.stopPropagation()
                  seekTo(c.key)
                }}
                title={c.label}
                className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%` }}
              >
                <span
                  className={cn(
                    'block h-3 w-3 rounded-full border transition-all duration-300',
                    reached
                      ? 'border-cyan bg-cyan shadow-glow-cyan'
                      : 'border-ink-faint bg-base',
                  )}
                />
                <span className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-wide text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
                  {c.label}
                </span>
              </button>
            )
          })}
          {/* fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan/50 to-cyan"
            style={{ width: `${pct}%` }}
          />
          {/* playhead */}
          <div
            className="absolute top-1/2 z-20 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-glow-cyan"
            style={{ left: `${pct}%` }}
          />
        </div>
      </div>

      <span className="mono-tnum w-16 text-right text-[11px] text-ink-dim">
        {(elapsed / 1000).toFixed(1)}s
      </span>
    </div>
  )
}
