import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RotateCcw,
  ScanSearch,
  XCircle,
} from 'lucide-react'
import { JOB_POSTING as P, JOB_SCAN_RESULT as R } from '../data/seed'
import { usePanel } from '../panels/PanelContext'
import ConfidenceMeter from './ui/ConfidenceMeter'
import Tile from './ui/Tile'
import { cn } from '../lib/utils'

// One line of the forwarded posting. Once the scan lands, the flagged phrase
// is marked in place and the reason is spelled out underneath it.
function PostingLine({ line, revealed, delay }) {
  const flagged = revealed && line.highlight
  const [before, after] = flagged ? line.text.split(line.highlight) : [line.text, '']

  return (
    <div className="mb-2 last:mb-0">
      <p className="text-[12.5px] leading-relaxed text-white/85">
        {before}
        {flagged && (
          <motion.mark
            initial={{ backgroundColor: 'rgba(244,63,94,0)' }}
            animate={{ backgroundColor: 'rgba(244,63,94,0.22)' }}
            transition={{ delay, duration: 0.4 }}
            className="rounded px-1 py-px font-semibold text-danger-soft"
            style={{ boxShadow: 'inset 0 -1px 0 0 rgba(244,63,94,0.8)' }}
          >
            {line.highlight}
          </motion.mark>
        )}
        {after}
      </p>
      {flagged && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.15, duration: 0.3 }}
          className="mt-1 inline-flex items-center gap-1 rounded bg-danger/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-danger"
        >
          <AlertTriangle className="h-2.5 w-2.5" />
          {line.label}
        </motion.span>
      )}
    </div>
  )
}

function SamplePosting({ scanning, revealed }) {
  let flagIndex = 0

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#14233a] to-[#0d1728] shadow-2xl">
      {/* message header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-safe/15 text-[11px] font-bold text-safe">
            HR
          </span>
          <div>
            <div className="text-[12px] font-bold text-ink">{P.sender}</div>
            <div className="text-[10px] text-ink-faint">
              {P.platform} · forwarded many times
            </div>
          </div>
        </div>
        <span className="mono-tnum text-[10px] text-ink-faint">{P.received}</span>
      </div>

      {/* message body */}
      <div className="relative px-4 py-3.5">
        {P.lines.map((line) => {
          const delay = line.highlight ? flagIndex++ * 0.18 : 0
          return (
            <PostingLine
              key={line.text}
              line={line}
              revealed={revealed}
              delay={delay}
            />
          )
        })}

        {/* scanning sweep */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ top: '-12%' }}
              animate={{ top: '112%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'linear' }}
              className="pointer-events-none absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-cyan/30 to-transparent"
              style={{ boxShadow: '0 0 18px #22D3EE' }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function JobScamChecker() {
  const [stage, setStage] = useState('idle') // idle | scanning | done
  const { openPanel } = usePanel()

  const run = () => {
    setStage('scanning')
    setTimeout(() => setStage('done'), 1600)
  }

  return (
    <div className="grid h-full grid-cols-2 gap-6 px-8 py-2">
      {/* left: the forwarded posting */}
      <div className="flex flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber/15">
            <Briefcase className="h-5 w-5 text-amber" />
          </span>
          <div>
            <h2 className="text-[15px] font-bold text-ink">Job-Scam Agent</h2>
            <p className="text-[11px] text-ink-faint">
              Fraudulent posting detection · text classifier
            </p>
          </div>
        </div>

        <SamplePosting scanning={stage === 'scanning'} revealed={stage === 'done'} />

        <div className="flex items-center gap-3">
          {stage === 'idle' && (
            <Tile
              onClick={run}
              accent="rgba(245,165,36,0.6)"
              className="flex items-center gap-2 rounded-xl bg-amber px-4 py-2.5 text-[13px] font-bold text-base shadow-glow-amber"
            >
              <ScanSearch className="h-4 w-4" />
              Analyze posting
            </Tile>
          )}
          {stage === 'scanning' && (
            <span className="flex items-center gap-2 text-[13px] font-semibold text-cyan">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking registry, pay bands and payment demands…
            </span>
          )}
          {stage === 'done' && (
            <>
              <Tile
                onClick={() => setStage('idle')}
                accent="rgba(154,176,206,0.45)"
                className="flex items-center gap-2 rounded-xl border border-hairline bg-black/20 px-4 py-2.5 text-[13px] font-bold text-ink-dim hover:text-ink"
              >
                <RotateCcw className="h-4 w-4" />
                Scan again
              </Tile>
              <Tile
                onClick={() => openPanel('jobscams')}
                accent="rgba(245,165,36,0.55)"
                className="flex items-center gap-2 rounded-xl border border-amber/30 bg-amber/10 px-4 py-2.5 text-[13px] font-bold text-amber"
              >
                <ExternalLink className="h-4 w-4" />
                Review queue
              </Tile>
            </>
          )}
        </div>
      </div>

      {/* right: verdict */}
      <div className="flex items-center">
        <AnimatePresence mode="wait">
          {stage === 'done' ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-2xl border border-danger/40 bg-gradient-to-br from-danger/[0.1] to-base p-5 shadow-glow-danger"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-7 w-7 text-danger" />
                  <div>
                    <div className="text-[22px] font-extrabold leading-none text-danger text-glow-danger">
                      {R.verdict}
                    </div>
                    <div className="text-[11px] text-ink-faint">
                      {R.company} · {R.role}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mono-tnum text-2xl font-extrabold text-danger">
                    {R.confidence}%
                  </div>
                  <div className="text-[10px] text-ink-faint">confidence</div>
                </div>
              </div>

              <div className="mt-3">
                <ConfidenceMeter value={R.confidence} color="#F43F5E" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {R.checks.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-2.5 py-2',
                      c.ok
                        ? 'border-safe/20 bg-safe/[0.06]'
                        : 'border-danger/25 bg-danger/[0.06]',
                    )}
                  >
                    {c.ok ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-safe" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-danger" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-semibold text-ink">
                        {c.label}
                      </div>
                      <div className="truncate text-[10px] text-ink-faint">{c.note}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 border-t border-hairline/70 pt-3">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                  Actions taken
                </div>
                <ul className="space-y-1">
                  {R.actions.map((a, i) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.08 }}
                      className="flex items-start gap-2 text-[11.5px] text-ink-dim"
                    >
                      <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-safe" />
                      {a}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid h-64 w-full place-items-center rounded-2xl border border-dashed border-hairline text-center text-ink-faint"
            >
              <div>
                <Briefcase className="mx-auto mb-2 h-7 w-7" />
                <p className="text-[13px]">
                  Run analysis to check this posting against registry and pay data
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
