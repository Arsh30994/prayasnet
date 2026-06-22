import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanEye, Upload, XCircle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react'
import { COUNTERFEIT_RESULT as R } from '../data/seed'
import ConfidenceMeter from './ui/ConfidenceMeter'
import { cn } from '../lib/utils'

// Stylized ₹500 note (no external image needed)
function SampleNote({ scanning, revealed }) {
  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl ring-1 ring-white/10 shadow-2xl">
      {/* note base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a3550] via-[#4a4068] to-[#2c2740]" />
      <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(45deg,#fff2_0_2px,transparent_2px_8px)]" />
      {/* denomination */}
      <div className="absolute left-3 top-2 text-[10px] font-semibold tracking-wide text-white/70">
        भारतीय रिज़र्व बैंक · RESERVE BANK OF INDIA
      </div>
      <div className="absolute right-3 top-2 font-mono text-[13px] font-bold text-amber/90">
        9KX 472913
      </div>
      <div className="absolute bottom-2 left-3 text-4xl font-black text-white/85">₹500</div>
      <div className="absolute bottom-3 right-3 text-[10px] text-white/50">
        Specimen · AI evidence frame
      </div>
      {/* portrait placeholder */}
      <div className="absolute right-8 top-1/2 h-16 w-12 -translate-y-1/2 rounded bg-white/10 ring-1 ring-white/15" />

      {/* scanning line */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'linear' }}
            className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-cyan/40 to-transparent"
            style={{ boxShadow: '0 0 18px #22D3EE' }}
          />
        )}
      </AnimatePresence>

      {/* region overlays */}
      {revealed &&
        R.regions.map((rg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.18 }}
            className="absolute rounded-md border-2 border-danger"
            style={{
              left: `${rg.x}%`,
              top: `${rg.y}%`,
              width: `${rg.w}%`,
              height: `${rg.h}%`,
              boxShadow: '0 0 16px rgba(244,63,94,0.6)',
            }}
          >
            <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-danger px-1.5 py-0.5 text-[9px] font-bold text-base">
              {rg.label}
            </span>
          </motion.div>
        ))}
    </div>
  )
}

export default function CounterfeitChecker() {
  const [stage, setStage] = useState('idle') // idle | scanning | done
  const run = () => {
    setStage('scanning')
    setTimeout(() => setStage('done'), 1600)
  }

  return (
    <div className="grid h-full grid-cols-2 gap-6 px-8 py-2">
      {/* left: note + upload */}
      <div className="flex flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber/15">
            <ScanEye className="h-5 w-5 text-amber" />
          </span>
          <div>
            <h2 className="text-[15px] font-bold text-ink">Counterfeit-Vision Agent</h2>
            <p className="text-[11px] text-ink-faint">Currency authenticity · computer vision</p>
          </div>
        </div>

        <SampleNote scanning={stage === 'scanning'} revealed={stage === 'done'} />

        <div className="flex items-center gap-3">
          {stage === 'idle' && (
            <button
              onClick={run}
              className="flex items-center gap-2 rounded-xl bg-amber px-4 py-2.5 text-[13px] font-bold text-base shadow-glow-amber transition hover:brightness-110"
            >
              <Upload className="h-4 w-4" />
              Analyze note
            </button>
          )}
          {stage === 'scanning' && (
            <span className="flex items-center gap-2 text-[13px] font-semibold text-cyan">
              <Loader2 className="h-4 w-4 animate-spin" />
              Inspecting security features…
            </span>
          )}
          {stage === 'done' && (
            <button
              onClick={() => setStage('idle')}
              className="flex items-center gap-2 rounded-xl border border-hairline bg-black/20 px-4 py-2.5 text-[13px] font-bold text-ink-dim transition hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" />
              Scan again
            </button>
          )}
        </div>
      </div>

      {/* right: result */}
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
                      FAKE
                    </div>
                    <div className="text-[11px] text-ink-faint">
                      {R.denomination} note · suspected counterfeit
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
                      <div className="truncate text-[12px] font-semibold text-ink">{c.label}</div>
                      <div className="truncate text-[10px] text-ink-faint">{c.note}</div>
                    </div>
                  </motion.div>
                ))}
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
                <ScanEye className="mx-auto mb-2 h-7 w-7" />
                <p className="text-[13px]">Run analysis to inspect security features</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
