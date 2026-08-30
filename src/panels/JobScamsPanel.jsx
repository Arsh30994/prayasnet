import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import {
  JOB_SCAMS,
  JOB_SCAMS_TOTAL,
  JOB_SCAM_PLATFORMS,
  JOB_SCAM_STATUS_TONE,
} from '../data/panels'
import { Bar, Card, Chip, Section, StatTiles } from './widgets'
import Tile from '../components/ui/Tile'
import { cn } from '../lib/utils'

const STATUSES = ['All', 'Pending', 'Confirmed', 'Dismissed']

function confidenceColor(v) {
  if (v >= 90) return '#F43F5E'
  if (v >= 80) return '#F5A524'
  return '#22D3EE'
}

export default function JobScamsPanel() {
  const [filter, setFilter] = useState('All')

  const counts = useMemo(() => {
    const c = { All: JOB_SCAMS.length }
    STATUSES.slice(1).forEach((s) => {
      c[s] = JOB_SCAMS.filter((j) => j.status === s).length
    })
    return c
  }, [])

  const rows = filter === 'All' ? JOB_SCAMS : JOB_SCAMS.filter((j) => j.status === filter)

  return (
    <>
      <Section title="Review queue">
        <StatTiles
          cols={4}
          items={[
            { label: 'Flagged', value: JOB_SCAMS_TOTAL, color: '#F5A524' },
            { label: 'Pending', value: counts.Pending, color: '#22D3EE' },
            { label: 'Confirmed', value: counts.Confirmed, color: '#F43F5E' },
            { label: 'Dismissed', value: counts.Dismissed },
          ]}
        />
      </Section>

      <Section
        title="Flagged postings"
        right={
          <div className="flex gap-1.5">
            {STATUSES.map((s) => {
              const on = filter === s
              return (
                <Tile
                  key={s}
                  onClick={() => setFilter(s)}
                  lift={2}
                  accent="rgba(245, 165, 36, 0.5)"
                  aria-pressed={on}
                  className={cn(
                    'rounded-lg border px-2 py-0.5 text-[10px] font-bold',
                    on
                      ? 'border-transparent bg-white/[0.09] text-ink'
                      : 'border-hairline bg-black/20 text-ink-dim',
                  )}
                >
                  {s}
                </Tile>
              )
            })}
          </div>
        }
      >
        <div className="space-y-2">
          {rows.map((j) => {
            const platformColor = JOB_SCAM_PLATFORMS[j.platform] || '#9AB0CE'
            const cColor = confidenceColor(j.confidence)
            return (
              <Card key={j.id} className="px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-bold text-ink">{j.company}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Chip
                        style={{ background: `${platformColor}1f`, color: platformColor }}
                      >
                        {j.platform}
                      </Chip>
                      <span className="flex items-center gap-1 text-[10.5px] text-ink-dim">
                        <MapPin className="h-3 w-3 text-ink-faint" />
                        {j.location}
                      </span>
                      <span className="mono-tnum text-[10px] text-ink-faint">{j.ts}</span>
                    </div>
                  </div>
                  <Chip className={cn('ring-1', JOB_SCAM_STATUS_TONE[j.status])}>
                    {j.status}
                  </Chip>
                </div>

                <p className="mt-2 text-[11px] text-ink-dim">{j.note}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">
                    Confidence
                  </span>
                  <div className="flex-1">
                    <Bar value={j.confidence} color={cColor} height={4} />
                  </div>
                  <span
                    className="mono-tnum w-9 text-right text-[11.5px] font-bold"
                    style={{ color: cColor }}
                  >
                    {j.confidence}%
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
        <p className="mt-2 text-[10.5px] text-ink-faint">
          Showing {rows.length} of {JOB_SCAMS_TOTAL} postings flagged today
        </p>
      </Section>
    </>
  )
}
