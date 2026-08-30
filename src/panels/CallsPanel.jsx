import { BLOCKED_CALLS, BLOCKED_CALLS_TOTAL } from '../data/panels'
import { Section, StatTiles, TableShell, Td, Th } from './widgets'

export default function CallsPanel() {
  const spoofed = BLOCKED_CALLS.filter((c) => c.caller.startsWith('VoIP')).length
  const blacklisted = BLOCKED_CALLS.filter((c) => c.action.includes('blacklisted')).length

  return (
    <>
      <Section title="Today's interception summary">
        <StatTiles
          cols={2}
          items={[
            {
              label: 'Blocked today',
              value: BLOCKED_CALLS_TOTAL.toLocaleString('en-IN'),
              color: '#22D3EE',
            },
            { label: 'Avg detection', value: '6.2 s', sub: 'from call pickup' },
            { label: 'VoIP spoofed', value: `${spoofed}/${BLOCKED_CALLS.length}`, sub: 'in latest batch' },
            { label: 'Numbers blacklisted', value: blacklisted, sub: 'pushed to telecom' },
          ]}
        />
      </Section>

      <Section title="Call block log">
        <TableShell maxHeight={360}>
          <thead>
            <tr>
              <Th>Caller</Th>
              <Th>Location</Th>
              <Th>Time</Th>
              <Th>Scam type</Th>
              <Th>Action taken</Th>
            </tr>
          </thead>
          <tbody>
            {BLOCKED_CALLS.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-white/[0.04]">
                <Td className="whitespace-nowrap">
                  <div className="mono-tnum font-semibold text-ink">{c.caller}</div>
                  <div className="mono-tnum text-[9.5px] text-ink-faint">{c.id}</div>
                </Td>
                <Td className="whitespace-nowrap text-ink-dim">{c.location}</Td>
                <Td className="mono-tnum whitespace-nowrap text-ink-dim">{c.ts}</Td>
                <Td className="whitespace-nowrap font-semibold text-amber">{c.type}</Td>
                <Td className="whitespace-nowrap text-ink-dim">{c.action}</Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <p className="mt-2 text-[10.5px] text-ink-faint">
          Showing latest {BLOCKED_CALLS.length} of{' '}
          {BLOCKED_CALLS_TOTAL.toLocaleString('en-IN')} blocked today · scroll for more
        </p>
      </Section>
    </>
  )
}
