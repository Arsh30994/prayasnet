import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, AlertTriangle, ShieldAlert, Check, Zap } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { TRANSCRIPT, RED_FLAGS, SCAM_SIGNALS } from '../data/seed'
import ConfidenceMeter from './ui/ConfidenceMeter'
import { cn } from '../lib/utils'

// Build one regex that matches any red-flag phrase (longest first to avoid partials)
const FLAG_RE = new RegExp(
  '(' +
    [...RED_FLAGS]
      .sort((a, b) => b.length - a.length)
      .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|') +
    ')',
  'gi',
)
const FLAG_SET = new Set(RED_FLAGS.map((f) => f.toLowerCase()))

function Highlighted({ text }) {
  // split keeps the captured red-flag phrases as their own array entries
  const parts = text.split(FLAG_RE)
  return (
    <>
      {parts.map((p, i) =>
        FLAG_SET.has(p.toLowerCase()) ? (
          <motion.mark
            key={i}
            initial={{ backgroundColor: 'rgba(244,63,94,0)' }}
            animate={{ backgroundColor: 'rgba(244,63,94,0.22)' }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded px-1 font-semibold text-danger-soft"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(244,63,94,0.35)' }}
          >
            {p}
          </motion.mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export default function ScamPanel() {
  const { state } = useDemo()
  const { transcriptCount, showVerdict, confidence } = state
  const scrollRef = useRef(null)
  const visible = TRANSCRIPT.slice(0, transcriptCount)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcriptCount])

  // signals reveal proportional to transcript progress
  const signalsShown = Math.min(
    SCAM_SIGNALS.length,
    Math.round((transcriptCount / TRANSCRIPT.length) * SCAM_SIGNALS.length),
  )

  return (
    <div className="grid h-full grid-cols-5 gap-4">
      {/* Transcript stream */}
      <div className="glass scanline col-span-3 flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-panel">
        <div className="flex items-center justify-between border-b border-hairline/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan/15">
              <Phone className="h-4 w-4 text-cyan" />
            </span>
            <div>
              <h3 className="text-[13px] font-bold text-ink">Live Call Transcript</h3>
              <p className="text-[10px] text-ink-faint">ASR · real-time NLP triage</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-danger/10 px-2 py-1 text-[10px] font-bold text-danger">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
            REC
          </span>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {visible.map((line, i) => {
            const isCaller = line.who === 'caller'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={cn('flex', isCaller ? 'justify-start' : 'justify-end')}
              >
                <div className={cn('max-w-[82%]', isCaller ? 'items-start' : 'items-end')}>
                  <div
                    className={cn(
                      'mb-1 text-[9px] font-bold uppercase tracking-wider',
                      isCaller ? 'text-danger' : 'text-cyan',
                    )}
                  >
                    {isCaller ? '“Sub-Inspector” (caller)' : 'Citizen'}
                  </div>
                  <div
                    className={cn(
                      'rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                      isCaller
                        ? 'rounded-tl-sm bg-danger/[0.07] text-ink ring-1 ring-danger/20'
                        : 'rounded-tr-sm bg-cyan/[0.07] text-ink-dim ring-1 ring-cyan/15',
                    )}
                  >
                    <Highlighted text={line.text} />
                  </div>
                </div>
              </motion.div>
            )
          })}
          {transcriptCount < TRANSCRIPT.length && transcriptCount > 0 && (
            <div className="flex items-center gap-1.5 pl-1 text-ink-faint">
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint" />
            </div>
          )}
        </div>
      </div>

      {/* Signals + verdict */}
      <div className="col-span-2 flex min-h-0 flex-col gap-4">
        {/* detected signals */}
        <div className="glass flex flex-col overflow-hidden rounded-2xl shadow-panel">
          <div className="flex items-center gap-2 border-b border-hairline/70 px-4 py-2.5">
            <ShieldAlert className="h-4 w-4 text-amber" />
            <h3 className="text-[12px] font-bold text-ink">Red-Flag Signals</h3>
          </div>
          <div className="space-y-1.5 p-3">
            {SCAM_SIGNALS.map((s, i) => {
              const on = i < signalsShown
              return (
                <motion.div
                  key={i}
                  animate={{ opacity: on ? 1 : 0.3 }}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"
                >
                  <span
                    className={cn(
                      'grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors duration-300',
                      on ? 'bg-danger text-base' : 'bg-white/5 text-transparent',
                    )}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="flex-1 text-[12px] text-ink-dim">{s.label}</span>
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[9px] font-bold uppercase',
                      s.weight === 'Critical' ? 'bg-danger/15 text-danger' : 'bg-amber/15 text-amber',
                    )}
                  >
                    {s.weight}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* verdict */}
        <div className="relative min-h-0 flex-1">
          <AnimatePresence>
            {showVerdict && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="relative h-full overflow-hidden rounded-2xl border border-danger/40 bg-gradient-to-br from-danger/[0.12] to-base p-4 shadow-glow-danger"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-danger/10 blur-2xl" />
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-danger/20"
                  >
                    <AlertTriangle className="h-5 w-5 text-danger" />
                  </motion.span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-danger">
                      Verdict
                    </div>
                    <div className="text-[15px] font-extrabold leading-tight text-ink text-glow-danger">
                      DIGITAL ARREST SCAM
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-end justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                      Confidence
                    </span>
                    <span className="mono-tnum text-2xl font-extrabold text-danger">
                      {confidence}%
                    </span>
                  </div>
                  <ConfidenceMeter value={confidence} color="#F43F5E" />
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-safe/10 px-3 py-2 ring-1 ring-safe/25">
                  <Check className="h-4 w-4 text-safe" strokeWidth={3} />
                  <span className="text-[12px] font-bold text-safe">
                    TRANSFER NOT YET MADE
                  </span>
                </div>

                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-danger px-3 py-2.5 text-base"
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span className="text-[13px] font-extrabold tracking-wide">INTERVENE NOW</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showVerdict && (
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-hairline/70 text-center">
              <div className="text-ink-faint">
                <ShieldAlert className="mx-auto mb-2 h-6 w-6 animate-pulse" />
                <p className="text-[12px]">Awaiting verdict…</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
