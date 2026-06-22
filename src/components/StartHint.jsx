import { motion, AnimatePresence } from 'framer-motion'
import { useDemo } from '../demo/DemoContext'

function Key({ children }) {
  return (
    <kbd className="mx-0.5 rounded-md border border-cyan/40 bg-cyan/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-cyan">
      {children}
    </kbd>
  )
}

// Subtle operator hint. Hidden while the scenario is playing so recordings stay clean.
export default function StartHint() {
  const { playing, elapsed, view, state } = useDemo()
  const show = view === 'operations' && !playing

  let content
  if (elapsed === 0) {
    content = (
      <>
        Press <Key>Space</Key> to run the live scenario
      </>
    )
  } else if (state.finished) {
    content = (
      <>
        Press <Key>R</Key> to reset · <Key>L</Key> to replay
      </>
    )
  } else {
    content = (
      <>
        <Key>Space</Key> resume · <Key>R</Key> reset
      </>
    )
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed bottom-9 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-black/60 px-4 py-2 text-[12px] font-medium text-ink-dim backdrop-blur-md">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
