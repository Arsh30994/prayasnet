import { SAVINGS_BY_CATEGORY, SAVINGS_TREND } from '../data/panels'
import { Bar, Card, Section, StatTiles, TrendChart } from './widgets'
import { formatINRCompact } from '../lib/utils'

export default function SavingsPanel() {
  const total = SAVINGS_BY_CATEGORY.reduce((s, c) => s + c.value, 0)
  const cases = SAVINGS_BY_CATEGORY.reduce((s, c) => s + c.cases, 0)
  const peak = SAVINGS_TREND.reduce((b, d) => (d.value > b.value ? d : b), SAVINGS_TREND[0])

  return (
    <>
      <Section title="Today at a glance">
        <StatTiles
          cols={2}
          items={[
            { label: 'Total saved', value: formatINRCompact(total), color: '#34D399' },
            { label: 'Interventions', value: cases.toLocaleString('en-IN'), sub: 'across 5 categories' },
            { label: 'Peak hour', value: `${peak.hour}:00`, sub: formatINRCompact(peak.value) },
            {
              label: 'Avg per case',
              value: formatINRCompact(Math.round(total / cases)),
              sub: 'money kept with citizens',
            },
          ]}
        />
      </Section>

      <Section title="Savings trend · last 24 hours">
        <Card>
          <TrendChart data={SAVINGS_TREND} accent="#34D399" height={150} />
        </Card>
      </Section>

      <Section title="By fraud category">
        <div className="space-y-2">
          {SAVINGS_BY_CATEGORY.map((c) => {
            const share = (c.value / total) * 100
            return (
              <Card key={c.id} className="px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: c.color, boxShadow: `0 0 8px ${c.color}aa` }}
                    />
                    <span className="text-[12.5px] font-semibold text-ink">{c.label}</span>
                    <span className="mono-tnum text-[10px] text-ink-faint">
                      {c.cases} cases
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className="mono-tnum text-[13px] font-bold leading-none"
                      style={{ color: c.color }}
                    >
                      {formatINRCompact(c.value)}
                    </div>
                    <div className="mono-tnum text-[9.5px] text-ink-faint">
                      {share.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Bar value={share} color={c.color} />
                </div>
              </Card>
            )
          })}
        </div>
      </Section>
    </>
  )
}
