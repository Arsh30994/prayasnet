import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, IndianRupee, PhoneOff, Banknote, TrendingUp } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { KPIS } from '../data/seed'
import AnimatedNumber from './ui/AnimatedNumber'
import { cn } from '../lib/utils'

const ICONS = { AlertTriangle, IndianRupee, PhoneOff, Banknote }
const TONE = {
  danger: { text: 'text-danger', ring: 'ring-danger/25', glow: 'from-danger/10' },
  safe: { text: 'text-safe', ring: 'ring-safe/25', glow: 'from-safe/10' },
  cyan: { text: 'text-cyan', ring: 'ring-cyan/25', glow: 'from-cyan/10' },
  amber: { text: 'text-amber', ring: 'ring-amber/25', glow: 'from-amber/10' },
}

export default function KpiStrip() {
  const { state } = useDemo()

  return (
    <div className="relative z-10 grid grid-cols-4 gap-3 px-6 py-3">
      {KPIS.map((kpi) => {
        const Icon = ICONS[kpi.icon]
        const tone = TONE[kpi.tone]
        let value = kpi.value
        if (kpi.id === 'saved') value = state.savedTotal
        if (kpi.id === 'threats') value = state.threatsActive
        if (kpi.id === 'calls' && state.phase !== 'idle') value = kpi.value + 1
        const boosted = kpi.id === 'saved' && state.savedBoosted

        return (
          <motion.div
            key={kpi.id}
            layout
            className={cn(
              'glass relative overflow-hidden rounded-2xl px-4 py-3 ring-1 transition-shadow duration-500',
              tone.ring,
              boosted && 'shadow-glow-safe',
            )}
          >
            <div
              className={cn(
                'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br to-transparent blur-2xl',
                tone.glow,
              )}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                {kpi.label}
              </span>
              <Icon className={cn('h-4 w-4', tone.text)} />
            </div>
            <div className="mt-1.5 flex items-end gap-2">
              <AnimatedNumber
                value={value}
                money={kpi.money}
                compact={kpi.money}
                className={cn('mono-tnum text-[26px] font-extrabold leading-none', tone.text)}
              />
              <AnimatePresence>
                {boosted && (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-0.5 flex items-center gap-0.5 text-[11px] font-bold text-safe"
                  >
                    <TrendingUp className="h-3 w-3" />
                    +₹4.8L
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
