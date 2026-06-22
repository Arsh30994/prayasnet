import { Lock, Cpu, Wifi } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { PHASE_LABEL } from '../demo/timeline'

export default function StatusBar() {
  const { state, view } = useDemo()
  const activeAgents = Object.values(state.agents).filter((s) => s !== 'idle').length

  return (
    <footer className="relative z-10 flex items-center justify-between border-t border-hairline/70 bg-black/30 px-6 py-1.5 text-[10.5px] text-ink-faint">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-safe">
          <Lock className="h-3 w-3" />
          SECURE LINK
        </span>
        <span className="flex items-center gap-1.5">
          <Wifi className="h-3 w-3 text-cyan" />
          NODE · IN-DEL-01
        </span>
        <span className="hidden md:inline">CLASSIFICATION: RESTRICTED // PROTOTYPE</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-cyan" />
          AGENTS ONLINE: <span className="mono-tnum text-ink-dim">{activeAgents}/6</span>
        </span>
        <span className="uppercase tracking-wide">
          {view === 'operations' ? PHASE_LABEL[state.phase] : view}
        </span>
        <span className="mono-tnum text-ink-dim">PRAYASNET v1.0</span>
      </div>
    </footer>
  )
}
