import { motion } from 'framer-motion'
import { ALERT_TONE, HEALTH_TONE, SYSTEM_HEALTH as SH } from '../data/panels'
import { AGENTS_BY_ID } from '../data/seed'
import { Bar, Card, Chip, Dot, LineChart, Section, StatTiles } from './widgets'
import AgentIcon from '../components/ui/Icon'
import { cn } from '../lib/utils'

function loadColor(load) {
  if (load >= 85) return '#F43F5E'
  if (load >= 70) return '#F5A524'
  return '#34D399'
}

export default function SystemHealthPanel() {
  const degraded = SH.agents.filter((a) => a.health !== 'green').length

  return (
    <>
      <Section title="Availability">
        <Card className="flex items-end justify-between gap-4">
          <div>
            <div className="mono-tnum text-[34px] font-extrabold leading-none text-safe text-glow-safe">
              {SH.uptime.toFixed(3)}
              <span className="text-[20px]">%</span>
            </div>
            <div className="mt-1.5 text-[11px] text-ink-faint">
              {SH.window} · {SH.incidents} incidents
            </div>
          </div>
          <div className="text-right text-[11px] text-ink-faint">
            <div>
              Last restart
              <div className="mono-tnum text-ink-dim">{SH.lastRestart}</div>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Fleet">
        <StatTiles
          cols={4}
          items={[
            { label: 'Agents', value: SH.agents.length },
            {
              label: 'Healthy',
              value: SH.agents.length - degraded,
              color: '#34D399',
            },
            { label: 'Degraded', value: degraded, color: degraded ? '#F5A524' : undefined },
            { label: 'Down', value: 0 },
          ]}
        />
      </Section>

      <Section title="Per-agent health">
        <div className="space-y-1.5">
          {SH.agents.map((a, i) => {
            const tone = HEALTH_TONE[a.health]
            const agent = AGENTS_BY_ID[a.id]
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.28 }}
                className="rounded-xl border border-hairline/80 bg-black/25 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <Dot color={tone.dot} pulse={a.health !== 'green'} size={8} />
                  {agent && (
                    <AgentIcon
                      name={agent.icon}
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: agent.color }}
                      strokeWidth={2.2}
                    />
                  )}
                  <span className="flex-1 truncate text-[12.5px] font-semibold text-ink">
                    {a.name}
                  </span>
                  <Chip className={cn('bg-white/5', tone.text)}>{tone.label}</Chip>
                  <span className="mono-tnum w-14 shrink-0 text-right text-[11px] text-ink-dim">
                    {a.latency}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">
                    Load
                  </span>
                  <div className="flex-1">
                    <Bar value={a.load} color={loadColor(a.load)} height={4} />
                  </div>
                  <span
                    className="mono-tnum w-8 text-right text-[11px] font-bold"
                    style={{ color: loadColor(a.load) }}
                  >
                    {a.load}%
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <Section title="Latency">
        <Card>
          <LineChart series={SH.latencySeries} accent="#22D3EE" height={112} />
        </Card>
      </Section>

      <Section title="Recent alerts & errors">
        <div className="max-h-[220px] space-y-1.5 overflow-y-auto rounded-xl border border-hairline/80 bg-black/25 p-2">
          {SH.alerts.map((al) => {
            const tone = ALERT_TONE[al.level]
            return (
              <div
                key={al.ts}
                className="flex items-start gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/[0.04]"
              >
                <span className="mono-tnum mt-px shrink-0 text-[10px] text-ink-faint">
                  {al.ts}
                </span>
                <span
                  className={cn(
                    'mt-px shrink-0 rounded px-1 py-px text-[8.5px] font-bold uppercase',
                    tone.chip,
                  )}
                >
                  {tone.label}
                </span>
                <span className="text-[11.5px] leading-snug text-ink-dim">{al.text}</span>
              </div>
            )
          })}
        </div>
      </Section>
    </>
  )
}
