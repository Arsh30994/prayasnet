import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { INDIA_PATH, levelColor } from '../lib/india'
import { HOTSPOTS } from '../data/seed'
import { formatINRCompact } from '../lib/utils'
import { cn } from '../lib/utils'

// ── Layout ────────────────────────────────────────────────────────────────
export function Section({ title, right, children, className }) {
  return (
    <section className={cn('mb-5', className)}>
      {(title || right) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            {title}
          </h3>
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

export function Card({ children, className }) {
  return (
    <div className={cn('rounded-xl border border-hairline/80 bg-black/25 p-3', className)}>
      {children}
    </div>
  )
}

export function StatTiles({ items, cols = 2 }) {
  return (
    <div className={cn('grid gap-2', cols === 2 ? 'grid-cols-2' : 'grid-cols-4')}>
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-hairline/80 bg-black/25 px-3 py-2.5"
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
            {s.label}
          </div>
          <div
            className={cn('mono-tnum mt-1 text-[17px] font-extrabold leading-none', s.className)}
            style={s.color ? { color: s.color } : undefined}
          >
            {s.value}
          </div>
          {s.sub && <div className="mt-1 text-[10.5px] text-ink-faint">{s.sub}</div>}
        </div>
      ))}
    </div>
  )
}

export function Chip({ children, className, style }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  )
}

export function Dot({ color, pulse = false, size = 8 }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full"
          style={{ background: color, opacity: 0.7 }}
        />
      )}
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, background: color }}
      />
    </span>
  )
}

export function Bar({ value, color, height = 5 }) {
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-black/45"
      style={{ height }}
      role="presentation"
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}88` }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  )
}

// ── Table primitives ──────────────────────────────────────────────────────
export function Th({ children, className, ...rest }) {
  return (
    <th
      className={cn(
        'sticky top-0 z-10 whitespace-nowrap border-b border-hairline bg-surface/95 px-2.5 py-2 text-left',
        'text-[9.5px] font-bold uppercase tracking-wider text-ink-faint backdrop-blur',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

export function Td({ children, className }) {
  return (
    <td className={cn('border-b border-hairline/45 px-2.5 py-2 align-middle', className)}>
      {children}
    </td>
  )
}

export function TableShell({ children, maxHeight = 340 }) {
  return (
    <div
      className="overflow-auto rounded-xl border border-hairline/80 bg-black/20"
      style={{ maxHeight }}
    >
      <table className="w-full border-collapse text-[11.5px]">{children}</table>
    </div>
  )
}

// ── Charts ────────────────────────────────────────────────────────────────
// 24-hour savings trend. Bars keep the hourly reading legible; the overlaid
// line makes the shape of the day readable at a glance.
export function TrendChart({ data, accent = '#34D399', height = 140 }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(...data.map((d) => d.value))
  const W = 240
  const H = 78
  const step = W / data.length
  const barW = step * 0.62

  const pointFor = (d, i) => ({
    x: i * step + step / 2,
    y: H - (d.value / max) * (H - 6),
  })
  const line = data.map((d, i) => {
    const p = pointFor(d, i)
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')

  const active = hover == null ? null : data[hover]

  return (
    <div className="relative">
      <div className="mb-1 flex h-9 items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">
            {active ? `${active.hour}:00 – ${active.hour}:59` : 'Peak hour'}
          </div>
          <div className="mono-tnum text-[14px] font-bold" style={{ color: accent }}>
            {active
              ? formatINRCompact(active.value)
              : `${data.reduce((b, d) => (d.value > b.value ? d : b), data[0]).hour}:00 · ${formatINRCompact(max)}`}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">24h total</div>
          <div className="mono-tnum text-[14px] font-bold text-ink">
            {formatINRCompact(data.reduce((s, d) => s + d.value, 0))}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H + 12}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        onMouseLeave={() => setHover(null)}
      >
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1="0"
            x2={W}
            y1={H - g * (H - 6)}
            y2={H - g * (H - 6)}
            stroke="#1E2A44"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
        ))}

        <defs>
          <linearGradient id="trendBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {data.map((d, i) => {
          const p = pointFor(d, i)
          const isHover = hover === i
          return (
            <g key={d.hour} onMouseEnter={() => setHover(i)}>
              <rect x={i * step} y="0" width={step} height={H} fill="transparent" />
              <rect
                x={i * step + (step - barW) / 2}
                y={p.y}
                width={barW}
                height={H - p.y}
                rx="1"
                fill="url(#trendBar)"
                opacity={isHover ? 1 : 0.72}
              />
            </g>
          )
        })}

        <path
          d={line}
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 3px ${accent}aa)` }}
          pointerEvents="none"
        />

        {hover != null && (
          <g pointerEvents="none">
            <line
              x1={pointFor(data[hover], hover).x}
              x2={pointFor(data[hover], hover).x}
              y1="0"
              y2={H}
              stroke={accent}
              strokeWidth="0.6"
              strokeOpacity="0.55"
            />
            <circle
              cx={pointFor(data[hover], hover).x}
              cy={pointFor(data[hover], hover).y}
              r="2.2"
              fill={accent}
            />
          </g>
        )}

        {data.map((d, i) =>
          i % 4 === 0 ? (
            <text
              key={`l-${d.hour}`}
              x={i * step + step / 2}
              y={H + 9}
              textAnchor="middle"
              fill="#5C7196"
              fontSize="6"
              fontFamily="JetBrains Mono, monospace"
            >
              {d.hour}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  )
}

// Latency over time — area + line, with the newest sample called out.
export function LineChart({ series, accent = '#22D3EE', unit = 'ms', height = 110 }) {
  const W = 240
  const H = 72
  const max = Math.max(...series) * 1.15
  const min = Math.min(...series) * 0.85
  const span = max - min || 1
  const pt = (v, i) => ({
    x: (i / (series.length - 1)) * W,
    y: H - ((v - min) / span) * H,
  })
  const path = series.map((v, i) => {
    const p = pt(v, i)
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')
  const area = `${path} L${W},${H} L0,${H} Z`
  const last = pt(series[series.length - 1], series.length - 1)

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-faint">
          p95 gateway latency · last hour
        </span>
        <span className="mono-tnum text-[13px] font-bold" style={{ color: accent }}>
          {series[series.length - 1]} {unit}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="latArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.33, 0.66].map((g) => (
          <line
            key={g}
            x1="0"
            x2={W}
            y1={H * g}
            y2={H * g}
            stroke="#1E2A44"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
        ))}
        <path d={area} fill="url(#latArea)" />
        <path
          d={path}
          fill="none"
          stroke={accent}
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${accent}aa)` }}
        />
        <circle cx={last.x} cy={last.y} r="2.4" fill={accent} />
        <circle cx={last.x} cy={last.y} r="4.5" fill="none" stroke={accent} strokeOpacity="0.4" />
      </svg>
    </div>
  )
}

// ── Live log stream ───────────────────────────────────────────────────────
// Appends one line from `lines` on an interval and keeps the newest at the
// bottom, giving panels a sense of a system that is still running.
export function LogStream({ lines, accent = '#22D3EE', rows = 8, interval = 1300 }) {
  const [items, setItems] = useState(() =>
    lines.slice(0, Math.min(rows, lines.length)).map((text, i) => ({ id: i, text })),
  )
  const nextRef = useRef(Math.min(rows, lines.length))

  useEffect(() => {
    const id = setInterval(() => {
      const n = nextRef.current
      nextRef.current += 1
      setItems((prev) => [...prev, { id: n, text: lines[n % lines.length] }].slice(-rows))
    }, interval)
    return () => clearInterval(id)
  }, [lines, rows, interval])

  return (
    <div
      className="log-fade flex flex-col justify-end gap-0.5 overflow-hidden rounded-xl border border-hairline/80 bg-black/40 px-3 py-2"
      style={{ height: rows * 18 + 16 }}
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {items.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: i === items.length - 1 ? 1 : 0.55, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="mono-tnum flex shrink-0 items-baseline gap-1.5 text-[10.5px] leading-[18px]"
          >
            <span style={{ color: accent }}>›</span>
            <span className="truncate text-ink-dim">{it.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Action timeline ───────────────────────────────────────────────────────
export function Timeline({ steps, accent = '#22D3EE' }) {
  return (
    <ol className="relative ml-1 space-y-3 border-l border-hairline pl-4">
      {steps.map((s, i) => (
        <motion.li
          key={s.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06 * i, duration: 0.3 }}
          className="relative"
        >
          <span
            className="absolute -left-[21px] top-1 grid h-2.5 w-2.5 place-items-center rounded-full ring-2 ring-surface"
            style={{
              background: s.done ? accent : '#1E2A44',
              boxShadow: s.done ? `0 0 8px ${accent}aa` : 'none',
            }}
          />
          <div
            className={cn(
              'text-[12px] font-semibold',
              s.done ? 'text-ink' : 'text-ink-faint',
            )}
          >
            {s.label}
          </div>
          <div className="mono-tnum text-[10px] text-ink-faint">{s.ts}</div>
        </motion.li>
      ))}
    </ol>
  )
}

// ── Incident location mini map ────────────────────────────────────────────
// Same coordinate space as the Crime Map, centered on one incident with a
// pin and a soft radius glow.
export function IncidentMiniMap({ x, y, city, accent = '#F43F5E', radiusLabel }) {
  // Zoom the viewBox toward the incident so the pin reads as "centered".
  const span = 54
  const vx = Math.max(0, Math.min(100 - span, x - span / 2))
  const vy = Math.max(0, Math.min(100 - span, y - span / 2))

  const toPct = (px, py) => ({
    left: `${((px - vx) / span) * 100}%`,
    top: `${((py - vy) / span) * 100}%`,
  })

  return (
    <div className="relative overflow-hidden rounded-xl border border-hairline/80 bg-black/35">
      <svg viewBox={`${vx} ${vy} ${span} ${span}`} className="block h-[190px] w-full">
        {Array.from({ length: 21 }).map((_, i) => (
          <g key={i} stroke="#22D3EE" strokeOpacity="0.06" strokeWidth="0.15">
            <line x1={i * 5} y1="0" x2={i * 5} y2="100" />
            <line x1="0" y1={i * 5} x2="100" y2={i * 5} />
          </g>
        ))}

        <defs>
          <radialGradient id="miniIndiaFill" cx="45%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#16223C" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0E1628" stopOpacity="0.95" />
          </radialGradient>
        </defs>
        <path
          d={INDIA_PATH}
          fill="url(#miniIndiaFill)"
          stroke="#38BDF8"
          strokeOpacity="0.45"
          strokeWidth="0.25"
          strokeLinejoin="round"
        />

        {/* neighbouring hotspots for context */}
        {HOTSPOTS.map((h) => (
          <circle
            key={h.id}
            cx={h.x}
            cy={h.y}
            r="0.7"
            fill={levelColor(h.level)}
            fillOpacity="0.45"
          />
        ))}

        {/* radius glow around the incident */}
        <circle cx={x} cy={y} r="7" fill={accent} fillOpacity="0.1" />
        <circle cx={x} cy={y} r="4" fill={accent} fillOpacity="0.14" />
        {[0, 1.1].map((delay) => (
          <motion.circle
            key={delay}
            cx={x}
            cy={y}
            r="2.4"
            fill="none"
            stroke={accent}
            strokeWidth="0.35"
            initial={{ opacity: 0.75, scale: 0.7 }}
            animate={{ opacity: 0, scale: 3.4 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
        <circle
          cx={x}
          cy={y}
          r="1"
          fill={accent}
          style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
        />
      </svg>

      {/* crisp HTML pin + label */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-full pb-1"
        style={toPct(x, y)}
      >
        <div className="flex flex-col items-center">
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-base"
            style={{ background: accent }}
          >
            {city}
          </span>
          <MapPin
            className="-mt-0.5 h-4 w-4"
            style={{ color: accent, filter: `drop-shadow(0 0 4px ${accent})` }}
            strokeWidth={2.5}
          />
        </div>
      </div>

      {radiusLabel && (
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md border border-hairline/80 bg-black/55 px-2 py-1 text-[9.5px] text-ink-dim backdrop-blur">
          {radiusLabel}
        </div>
      )}
    </div>
  )
}
