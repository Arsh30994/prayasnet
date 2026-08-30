import { AnimatePresence, motion } from 'framer-motion'
import { DemoProvider, useDemo } from './demo/DemoContext'
import { PanelProvider } from './panels/PanelContext'
import PanelHost from './panels/PanelHost'
import Header from './components/Header'
import KpiStrip from './components/KpiStrip'
import DemoControls from './components/DemoControls'
import OrchestrationVisualizer from './components/OrchestrationVisualizer'
import MainStage from './components/MainStage'
import StatusBar from './components/StatusBar'
import CounterfeitChecker from './components/CounterfeitChecker'
import CrimeMap from './components/CrimeMap'
import { CitizenShieldView } from './components/CitizenShield'

function Shell() {
  const { view } = useDemo()

  return (
    <div className="relative z-10 flex h-screen flex-col">
      <Header />

      {view === 'operations' ? (
        <>
          <KpiStrip />
          {/* pb leaves room for the floating walkthrough controls */}
          <main className="grid min-h-0 flex-1 grid-cols-[minmax(400px,38%)_1fr] gap-4 px-6 pb-[76px]">
            <OrchestrationVisualizer />
            <MainStage />
          </main>
        </>
      ) : (
        <main className="min-h-0 flex-1 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              {view === 'shield' && <CitizenShieldView />}
              {view === 'counterfeit' && <CounterfeitChecker />}
              {view === 'map' && <CrimeMap />}
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      <StatusBar />
      <DemoControls />
      <PanelHost />
    </div>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <PanelProvider>
        <div className="app-backdrop" />
        <Shell />
      </PanelProvider>
    </DemoProvider>
  )
}
