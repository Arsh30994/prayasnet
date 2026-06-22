import { motion, AnimatePresence } from 'framer-motion'
import { useDemo } from '../demo/DemoContext'
import Dashboard from './Dashboard'
import ScamPanel from './ScamPanel'
import FraudGraph from './FraudGraph'
import IntelPackage from './IntelPackage'
import { CitizenShieldOverlay } from './CitizenShield'

const STAGE_TITLE = {
  dashboard: 'Command Overview',
  scam: 'Scam-Call Agent · Active',
  graph: 'Fraud-Graph Agent · Active',
  intel: 'Fusion Agent · Assembling',
}

const variants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.99 },
}

export default function MainStage() {
  const { state } = useDemo()
  const stage = state.stage

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* breadcrumb — keyed remount fades the new title in (no exit, robust to scrubbing) */}
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
        <motion.span
          key={stage}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-dim"
        >
          {STAGE_TITLE[stage]}
        </motion.span>
      </div>

      {/* stage surface — crossfade between panels (overlap, no blank gap) */}
      <div className="relative min-h-0 flex-1">
        <AnimatePresence>
          <motion.div
            key={stage}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {stage === 'dashboard' && <Dashboard />}
            {stage === 'scam' && <ScamPanel />}
            {stage === 'graph' && <FraudGraph />}
            {stage === 'intel' && <IntelPackage />}
          </motion.div>
        </AnimatePresence>

        {/* citizen shield phone overlay (scripted) */}
        <AnimatePresence>
          <CitizenShieldOverlay />
        </AnimatePresence>
      </div>
    </div>
  )
}
