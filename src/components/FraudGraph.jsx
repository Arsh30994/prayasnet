import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, X, Crosshair, TrendingUp } from 'lucide-react'
import { useDemo } from '../demo/DemoContext'
import { NETWORK, NODE_COLORS, nodeDetail } from '../data/seed'
import { formatINR, cn } from '../lib/utils'

const EDGE_COLOR = {
  infra: 'rgba(244,63,94,0.55)',
  mule: 'rgba(245,165,36,0.32)',
  victim: 'rgba(56,189,248,0.16)',
}

const TYPE_META = {
  seed: { label: 'Beneficiary', color: NODE_COLORS.seed },
  infra: { label: 'Scammer infra', color: NODE_COLORS.infra },
  mule: { label: 'Mule accounts', color: NODE_COLORS.mule },
  victim: { label: 'Victims', color: NODE_COLORS.victim },
}

export default function FraudGraph() {
  const { state, selectedNode, setSelectedNode } = useDemo()
  const { graphCount, graphComplete } = state
  const { nodes, edges } = NETWORK

  const visibleEdges = useMemo(
    () => edges.filter((e) => e.a < graphCount && e.b < graphCount),
    [edges, graphCount],
  )

  // counts by type among revealed nodes
  const counts = useMemo(() => {
    const c = { seed: 0, infra: 0, mule: 0, victim: 0 }
    for (let i = 0; i < graphCount && i < nodes.length; i++) c[nodes[i].type]++
    return c
  }, [nodes, graphCount])

  const selected = selectedNode != null ? nodes[selectedNode] : null
  const selectedInfo = selected ? nodeDetail(selected, selectedNode) : null

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl shadow-panel">
      {/* header */}
      <div className="flex items-center justify-between border-b border-hairline/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet/15">
            <Share2 className="h-4 w-4 text-violet" />
          </span>
          <div>
            <h3 className="text-[13px] font-bold text-ink">Fraud Network Trace</h3>
            <p className="text-[10px] text-ink-faint">Graph ML · money-trail expansion</p>
          </div>
        </div>

        {/* live counter */}
        <div className="flex items-center gap-2 rounded-xl border border-violet/30 bg-violet/10 px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-violet/80">
            Linked accounts
          </span>
          <motion.span
            key={graphCount}
            initial={{ scale: 1.25, color: '#C4B5FD' }}
            animate={{ scale: 1, color: '#A78BFA' }}
            className="mono-tnum text-xl font-extrabold"
          >
            {graphCount}
          </motion.span>
        </div>
      </div>

      {/* graph stage */}
      <div className="relative min-h-0 flex-1">
        {/* radar sweep backdrop */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-[80%] max-h-[520px] w-[80%] max-w-[520px] rounded-full border border-violet/5" />
        </div>

        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
          {/* edges */}
          <g>
            {visibleEdges.map((e, i) => {
              const a = nodes[e.a]
              const b = nodes[e.b]
              return (
                <motion.line
                  key={`${e.a}-${e.b}-${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={EDGE_COLOR[e.kind]}
                  strokeWidth={e.kind === 'infra' ? 2.2 : 1.2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )
            })}
          </g>

          {/* nodes */}
          <g>
            {nodes.slice(0, graphCount).map((n, i) => {
              const meta = TYPE_META[n.type]
              const isSeed = n.type === 'seed'
              const isSel = selectedNode === i
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px`, cursor: 'pointer' }}
                  onClick={() => setSelectedNode(isSel ? null : i)}
                  whileHover={{ scale: 1.6 }}
                >
                  {/* halo for seed / selected */}
                  {(isSeed || isSel) && (
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r * 2.4}
                      fill="none"
                      stroke={meta.color}
                      strokeWidth={1.5}
                      initial={{ opacity: 0.7, scale: 0.6 }}
                      animate={{ opacity: 0, scale: 1.6 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r * 1.35}
                    fill={meta.color}
                    stroke={isSel ? '#fff' : 'rgba(11,17,32,0.8)'}
                    strokeWidth={isSel ? 2.5 : 1}
                    style={{
                      filter: isSeed
                        ? `drop-shadow(0 0 6px ${meta.color})`
                        : 'none',
                    }}
                  />
                </motion.g>
              )
            })}
          </g>
        </svg>

        {/* seed label */}
        {graphCount >= 1 && graphCount < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-6 text-center"
          >
            <div className="rounded-lg bg-danger/15 px-2 py-1 text-[11px] font-bold text-danger ring-1 ring-danger/30">
              Flagged beneficiary A/C ••4471
            </div>
          </motion.div>
        )}

        {/* legend / breakdown */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 rounded-xl border border-hairline/70 bg-black/40 p-2.5 backdrop-blur">
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
              <span className="w-24 text-[11px] text-ink-dim">{meta.label}</span>
              <span className="mono-tnum w-8 text-right text-[11px] font-bold text-ink">
                {counts[key]}
              </span>
            </div>
          ))}
        </div>

        {/* complete badge */}
        <AnimatePresence>
          {graphComplete && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-xl bg-danger/15 px-3 py-1.5 text-[11px] font-bold text-danger ring-1 ring-danger/30"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Mule ring exposed · 6 clusters
            </motion.div>
          )}
        </AnimatePresence>

        {/* node detail popover */}
        <AnimatePresence>
          {selected && selectedInfo && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="absolute right-3 top-12 w-60 overflow-hidden rounded-xl border border-hairline bg-elevated/95 p-3 shadow-panel backdrop-blur"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Crosshair
                    className="h-4 w-4"
                    style={{ color: TYPE_META[selected.type].color }}
                  />
                  <span className="text-[12px] font-bold text-ink">{selected.label}</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-ink-faint hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 space-y-1.5 text-[11.5px]">
                <Row k="Role" v={selectedInfo.role} />
                <Row k="Bank" v={selected.bank} />
                <Row k="Risk" v={selectedInfo.risk} accent={TYPE_META[selected.type].color} />
                <Row k="Transactions" v={selectedInfo.txns} />
                <Row k="Flow" v={formatINR(selectedInfo.flow)} />
                <Row k="Opened" v={selectedInfo.opened} />
                <Row k="KYC" v={selectedInfo.kyc} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Row({ k, v, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-faint">{k}</span>
      <span className="font-semibold" style={{ color: accent || '#E6EDF7' }}>
        {v}
      </span>
    </div>
  )
}
