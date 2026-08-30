import { motion } from 'framer-motion'
import { MapPinned, Siren, Radar } from 'lucide-react'
import { HOTSPOTS, PATROL_PRIORITY } from '../data/seed'
import { INDIA_PATH, levelColor } from '../lib/india'
import { cn } from '../lib/utils'

const PRIORITY_TONE = {
  Critical: 'text-danger bg-danger/15',
  High: 'text-amber bg-amber/15',
  Elevated: 'text-cyan bg-cyan/15',
}

export default function CrimeMap() {
  return (
    <div className="grid h-full grid-cols-3 gap-6 px-8 py-2">
      {/* map */}
      <div className="glass relative col-span-2 overflow-hidden rounded-2xl shadow-panel">
        <div className="flex items-center justify-between border-b border-hairline/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-500/15" style={{ background: 'rgba(56,189,248,0.15)' }}>
              <MapPinned className="h-4 w-4" style={{ color: '#38BDF8' }} />
            </span>
            <div>
              <h3 className="text-[13px] font-bold text-ink">Geospatial Threat Map</h3>
              <p className="text-[10px] text-ink-faint">Fraud density · live hotspots</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-faint">
            <Radar className="h-3.5 w-3.5 animate-pulse text-cyan" />
            sweeping
          </span>
        </div>

        <div className="relative h-[calc(100%-56px)] w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
            {/* graticule */}
            {Array.from({ length: 11 }).map((_, i) => (
              <g key={i} stroke="#22D3EE" strokeOpacity="0.05" strokeWidth="0.2">
                <line x1={i * 10} y1="0" x2={i * 10} y2="100" />
                <line x1="0" y1={i * 10} x2="100" y2={i * 10} />
              </g>
            ))}

            {/* India silhouette */}
            <path
              d={INDIA_PATH}
              fill="url(#indiaFill)"
              stroke="#38BDF8"
              strokeOpacity="0.5"
              strokeWidth="0.4"
              strokeLinejoin="round"
            />
            <defs>
              <radialGradient id="indiaFill" cx="45%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#16223C" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0E1628" stopOpacity="0.9" />
              </radialGradient>
            </defs>

            {/* hotspots */}
            {HOTSPOTS.map((h) => {
              const color = levelColor(h.level)
              const r = 0.9 + h.level * 1.6
              return (
                <g key={h.id}>
                  {/* radiating pulse */}
                  <motion.circle
                    cx={h.x}
                    cy={h.y}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.4"
                    initial={{ opacity: 0.7, scale: 1 }}
                    animate={{ opacity: 0, scale: 4 }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: h.x % 1.3,
                    }}
                    style={{ transformOrigin: `${h.x}px ${h.y}px` }}
                  />
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={r}
                    fill={color}
                    style={{ filter: `drop-shadow(0 0 2px ${color})` }}
                  />
                </g>
              )
            })}
          </svg>

          {/* city labels (HTML overlay for crisp text) */}
          {HOTSPOTS.map((h) => (
            <div
              key={h.id}
              className="pointer-events-none absolute -translate-x-1/2 translate-y-1.5 text-center"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <div className="whitespace-nowrap text-[9px] font-semibold text-ink-dim">
                {h.city}
              </div>
              <div className="mono-tnum text-[8px]" style={{ color: levelColor(h.level) }}>
                {h.cases} cases
              </div>
            </div>
          ))}

          {/* legend */}
          <div className="absolute bottom-3 left-3 flex gap-3 rounded-xl border border-hairline/70 bg-black/40 px-3 py-2 backdrop-blur">
            {[
              { c: '#F43F5E', l: 'Critical' },
              { c: '#F5A524', l: 'High' },
              { c: '#22D3EE', l: 'Moderate' },
            ].map((x) => (
              <div key={x.l} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: x.c }} />
                <span className="text-[10px] text-ink-dim">{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* patrol priority */}
      <div className="glass flex flex-col overflow-hidden rounded-2xl shadow-panel">
        <div className="flex items-center gap-2 border-b border-hairline/70 px-4 py-3">
          <Siren className="h-4 w-4 text-amber" />
          <h3 className="text-[13px] font-bold text-ink">Patrol Priority</h3>
        </div>
        <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
          {PATROL_PRIORITY.map((p, i) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-hairline/70 bg-black/20 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/5 mono-tnum text-[12px] font-bold text-ink">
                    {p.rank}
                  </span>
                  <span className="text-[13px] font-bold text-ink">{p.zone}</span>
                </div>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[9px] font-bold uppercase',
                    PRIORITY_TONE[p.level],
                  )}
                >
                  {p.level}
                </span>
              </div>
              <p className="mt-1.5 pl-8 text-[11.5px] text-ink-dim">{p.reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
