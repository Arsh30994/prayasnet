import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { CHAPTERS, TOTAL_DURATION } from '../demo/timeline'
import Tile from './ui/Tile'
import { cn } from '../lib/utils'

// On-screen replacement for the old keyboard shortcuts: play/pause, a stepper
// that jumps to any of the six beats, and reset.
export default function DemoControls() {
  const { playing, elapsed, toggle, reset, playChapter, view } = useDemo()

  if (view !== 'operations') return null

  const finished = elapsed >= TOTAL_DURATION
  const currentIdx = finished
    ? CHAPTERS.length - 1
    : Math.max(0, CHAPTERS.findIndex((ch) => elapsed < ch.stop))
  const current = CHAPTERS[currentIdx]
  const started = elapsed > 0

  const primaryLabel = playing ? 'Pause' : finished ? 'Replay' : started ? 'Resume' : 'Start'

  return (
    <div className="pointer-events-none fixed bottom-9 left-1/2 z-50 -translate-x-1/2">
      {/* which beat is on screen right now */}
      <div className="mb-1.5 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={current.n + String(started)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="rounded-full border border-hairline bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint backdrop-blur-md"
          >
            {finished ? 'Walkthrough complete' : `Step ${current.n} · ${current.label}`}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-hairline bg-black/70 px-2.5 py-2 shadow-panel backdrop-blur-md">
        <Tile
          onClick={toggle}
          accent="rgba(34,211,238,0.65)"
          aria-label={primaryLabel}
          className="flex items-center gap-1.5 rounded-xl bg-cyan px-3 py-1.5 text-[12px] font-extrabold text-base"
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <Play className="h-3.5 w-3.5" strokeWidth={3} />
          )}
          {primaryLabel}
        </Tile>

        <span className="h-6 w-px bg-hairline" />

        <div className="flex items-center">
          {CHAPTERS.map((ch, i) => {
            const done = elapsed >= ch.stop
            const active = i === currentIdx && started
            return (
              <div key={ch.n} className="flex items-center">
                {i > 0 && (
                  <span
                    className={cn(
                      'h-px w-3 transition-colors duration-300',
                      elapsed >= CHAPTERS[i - 1].stop ? 'bg-cyan/60' : 'bg-hairline',
                    )}
                  />
                )}
                <Tile
                  onClick={() => playChapter(ch.n)}
                  accent="rgba(34,211,238,0.6)"
                  lift={2}
                  title={ch.label}
                  aria-label={`Step ${ch.n}: ${ch.label}`}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'mono-tnum grid h-7 w-7 place-items-center rounded-lg border text-[11px] font-bold transition-colors duration-300',
                    active
                      ? 'border-cyan bg-cyan/20 text-cyan shadow-glow-cyan'
                      : done
                        ? 'border-cyan/35 bg-cyan/10 text-cyan/80'
                        : 'border-hairline bg-black/30 text-ink-faint hover:text-ink',
                  )}
                >
                  {ch.n}
                </Tile>
              </div>
            )
          })}
        </div>

        <span className="h-6 w-px bg-hairline" />

        <Tile
          onClick={reset}
          accent="rgba(154,176,206,0.45)"
          aria-label="Reset walkthrough"
          className="flex items-center gap-1.5 rounded-xl border border-hairline bg-black/30 px-2.5 py-1.5 text-[12px] font-bold text-ink-dim hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Tile>
      </div>
    </div>
  )
}
