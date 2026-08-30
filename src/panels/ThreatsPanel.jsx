import { useMemo, useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import {
  ACTIVE_THREATS,
  SEVERITY_ORDER,
  SEVERITY_TONE,
  THREAT_STATUS_TONE,
} from '../data/panels'
import { Chip, Dot, Section, StatTiles, TableShell, Td, Th } from './widgets'
import Tile from '../components/ui/Tile'
import { cn } from '../lib/utils'

const FILTERS = ['All', ...SEVERITY_ORDER]

export default function ThreatsPanel() {
  const [filter, setFilter] = useState('All')
  const [sortDesc, setSortDesc] = useState(true)

  const counts = useMemo(() => {
    const c = { All: ACTIVE_THREATS.length }
    SEVERITY_ORDER.forEach((s) => {
      c[s] = ACTIVE_THREATS.filter((t) => t.severity === s).length
    })
    return c
  }, [])

  const rows = useMemo(() => {
    const list =
      filter === 'All' ? ACTIVE_THREATS : ACTIVE_THREATS.filter((t) => t.severity === filter)
    const rank = (t) => SEVERITY_ORDER.indexOf(t.severity)
    return [...list].sort((a, b) => (sortDesc ? rank(a) - rank(b) : rank(b) - rank(a)))
  }, [filter, sortDesc])

  return (
    <>
      <Section title="Breakdown by severity">
        <StatTiles
          cols={4}
          items={SEVERITY_ORDER.map((s) => ({
            label: s,
            value: counts[s],
            color: SEVERITY_TONE[s].dot,
          }))}
        />
      </Section>

      <Section
        title="Threat register"
        right={
          <Tile
            onClick={() => setSortDesc((v) => !v)}
            accent="rgba(34, 211, 238, 0.5)"
            lift={2}
            className="flex items-center gap-1.5 rounded-lg border border-hairline bg-black/25 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-dim"
            aria-label="Toggle severity sort order"
          >
            <ArrowDownUp className="h-3 w-3" />
            {sortDesc ? 'Critical first' : 'Low first'}
          </Tile>
        }
      >
        <div className="mb-2 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const on = filter === f
            const tone = SEVERITY_TONE[f]
            return (
              <Tile
                key={f}
                onClick={() => setFilter(f)}
                lift={2}
                accent={tone ? `${tone.dot}80` : 'rgba(34, 211, 238, 0.5)'}
                aria-pressed={on}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10.5px] font-bold',
                  on
                    ? 'border-transparent bg-white/[0.09] text-ink'
                    : 'border-hairline bg-black/20 text-ink-dim',
                )}
              >
                {tone && <Dot color={tone.dot} size={6} />}
                {f}
                <span className="mono-tnum text-ink-faint">{counts[f]}</span>
              </Tile>
            )
          })}
        </div>

        <TableShell maxHeight={330}>
          <thead>
            <tr>
              <Th>Type</Th>
              <Th>Location</Th>
              <Th>Severity</Th>
              <Th>Time</Th>
              <Th>Status</Th>
              <Th>Agent</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const tone = SEVERITY_TONE[t.severity]
              return (
                <tr key={t.id} className="transition-colors hover:bg-white/[0.04]">
                  <Td className="max-w-[168px]">
                    <div className="truncate font-semibold text-ink" title={t.type}>
                      {t.type}
                    </div>
                    <div className="mono-tnum text-[9.5px] text-ink-faint">{t.id}</div>
                  </Td>
                  <Td className="whitespace-nowrap text-ink-dim">{t.location}</Td>
                  <Td>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Dot color={tone.dot} pulse={t.severity === 'Critical'} size={7} />
                      <span className={cn('font-semibold', tone.text)}>{t.severity}</span>
                    </span>
                  </Td>
                  <Td className="mono-tnum whitespace-nowrap text-ink-dim">{t.ts}</Td>
                  <Td>
                    <Chip className={THREAT_STATUS_TONE[t.status] || 'bg-white/5 text-ink-dim'}>
                      {t.status}
                    </Chip>
                  </Td>
                  <Td className="whitespace-nowrap text-[11px] text-ink-dim">{t.agent}</Td>
                </tr>
              )
            })}
          </tbody>
        </TableShell>
        <p className="mt-2 text-[10.5px] text-ink-faint">
          Showing {rows.length} of {ACTIVE_THREATS.length} active threats · scroll for more
        </p>
      </Section>
    </>
  )
}
