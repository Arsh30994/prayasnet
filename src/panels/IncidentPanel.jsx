import { FolderOpen, IndianRupee, MapPinned } from 'lucide-react'
import { Card, Chip, IncidentMiniMap, Section, Timeline } from './widgets'
import { usePanel } from './PanelContext'
import { getEvidenceByIncidentId } from '../data/panels'
import Tile from '../components/ui/Tile'
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
  const { openPanel } = usePanel()
  const accent = INCIDENT_ACCENT[incident.sev]
  const hasEvidence = Boolean(getEvidenceByIncidentId(incident.id))

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

      <Section title="Evidence">
        <Tile
          accent="rgba(245,165,36,0.55)"
          onClick={() => openPanel('evidence', { incidentId: incident.id })}
          aria-label="View evidence locker"
          className="flex w-full items-center gap-3 rounded-xl border border-amber/30 bg-amber/[0.08] px-3 py-3"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber/15">
            <FolderOpen className="h-4.5 w-4.5 text-amber" />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-[13px] font-bold text-ink">View Evidence</div>
            <div className="text-[11px] text-ink-faint">
              {hasEvidence
                ? 'Open the evidence locker for this case'
                : 'Locker empty · collection still in progress'}
            </div>
          </div>
        </Tile>
      </Section>
    </>
  )
}
