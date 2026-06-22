import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Send, AlertTriangle, ChevronRight, Languages, Loader2 } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { SHIELD_CHAT } from '../data/seed'
import { cn } from '../lib/utils'

const LANGS = [
  { id: 'en', label: 'EN' },
  { id: 'hi', label: 'हिं' },
  { id: 'ta', label: 'த' },
]

// ── The reusable phone frame ────────────────────────────────────────────────
function ShieldPhone({ lang, showForwarded, thinking, showVerdict }) {
  const t = SHIELD_CHAT[lang]
  return (
    <div className="relative h-[560px] w-[300px] rounded-[2.4rem] border-[7px] border-[#0a0f1c] bg-[#0d1426] shadow-2xl ring-1 ring-white/5">
      {/* notch */}
      <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#0a0f1c]" />
      {/* chat header */}
      <div className="flex items-center gap-2.5 rounded-t-[1.9rem] border-b border-white/5 bg-[#101a30] px-4 pb-2.5 pt-5">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-safe/15 ring-1 ring-safe/30">
          <ShieldCheck className="h-5 w-5 text-safe" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-bold text-ink">{t.name}</div>
          <div className="flex items-center gap-1 text-[10px] text-safe">
            <span className="h-1.5 w-1.5 rounded-full bg-safe" />
            online · protecting you
          </div>
        </div>
      </div>

      {/* chat body */}
      <div className="flex h-[calc(100%-118px)] flex-col gap-3 overflow-y-auto p-3.5">
        <div className="mx-auto rounded-full bg-white/5 px-3 py-1 text-[9px] text-ink-faint">
          Forwarded · today
        </div>

        <AnimatePresence>
          {showForwarded && (
            <motion.div
              key="fwd"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-cyan/10 px-3 py-2 text-[12px] leading-snug text-ink ring-1 ring-cyan/15"
            >
              {t.forwarded}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {thinking && (
            <motion.div
              key="think"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white/5 px-3 py-2.5"
            >
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showVerdict && (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className="mr-auto max-w-[88%] rounded-2xl rounded-tl-sm border border-danger/30 bg-danger/[0.12] p-3"
            >
              <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-danger">
                <AlertTriangle className="h-4 w-4" />
                {t.verdictTitle}
              </div>
              <p className="mt-1.5 text-[11.5px] leading-snug text-ink-dim">{t.verdict}</p>
              <div className="mt-2.5 space-y-1.5">
                {t.steps.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.18 }}
                    className="flex items-center gap-1.5 rounded-lg bg-black/30 px-2 py-1.5 text-[11.5px] font-semibold text-ink"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-safe" />
                    {s}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* input bar (decorative in demo) */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-2">
        <span className="flex-1 truncate text-[11px] text-ink-faint">{t.placeholder}</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-safe/20">
          <Send className="h-3.5 w-3.5 text-safe" />
        </span>
      </div>
    </div>
  )
}

// ── Demo overlay (driven by the scripted timeline) ──────────────────────────
export function CitizenShieldOverlay() {
  const { state } = useDemo()
  if (!state.showPhone) return null
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="pointer-events-none absolute right-5 top-1/2 z-40 -translate-y-1/2"
    >
      <div className="relative">
        <div className="absolute -inset-6 rounded-[3rem] bg-safe/10 blur-2xl" />
        <div className="relative">
          {/* live tag */}
          <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-safe px-3 py-1 text-[10px] font-bold text-base">
            Citizen-Shield · live warning
          </div>
          <ShieldPhone
            lang="en"
            showForwarded
            thinking={!state.shieldVerdict}
            showVerdict={state.shieldVerdict}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ── Standalone interactive view (P1 nav tab) ────────────────────────────────
export function CitizenShieldView() {
  const [lang, setLang] = useState('en')
  const [stage, setStage] = useState('idle') // idle | thinking | verdict
  const t = SHIELD_CHAT[lang]

  const analyze = () => {
    setStage('thinking')
    setTimeout(() => setStage('verdict'), 1500)
  }
  const resetChat = () => setStage('idle')

  return (
    <div className="grid h-full grid-cols-2 gap-8 px-8">
      {/* left: pitch + controls */}
      <div className="flex flex-col justify-center">
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-safe/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-safe ring-1 ring-safe/25">
          <ShieldCheck className="h-3.5 w-3.5" />
          Citizen Fraud Shield
        </span>
        <h2 className="text-3xl font-extrabold leading-tight text-ink">
          A second opinion <span className="text-safe">before they pay.</span>
        </h2>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-dim">
          Any citizen can forward a suspicious message and get an instant, plain-language
          verdict — in their own language. The same intelligence that powers the command
          center, in everyone's pocket.
        </p>

        {/* language toggle */}
        <div className="mt-6 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-dim">
            <Languages className="h-4 w-4 text-cyan" />
            Language
          </span>
          <div className="flex gap-1 rounded-xl border border-hairline bg-black/20 p-1">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setLang(l.id)
                  setStage('idle')
                }}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors',
                  lang === l.id ? 'bg-cyan text-base' : 'text-ink-dim hover:text-ink',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* action */}
        <div className="mt-6 flex gap-3">
          {stage === 'idle' ? (
            <button
              onClick={analyze}
              className="flex items-center gap-2 rounded-xl bg-safe px-5 py-3 text-[14px] font-bold text-base shadow-glow-safe transition hover:brightness-110"
            >
              <Send className="h-4 w-4" />
              Forward the suspicious message
            </button>
          ) : (
            <button
              onClick={resetChat}
              className="flex items-center gap-2 rounded-xl border border-hairline bg-black/20 px-5 py-3 text-[14px] font-bold text-ink-dim transition hover:text-ink"
            >
              Try again
            </button>
          )}
          {stage === 'thinking' && (
            <span className="flex items-center gap-2 text-[13px] font-semibold text-cyan">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </span>
          )}
        </div>
      </div>

      {/* right: phone */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-cyan/5 blur-3xl" />
          <div className="relative">
            <ShieldPhone
              lang={lang}
              showForwarded={stage !== 'idle'}
              thinking={stage === 'thinking'}
              showVerdict={stage === 'verdict'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
