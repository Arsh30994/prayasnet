import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Check, Loader2 } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { AGENTS } from '../data/seed'
import AgentIcon from './ui/Icon'
import { cn } from '../lib/utils'

const RAD = 36 // ring radius in % of the square
const CENTER = 50

function pos(angleDeg) {
  const a = (angleDeg * Math.PI) / 180
  return { x: CENTER + RAD * Math.cos(a), y: CENTER + RAD * Math.sin(a) }
}

const RESULT = {
  scam: 'SCAM · 94%',
  graph: '203 nodes',
  fusion: 'Package ready',
  shield: 'Citizen warned',
}

function AgentNode({ agent, status }) {
  const { x, y } = pos(agent.angle)
  const active = status === 'waking' || status === 'thinking'
  const done = status === 'done'
  const dim = status === 'idle'

  return (
    <div
      className="absolute z-20"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        animate={{
          scale: active ? 1.06 : 1,
          opacity: dim ? 0.5 : 1,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex w-[120px] flex-col items-center"
      >
        {/* node disc */}
        <div className="relative">
          {/* pulse ring when active */}
          <AnimatePresence>
            {active && (
              <motion.span
                key="ring"
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: `0 0 0 2px ${agent.color}` }}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          <div
            className="relative grid h-14 w-14 place-items-center rounded-2xl border transition-all duration-500"
            style={{
              borderColor: dim ? '#1E2A44' : `${agent.color}`,
              background: dim
                ? 'rgba(17,28,50,0.8)'
                : `radial-gradient(circle at 50% 30%, ${agent.color}33, rgba(11,17,32,0.9))`,
              boxShadow: active || done ? `0 0 22px -2px ${agent.color}aa` : 'none',
            }}
          >
            <AgentIcon
              name={agent.icon}
              className="h-6 w-6 transition-colors duration-500"
              style={{ color: dim ? '#5C7196' : agent.color }}
              strokeWidth={2}
            />

            {/* thinking shimmer */}
            {status === 'thinking' && (
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <span
                  className="absolute inset-y-0 -left-full w-full animate-shimmer"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${agent.color}55, transparent)`,
                  }}
                />
              </span>
            )}

            {/* done check badge */}
            <AnimatePresence>
              {done && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-safe text-base ring-2 ring-base"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* label */}
        <div className="mt-2 text-center">
          <div
            className="text-[11px] font-bold leading-tight transition-colors duration-500"
            style={{ color: dim ? '#7A90B4' : '#E6EDF7' }}
          >
            {agent.name.replace(' Agent', '')}
          </div>
          {/* status line */}
          <div className="mt-0.5 flex h-4 items-center justify-center">
            <AnimatePresence mode="wait">
              {status === 'thinking' && (
                <motion.span
                  key="think"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide"
                  style={{ color: agent.color }}
                >
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  analyzing
                </motion.span>
              )}
              {status === 'waking' && (
                <motion.span
                  key="wake"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] font-semibold uppercase tracking-wide"
                  style={{ color: agent.color }}
                >
                  waking…
                </motion.span>
              )}
              {done && RESULT[agent.id] && (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: `${agent.color}22`, color: agent.color }}
                >
                  {RESULT[agent.id]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function OrchestrationVisualizer() {
  const { state } = useDemo()
  const orchActive = state.orchestrator !== 'idle'
  const orchComplete = state.orchestrator === 'complete'

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl shadow-panel">
      {/* header */}
      <div className="flex items-center justify-between border-b border-hairline/70 px-4 py-3">
        <div>
          <h2 className="text-[13px] font-bold tracking-wide text-ink">
            Multi-Agent Orchestration
          </h2>
          <p className="text-[11px] text-ink-faint">Autonomous agent mesh · live</p>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
            orchActive ? 'bg-cyan/15 text-cyan' : 'bg-white/5 text-ink-faint',
          )}
        >
          {orchComplete ? 'Mission complete' : orchActive ? 'Coordinating' : 'Idle'}
        </span>
      </div>

      {/* stage */}
      <div className="relative flex flex-1 items-center justify-center p-2">
        <div className="relative aspect-square w-full max-h-full max-w-[min(100%,560px)]">
          {/* connection layer */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {/* faint orbit ring */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RAD}
              fill="none"
              stroke="#1E2A44"
              strokeWidth="0.2"
              strokeDasharray="0.6 0.8"
            />
            {AGENTS.map((agent) => {
              const { x, y } = pos(agent.angle)
              const status = state.agents[agent.id]
              const energized = status === 'waking' || status === 'thinking'
              const done = status === 'done'
              const lit = energized || done
              return (
                <g key={agent.id}>
                  {/* base line */}
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={x}
                    y2={y}
                    stroke={lit ? agent.color : '#16223C'}
                    strokeWidth={lit ? 0.5 : 0.3}
                    strokeOpacity={lit ? 0.55 : 0.6}
                    style={{ transition: 'stroke 0.5s, stroke-opacity 0.5s' }}
                  />
                  {/* flowing dashes when energized */}
                  {energized && (
                    <motion.line
                      x1={CENTER}
                      y1={CENTER}
                      x2={x}
                      y2={y}
                      stroke={agent.color}
                      strokeWidth={0.55}
                      strokeLinecap="round"
                      strokeDasharray="0.5 2.2"
                      animate={{ strokeDashoffset: [0, -8] }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {/* traveling pulse */}
                  {energized && (
                    <motion.circle
                      r={0.9}
                      fill={agent.color}
                      initial={{ cx: CENTER, cy: CENTER, opacity: 0 }}
                      animate={{
                        cx: [CENTER, x],
                        cy: [CENTER, y],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ filter: `drop-shadow(0 0 1px ${agent.color})` }}
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* agent nodes */}
          {AGENTS.map((agent) => (
            <AgentNode key={agent.id} agent={agent} status={state.agents[agent.id]} />
          ))}

          {/* orchestrator hub */}
          <div
            className="absolute z-30"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
          >
            {/* outer pulse rings */}
            <AnimatePresence>
              {orchActive && !orchComplete && (
                <>
                  {[0, 0.6].map((delay) => (
                    <motion.span
                      key={delay}
                      className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ boxShadow: '0 0 0 1.5px #22D3EE' }}
                      initial={{ opacity: 0.6, scale: 0.8 }}
                      animate={{ opacity: 0, scale: 2.1 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <motion.div
              animate={{
                boxShadow: orchActive
                  ? ['0 0 24px -2px #22D3EEaa', '0 0 40px 0px #22D3EEcc', '0 0 24px -2px #22D3EEaa']
                  : '0 0 0px #22D3EE00',
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative grid h-20 w-20 place-items-center rounded-full border-2 bg-gradient-to-br from-elevated to-base"
              style={{ borderColor: orchComplete ? '#34D399' : '#22D3EE' }}
            >
              {/* rotating accent ring */}
              <motion.span
                className="absolute inset-1 rounded-full border border-dashed"
                style={{ borderColor: '#22D3EE44' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative flex flex-col items-center">
                <Cpu
                  className="h-7 w-7"
                  style={{ color: orchComplete ? '#34D399' : '#22D3EE' }}
                  strokeWidth={2}
                />
              </div>
            </motion.div>
            <div className="mt-2 text-center">
              <div className="text-[12px] font-extrabold tracking-wide text-cyan text-glow-cyan">
                ORCHESTRATOR
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-hairline/70 px-4 py-2.5">
        {AGENTS.map((a) => {
          const status = state.agents[a.id]
          const lit = status !== 'idle'
          return (
            <div key={a.id} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full transition-opacity duration-500"
                style={{ background: a.color, opacity: lit ? 1 : 0.35 }}
              />
              <span
                className="text-[10px] font-medium transition-colors duration-500"
                style={{ color: lit ? '#9AB0CE' : '#5C7196' }}
              >
                {a.short}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
