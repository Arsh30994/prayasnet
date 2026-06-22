import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Repeat, ShieldHalf, Radio } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { cn } from '../lib/utils'

const VIEWS = [
  { id: 'operations', label: 'Operations' },
  { id: 'shield', label: 'Citizen Shield' },
  { id: 'counterfeit', label: 'Counterfeit' },
  { id: 'map', label: 'Crime Map' },
]

export default function Header() {
  const { playing, play, pause, reset, elapsed, view, setView } = useDemo()
  const atStart = elapsed === 0
  const primaryLabel = playing ? 'PAUSE' : atStart ? 'RUN LIVE SCENARIO' : 'RESUME'

  return (
    <header className="relative z-20 flex items-center gap-4 px-6 py-3 border-b border-hairline/80">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-violet/10 ring-1 ring-cyan/30">
          <ShieldHalf className="h-5 w-5 text-cyan" />
          <span className="absolute inset-0 rounded-xl shadow-glow-cyan opacity-40" />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-extrabold tracking-tight text-ink">
              Prayas<span className="text-cyan text-glow-cyan">Net</span>
            </h1>
            <span className="rounded bg-cyan/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan ring-1 ring-cyan/20">
              v1.0
            </span>
          </div>
          <p className="text-[11px] font-medium text-ink-faint">
            Digital Public Safety · Command Center
          </p>
        </div>
      </div>

      {/* Live status pill */}
      <div className="ml-2 hidden items-center gap-2 rounded-full border border-hairline bg-black/30 px-3 py-1.5 lg:flex">
        <span className="relative flex h-2 w-2">
          <span className={cn('absolute inline-flex h-full w-full rounded-full', playing ? 'animate-ping bg-safe/70' : 'bg-ink-faint')} />
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', playing ? 'bg-safe' : 'bg-ink-faint')} />
        </span>
        <span className="text-[11px] font-semibold tracking-wide text-ink-dim">
          {playing ? 'LIVE' : 'STANDBY'}
        </span>
      </div>

      {/* View tabs */}
      <nav className="ml-auto flex items-center gap-1 rounded-xl border border-hairline bg-black/20 p-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={cn(
              'relative rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors duration-300',
              view === v.id ? 'text-base' : 'text-ink-dim hover:text-ink',
            )}
          >
            {view === v.id && (
              <motion.span
                layoutId="viewpill"
                className="absolute inset-0 rounded-lg bg-cyan"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{v.label}</span>
          </button>
        ))}
      </nav>

      {/* Transport controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={reset}
          title="Reset"
          className="grid h-9 w-9 place-items-center rounded-lg border border-hairline bg-black/20 text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            reset()
            // next tick → play from 0
            setTimeout(play, 30)
          }}
          title="Replay from start"
          className="grid h-9 w-9 place-items-center rounded-lg border border-hairline bg-black/20 text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
        >
          <Repeat className="h-4 w-4" />
        </button>
        <motion.button
          onClick={playing ? pause : play}
          whileTap={{ scale: 0.96 }}
          className={cn(
            'group relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-[13px] font-bold tracking-wide transition-all duration-300',
            playing
              ? 'bg-amber/15 text-amber ring-1 ring-amber/40'
              : 'bg-cyan text-base shadow-glow-cyan ring-1 ring-cyan/50 hover:brightness-110',
          )}
        >
          {!playing && (
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
          )}
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
          <span className="relative">{primaryLabel}</span>
          {!playing && atStart && <Radio className="relative h-3.5 w-3.5 animate-pulse" />}
        </motion.button>
      </div>
    </header>
  )
}
