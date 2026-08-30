import { motion } from 'framer-motion'
import { ShieldHalf } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { cn } from '../lib/utils'

const VIEWS = [
  { id: 'operations', label: 'Operations' },
  { id: 'shield', label: 'Citizen Shield' },
  { id: 'jobs', label: 'Job Scams' },
  { id: 'map', label: 'Crime Map' },
]

export default function Header() {
  const { playing, view, setView } = useDemo()

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
    </header>
  )
}
