import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Radio, PhoneIncoming, ArrowRight, ShieldCheck } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { INCIDENT_FEED } from '../data/seed'
import { cn } from '../lib/utils'

const SEV = {
  high: { dot: 'bg-danger', text: 'text-danger', ring: 'ring-danger/30' },
  med: { dot: 'bg-amber', text: 'text-amber', ring: 'ring-amber/30' },
  low: { dot: 'bg-cyan', text: 'text-cyan', ring: 'ring-cyan/30' },
}

export default function Dashboard() {
  const { state, play } = useDemo()
  const incoming = state.phase === 'incoming'

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Hero / incoming */}
      <div className="relative overflow-hidden rounded-2xl glass p-6 shadow-panel">
        <AnimatePresence mode="wait">
          {incoming ? (
            <motion.div
              key="incoming"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber/15 ring-1 ring-amber/40 shadow-glow-amber"
              >
                <PhoneIncoming className="h-7 w-7 text-amber" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                    Incoming signal
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-ink">
                  Citizen forwarded a suspicious call
                </h3>
                <p className="text-[13px] text-ink-dim">
                  Source: Citizen-Shield app · South Delhi · routing to Orchestrator…
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cyan/10 ring-1 ring-cyan/30">
                  <ShieldCheck className="h-7 w-7 text-cyan" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">All systems nominal</h3>
                  <p className="text-[13px] text-ink-dim">
                    6 agents online · monitoring national fraud signals in real time
                  </p>
                </div>
              </div>
              <button
                onClick={play}
                className="group flex items-center gap-2 rounded-xl bg-cyan/10 px-4 py-2.5 text-[13px] font-bold text-cyan ring-1 ring-cyan/30 transition-all hover:bg-cyan/20"
              >
                <Radio className="h-4 w-4" />
                Run Live Scenario
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan/5 blur-3xl" />
      </div>

      {/* Live incident feed */}
      <div className="glass flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl shadow-panel">
        <div className="flex items-center justify-between border-b border-hairline/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan" />
            <h3 className="text-[13px] font-bold text-ink">Live Incident Feed</h3>
          </div>
          <span className="mono-tnum text-[11px] text-ink-faint">streaming</span>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {INCIDENT_FEED.map((it, i) => {
            const sev = SEV[it.sev]
            const isLive = it.live
            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'flex items-center gap-3 rounded-xl border border-hairline/70 bg-black/20 px-3 py-2.5 transition-colors',
                  isLive && incoming && 'ring-1 ' + sev.ring,
                )}
              >
                <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', sev.dot)}>
                  {isLive && (
                    <span className={cn('block h-2.5 w-2.5 animate-ping rounded-full', sev.dot)} />
                  )}
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                    'bg-white/5',
                    sev.text,
                  )}
                >
                  {it.tag}
                </span>
                <span className="flex-1 truncate text-[12.5px] text-ink-dim">{it.text}</span>
                <span className="mono-tnum shrink-0 text-[11px] text-ink-faint">{it.time}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
