import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { AGENTS, AGENTS_BY_ID } from '../data/seed'
import { ALERT_TONE, ORCHESTRATION_FLOW, ORCHESTRATION_LOG, ORCHESTRATION_STATS } from '../data/panels'
import AgentIcon from '../components/ui/Icon'
import { Card, Section, StatTiles } from './widgets'
import { cn } from '../lib/utils'

const CENTER = 50
const RAD = 34
const HOP_MS = 2200

function pos(id) {
  if (id === 'orchestrator') return { x: CENTER, y: CENTER }
  const agent = AGENTS_BY_ID[id]
  const a = (agent.angle * Math.PI) / 180
  return { x: CENTER + RAD * Math.cos(a), y: CENTER + RAD * Math.sin(a) }
}

function label(id) {
  return id === 'orchestrator' ? 'Orchestrator' : AGENTS_BY_ID[id].name.replace(' Agent', '')
}

// Steps through the recorded routing hops so the diagram shows one signal in
// flight at a time — the same shape the orchestrator log describes in words.
function useHopCycle(length) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % length), HOP_MS)
    return () => clearInterval(id)
  }, [length])
  return i
}

export default function OrchestratorPanel() {
  const hopIndex = useHopCycle(ORCHESTRATION_FLOW.length)
  const hop = ORCHESTRATION_FLOW[hopIndex]
  const from = pos(hop.from)
  const to = pos(hop.to)

  return (
    <>
      <Section title="Signal flow · live">
        <Card className="p-2">
          <div className="relative mx-auto h-[248px] w-[248px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RAD}
                fill="none"
                stroke="#1E2A44"
                strokeWidth="0.25"
                strokeDasharray="0.7 0.9"
              />

              {/* every spoke, dim by default */}
              {AGENTS.map((a) => {
                const p = pos(a.id)
                const onPath = hop.from === a.id || hop.to === a.id
                return (
                  <line
                    key={a.id}
                    x1={CENTER}
                    y1={CENTER}
                    x2={p.x}
                    y2={p.y}
                    stroke={onPath ? hop.color : '#16223C'}
                    strokeWidth={onPath ? 0.55 : 0.3}
                    strokeOpacity={onPath ? 0.8 : 0.6}
                    style={{ transition: 'stroke 0.4s, stroke-width 0.4s' }}
                  />
                )
              })}

              {/* the hop currently in flight */}
              <motion.circle
                key={hopIndex}
                r="1.4"
                fill={hop.color}
                initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 1, 1, 0] }}
                transition={{ duration: HOP_MS / 1000, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: `drop-shadow(0 0 2px ${hop.color})` }}
              />

              {/* agent discs */}
              {AGENTS.map((a) => {
                const p = pos(a.id)
                const lit = hop.from === a.id || hop.to === a.id
                return (
                  <circle
                    key={`d-${a.id}`}
                    cx={p.x}
                    cy={p.y}
                    r="4.6"
                    fill="#0E1628"
                    stroke={lit ? a.color : '#1E2A44'}
                    strokeWidth={lit ? 0.7 : 0.4}
                    style={{
                      transition: 'stroke 0.4s',
                      filter: lit ? `drop-shadow(0 0 3px ${a.color}aa)` : 'none',
                    }}
                  />
                )
              })}

              <circle
                cx={CENTER}
                cy={CENTER}
                r="7.5"
                fill="#0E1628"
                stroke="#22D3EE"
                strokeWidth="0.8"
                style={{ filter: 'drop-shadow(0 0 4px #22D3EEaa)' }}
              />
            </svg>

            {/* crisp HTML icons + labels on top of the SVG geometry */}
            {AGENTS.map((a) => {
              const p = pos(a.id)
              const lit = hop.from === a.id || hop.to === a.id
              return (
                <div
                  key={`n-${a.id}`}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div className="flex flex-col items-center">
                    <AgentIcon
                      name={a.icon}
                      className="h-3.5 w-3.5 transition-colors duration-300"
                      style={{ color: lit ? a.color : '#5C7196' }}
                      strokeWidth={2.2}
                    />
                    <span
                      className="mt-2.5 whitespace-nowrap text-[8.5px] font-bold transition-colors duration-300"
                      style={{ color: lit ? '#E6EDF7' : '#5C7196' }}
                    >
                      {a.short}
                    </span>
                  </div>
                </div>
              )
            })}
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: '50%', top: '50%' }}
            >
              <Cpu className="h-5 w-5 text-cyan" strokeWidth={2} />
            </div>
          </div>

          {/* what is on the wire right now */}
          <div className="mt-1 flex h-11 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={hopIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 rounded-full border border-hairline bg-black/40 px-3 py-1.5"
              >
                <span className="text-[10.5px] font-semibold text-ink-dim">
                  {label(hop.from)}
                </span>
                <span style={{ color: hop.color }}>→</span>
                <span className="text-[10.5px] font-semibold text-ink-dim">{label(hop.to)}</span>
                <span
                  className="mono-tnum rounded px-1.5 py-0.5 text-[9.5px] font-bold"
                  style={{ background: `${hop.color}1f`, color: hop.color }}
                >
                  {hop.signal}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </Section>

      <Section title="Routing performance">
        <StatTiles
          cols={4}
          items={ORCHESTRATION_STATS.map((s) => ({
            label: s.label,
            value: s.value,
            color: s.label === 'Handoff success' ? '#34D399' : undefined,
          }))}
        />
      </Section>

      <Section title="Orchestration decisions">
        <div className="max-h-[260px] space-y-1.5 overflow-y-auto rounded-xl border border-hairline/80 bg-black/25 p-2">
          {ORCHESTRATION_LOG.map((l, i) => {
            const tone = ALERT_TONE[l.level] || ALERT_TONE.info
            return (
              <motion.div
                key={l.ts}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                className="flex items-start gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/[0.04]"
              >
                <span className="mono-tnum mt-px shrink-0 text-[10px] text-ink-faint">
                  {l.ts}
                </span>
                <span
                  className={cn(
                    'mt-px shrink-0 rounded px-1 py-px text-[8.5px] font-bold uppercase',
                    tone.chip,
                  )}
                >
                  {tone.label}
                </span>
                <span className="text-[11.5px] leading-snug text-ink-dim">{l.text}</span>
              </motion.div>
            )
          })}
        </div>
      </Section>
    </>
  )
}
