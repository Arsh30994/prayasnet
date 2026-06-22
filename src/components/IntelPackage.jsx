import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Layers,
  CheckCircle2,
  Link2,
  Send,
  Loader2,
  Stamp,
  ShieldCheck,
} from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { INTEL } from '../data/seed'
import { cn } from '../lib/utils'

const TONE = {
  danger: 'text-danger',
  amber: 'text-amber',
  safe: 'text-safe',
  ink: 'text-ink',
}

export default function IntelPackage() {
  const { state } = useDemo()
  const { intelBlocks, intelComplete, dispatched } = state

  // sequential reveal bookkeeping
  let cursor = 0
  const showSummary = intelBlocks > cursor++
  const fieldShown = (i) => intelBlocks > 1 + i
  const fieldBase = 1 + INTEL.fields.length
  const actionShown = (i) => intelBlocks > fieldBase + i
  const sourceBase = fieldBase + INTEL.actions.length
  const sourceShown = (i) => intelBlocks > sourceBase + i

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl shadow-panel">
      {/* header */}
      <div className="flex items-center justify-between border-b border-hairline/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-pink-500/15" style={{ background: 'rgba(244,114,182,0.15)' }}>
            <Layers className="h-4 w-4" style={{ color: '#F472B6' }} />
          </span>
          <div>
            <h3 className="text-[13px] font-bold text-ink">Intelligence Package</h3>
            <p className="mono-tnum text-[10px] text-ink-faint">{INTEL.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-danger/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-danger">
            {INTEL.classification}
          </span>
          {!intelComplete ? (
            <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-[10px] font-semibold text-ink-dim">
              <Loader2 className="h-3 w-3 animate-spin" style={{ color: '#F472B6' }} />
              Fusion compiling…
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-md bg-safe/15 px-2 py-1 text-[10px] font-bold text-safe">
              <CheckCircle2 className="h-3 w-3" />
              Ready
            </span>
          )}
        </div>
      </div>

      {/* body */}
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-4 overflow-y-auto p-4">
        {/* left: summary + metrics */}
        <div className="col-span-3 space-y-4">
          {/* summary */}
          <AnimatePresence>
            {showSummary && (
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                className="rounded-xl border border-hairline/70 bg-black/20 p-3.5"
              >
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                  <FileText className="h-3.5 w-3.5" />
                  Incident summary
                </div>
                <p className="text-[13px] leading-relaxed text-ink-dim">{INTEL.summary}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* metrics grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {INTEL.fields.map((f, i) => (
              <AnimatePresence key={f.k}>
                {fieldShown(i) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-hairline/70 bg-black/20 px-3 py-2.5"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                      {f.k}
                    </div>
                    <div className={cn('mt-0.5 text-[15px] font-extrabold', TONE[f.tone])}>
                      {f.v}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>

        {/* right: actions + sources */}
        <div className="col-span-2 space-y-4">
          {/* recommended actions */}
          <div className="rounded-xl border border-hairline/70 bg-black/20 p-3.5">
            <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              <ShieldCheck className="h-3.5 w-3.5 text-safe" />
              Recommended actions
            </div>
            <div className="space-y-2">
              {INTEL.actions.map((a, i) => (
                <AnimatePresence key={i}>
                  {actionShown(i) && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safe" />
                      <span className="text-[12px] leading-snug text-ink-dim">{a}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>

          {/* sources */}
          <div className="rounded-xl border border-hairline/70 bg-black/20 p-3.5">
            <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              <Link2 className="h-3.5 w-3.5 text-cyan" />
              Source citations
            </div>
            <div className="space-y-1.5">
              {INTEL.sources.map((s, i) => (
                <AnimatePresence key={i}>
                  {sourceShown(i) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-[11.5px] text-ink-dim"
                    >
                      <span className="mono-tnum text-cyan">[{i + 1}]</span>
                      {s}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* dispatch footer */}
      <div className="flex items-center justify-between border-t border-hairline/70 px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-safe" />
          Auto-compiled by Fusion Agent · evidence-linked
        </div>
        <AnimatePresence mode="wait">
          {dispatched ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-xl bg-safe/15 px-4 py-2.5 text-[13px] font-bold text-safe ring-1 ring-safe/30"
            >
              <Stamp className="h-4 w-4" />
              Dispatched to Delhi Cyber Cell
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: intelComplete ? 1 : 0.5 }}
              disabled={!intelComplete}
              whileTap={intelComplete ? { scale: 0.97 } : {}}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all',
                intelComplete
                  ? 'bg-cyan text-base shadow-glow-cyan hover:brightness-110'
                  : 'cursor-not-allowed bg-white/5 text-ink-faint',
              )}
            >
              <Send className="h-4 w-4" />
              Dispatch to Cyber Cell
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
