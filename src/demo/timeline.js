import { clamp, rampValue } from '../lib/utils'
import { TRANSCRIPT, INTEL, NETWORK, KPIS } from '../data/seed'

// Master timing map (ms). Tweak here to re-time the whole cinematic.
export const T = {
  incoming: 1200,
  scamWake: 3000,
  transcriptStart: 3900,
  transcriptEnd: 9000,
  verdict: 9300,
  scamDone: 10600,

  graphWake: 11600,
  graphRevealStart: 12000,
  graphRevealEnd: 18400,
  graphDone: 18800,

  fusionWake: 19100,
  intelStart: 19500,
  intelEnd: 25200,
  fusionDone: 25500,

  shieldWake: 25900,
  phoneIn: 26300,
  shieldVerdict: 27200,

  neutralized: 28000,
  end: 30800,
}

export const PHASES = ['idle', 'incoming', 'scam', 'graph', 'fusion', 'shield', 'neutralized']

// Manual step chapters driven by the on-screen stepper: playing one runs that
// beat and then pauses. `start`/`stop` are contiguous so stepping in order
// never jumps.
export const CHAPTERS = [
  { n: 1, start: 0, stop: 2900, label: 'Incoming signal' },
  { n: 2, start: 2900, stop: 9000, label: 'Scam call read' },
  { n: 3, start: 9000, stop: 11200, label: 'Scam verdict' },
  { n: 4, start: 11200, stop: 18800, label: 'Fraud network' },
  { n: 5, start: 18800, stop: 25500, label: 'Intel report' },
  { n: 6, start: 25500, stop: 30800, label: 'Citizen warned · saved' },
]

export const PHASE_LABEL = {
  idle: 'Standing by',
  incoming: 'Incoming signal',
  scam: 'Scam-call analysis',
  graph: 'Tracing fraud network',
  fusion: 'Fusing intelligence',
  shield: 'Shielding the citizen',
  neutralized: 'Threat neutralized',
}

export const TOTAL_DURATION = T.end

// agent status helper
function agentStatus(elapsed, wake, settleAfterWake, thinkUntil, doneAt) {
  if (elapsed < wake) return 'idle'
  if (elapsed < wake + settleAfterWake) return 'waking'
  if (elapsed < thinkUntil) return 'thinking'
  if (elapsed < doneAt) return 'thinking'
  return 'done'
}

// The single source of truth: elapsed ms -> everything the UI needs.
export function getDemoState(elapsed) {
  // ── phase ────────────────────────────────────────────────────────────────
  let phase = 'idle'
  if (elapsed >= T.incoming) phase = 'incoming'
  if (elapsed >= T.scamWake) phase = 'scam'
  if (elapsed >= T.graphWake) phase = 'graph'
  if (elapsed >= T.fusionWake) phase = 'fusion'
  if (elapsed >= T.shieldWake) phase = 'shield'
  if (elapsed >= T.neutralized) phase = 'neutralized'

  // ── which view occupies the main stage ────────────────────────────────────
  let stage = 'dashboard'
  if (phase === 'scam') stage = 'scam'
  else if (phase === 'graph') stage = 'graph'
  else if (phase === 'fusion' || phase === 'shield' || phase === 'neutralized') stage = 'intel'

  // ── agent statuses ─────────────────────────────────────────────────────────
  const agents = {
    scam: agentStatus(elapsed, T.scamWake, 700, T.verdict, T.scamDone),
    graph: agentStatus(elapsed, T.graphWake, 600, T.graphRevealEnd, T.graphDone),
    fusion: agentStatus(elapsed, T.fusionWake, 600, T.intelEnd, T.fusionDone),
    shield: agentStatus(elapsed, T.shieldWake, 500, T.shieldVerdict, T.shieldVerdict + 600),
    geo: 'idle',
    jobscam: 'idle',
  }

  // orchestrator: active across the run, complete at the end
  let orchestrator = 'idle'
  if (elapsed >= T.incoming) orchestrator = 'active'
  if (elapsed >= T.neutralized + 800) orchestrator = 'complete'

  // active link (orchestrator -> agent) currently energized
  let activeLink = null
  if (agents.scam === 'waking' || agents.scam === 'thinking') activeLink = 'scam'
  if (agents.graph === 'waking' || agents.graph === 'thinking') activeLink = 'graph'
  if (agents.fusion === 'waking' || agents.fusion === 'thinking') activeLink = 'fusion'
  if (agents.shield === 'waking' || agents.shield === 'thinking') activeLink = 'shield'

  // ── scam panel ─────────────────────────────────────────────────────────────
  const transcriptProgress = clamp(
    (elapsed - T.transcriptStart) / (T.transcriptEnd - T.transcriptStart),
    0,
    1,
  )
  const transcriptCount =
    elapsed < T.transcriptStart ? 0 : Math.round(transcriptProgress * TRANSCRIPT.length)
  const showVerdict = elapsed >= T.verdict
  const confidence = showVerdict ? Math.round(rampValue(elapsed, [
    { t: T.verdict, v: 0 },
    { t: T.verdict + 1500, v: 94 },
  ])) : 0

  // ── fraud graph ────────────────────────────────────────────────────────────
  // staged 1 -> 47 -> 203 with a deliberate pause for the counter beat
  const total = NETWORK.nodes.length
  let graphCount = 0
  if (elapsed >= T.graphWake) {
    graphCount = Math.round(
      rampValue(elapsed, [
        { t: T.graphRevealStart, v: 1 },
        { t: T.graphRevealStart + 1500, v: 47 },
        { t: T.graphRevealStart + 2300, v: 47 },
        { t: T.graphRevealEnd, v: total },
      ]),
    )
  }
  graphCount = clamp(graphCount, 0, total)

  // ── intel package ──────────────────────────────────────────────────────────
  const intelTotalBlocks = 1 /*summary*/ + INTEL.fields.length + INTEL.actions.length + INTEL.sources.length
  const intelProgress = clamp(
    (elapsed - T.intelStart) / (T.intelEnd - T.intelStart),
    0,
    1,
  )
  const intelBlocks = elapsed < T.intelStart ? 0 : Math.round(intelProgress * intelTotalBlocks)
  const intelComplete = elapsed >= T.intelEnd
  const dispatched = elapsed >= T.neutralized

  // ── citizen shield ───────────────────────────────────────────────────────
  const showPhone = elapsed >= T.phoneIn
  const shieldVerdict = elapsed >= T.shieldVerdict

  // ── KPI: ₹ saved jumps when threat neutralized ─────────────────────────────
  const baseSaved = KPIS.find((k) => k.id === 'saved').value
  const atRisk = 480000
  const savedBoost = rampValue(elapsed, [
    { t: T.neutralized, v: 0 },
    { t: T.neutralized + 1400, v: atRisk },
  ])
  const savedTotal = baseSaved + (elapsed >= T.neutralized ? savedBoost : 0)
  const threatsActive = elapsed >= T.neutralized ? 22 : 23

  return {
    elapsed,
    phase,
    stage,
    agents,
    orchestrator,
    activeLink,
    // scam
    transcriptCount,
    showVerdict,
    confidence,
    // graph
    graphCount,
    graphComplete: graphCount >= total,
    // intel
    intelBlocks,
    intelComplete,
    dispatched,
    // shield
    showPhone,
    shieldVerdict,
    // kpis
    savedTotal,
    savedBoosted: elapsed >= T.neutralized,
    threatsActive,
    neutralized: phase === 'neutralized',
    running: elapsed > 0 && elapsed < T.end,
    finished: elapsed >= T.end,
  }
}
