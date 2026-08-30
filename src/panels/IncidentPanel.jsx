import { IndianRupee, MapPinned } from 'lucide-react'
import { Card, Chip, IncidentMiniMap, Section, Timeline } from './widgets'
import { cn } from '../lib/utils'

export const INCIDENT_ACCENT = { high: '#F43F5E', med: '#F5A524', low: '#22D3EE' }

const STATUS_TONE = {
  danger: 'bg-danger/12 text-danger',
  amber: 'bg-amber/12 text-amber',
  safe: 'bg-safe/12 text-safe',
  cyan: 'bg-cyan/12 text-cyan',
}

function Field({ label, value, className }) {
  return (
    <div className="rounded-xl border border-hairline/80 bg-black/25 px-3 py-2">
      <div className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">
        {label}
      </div>
      <div className={cn('mt-1 text-[12.5px] font-semibold text-ink', className)}>{value}</div>
    </div>
  )
}

export default function IncidentPanel({ incident }) {
  const accent = INCIDENT_ACCENT[incident.sev]

  return (
    <>
      <Section
        title="Location"
        right={
          <span className="flex items-center gap-1 text-[10px] text-ink-faint">
            <MapPinned className="h-3 w-3" style={{ color: accent }} />
            {incident.region}
          </span>
        }
      >
        <IncidentMiniMap
          x={incident.x}
          y={incident.y}
          city={incident.city}
          accent={accent}
          radiusLabel={incident.radius}
        />
      </Section>

      <Section title="Incident detail">
        <div className="grid grid-cols-2 gap-2">
          <Field
            label="Type"
            value={
              <span className="flex items-center gap-1.5">
                <Chip style={{ background: `${accent}1f`, color: accent }}>{incident.tag}</Chip>
              </span>
            }
          />
          <Field label="Timestamp" value={incident.fullTs} className="mono-tnum text-[11.5px]" />
          <Field
            label="Status"
            value={
              <Chip className={STATUS_TONE[incident.statusTone] || 'bg-white/5 text-ink-dim'}>
                {incident.status}
              </Chip>
            }
          />
          <Field label="Assigned agent" value={incident.agent} />
        </div>

        <Card className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            <IndianRupee className="h-3.5 w-3.5" style={{ color: accent }} />
            Amount at risk
          </span>
          <span className="mono-tnum text-[15px] font-extrabold" style={{ color: accent }}>
            {incident.amount}
          </span>
        </Card>
      </Section>

      <Section title="Action timeline">
        <Card>
          <Timeline steps={incident.timeline} accent={accent} />
        </Card>
      </Section>
    </>
  )
}
