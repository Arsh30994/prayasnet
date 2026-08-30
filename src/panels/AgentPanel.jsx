import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Radio } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { AGENTS_BY_ID } from '../data/seed'
import { AGENT_ACTIVITY } from '../data/panels'
import { Card, Dot, LogStream, Section, StatTiles } from './widgets'
import { cn } from '../lib/utils'

// The mesh tracks four internal states; the panel reports them in the
// operator's vocabulary.
const STATUS = {
  idle: { label: 'Idle', color: '#5C7196', pulse: false },
  waking: { label: 'Active', color: '#22D3EE', pulse: true },
  thinking: { label: 'Processing', color: '#F5A524', pulse: true },
  done: { label: 'Complete', color: '#34D399', pulse: false },
}

// Throughput drifts around its baseline so the number reads as a live meter
// rather than a static label.
function useLiveThroughput(base) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    setValue(base)
    const id = setInterval(() => {
      const drift = (Math.random() - 0.5) * 0.12
      setValue(Math.max(1, Math.round(base * (1 + drift))))
    }, 2000)
    return () => clearInterval(id)
  }, [base])
  return value
}

export default function AgentPanel({ agentId }) {
  const { state } = useDemo()
  const agent = AGENTS_BY_ID[agentId]
  const activity = AGENT_ACTIVITY[agentId]
  const raw = state.agents[agentId] || 'idle'
  const status = STATUS[raw] || STATUS.idle

  const base = Number(String(activity.throughput).replace(/,/g, ''))
  const live = useLiveThroughput(base)

  return (
    <>
      <Section title="Current status">
        <Card className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Dot color={status.color} pulse={status.pulse} size={9} />
            <div>
              <div
                className="text-[15px] font-extrabold leading-none"
                style={{ color: status.color }}
              >
                {status.label}
              </div>
              <div className="mt-1 text-[11px] text-ink-faint">{agent.desc}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <motion.span
                key={live}
                initial={{ opacity: 0.4, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mono-tnum text-[20px] font-extrabold leading-none"
                style={{ color: agent.color }}
              >
                {live.toLocaleString('en-IN')}
              </motion.span>
              <span className="text-[11px] font-semibold text-ink-faint">
                {activity.throughputUnit}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-ink-faint">
              <Radio className="h-3 w-3" style={{ color: agent.color }} />
              live throughput
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Capacity">
        <StatTiles
          cols={4}
          items={[
            { label: 'Queue', value: activity.queue },
            { label: 'Accuracy', value: activity.accuracy, color: '#34D399' },
            { label: 'Lane', value: agent.metric.split(' / ')[0] },
            { label: 'Node', value: agent.short, color: agent.color },
          ]}
        />
      </Section>

      <Section title="Last 5 actions">
        <ol className="space-y-1.5">
          {activity.actions.map((a, i) => (
            <motion.li
              key={a.ts}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.28 }}
              className="flex items-start gap-2.5 rounded-xl border border-hairline/80 bg-black/25 px-3 py-2"
            >
              <span
                className="mono-tnum mt-px shrink-0 text-[10.5px] font-bold"
                style={{ color: agent.color }}
              >
                {a.ts}
              </span>
              <span className="text-[11.5px] leading-snug text-ink-dim">{a.text}</span>
            </motion.li>
          ))}
        </ol>
      </Section>

      <Section
        title="Log stream"
        right={
          <span
            className={cn('flex items-center gap-1 text-[10px] font-semibold text-ink-faint')}
          >
            <Activity className="h-3 w-3" style={{ color: agent.color }} />
            streaming
          </span>
        }
      >
        <LogStream lines={activity.log} accent={agent.color} rows={8} />
      </Section>
    </>
  )
}
