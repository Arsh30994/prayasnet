import { mulberry32 } from '../lib/utils'

// ──────────────────────────────────────────────────────────────────────────
//  AGENT ROSTER  — each has a distinct color + icon identity
// ──────────────────────────────────────────────────────────────────────────
export const ORCHESTRATOR = {
  id: 'orchestrator',
  name: 'Orchestrator',
  short: 'ORCH',
  color: '#22D3EE',
  desc: 'Routes signals & coordinates the agent mesh',
}

// angle is in degrees around the hub (0 = right, clockwise)
export const AGENTS = [
  {
    id: 'scam',
    name: 'Scam-Call Agent',
    short: 'VOICE',
    icon: 'Phone',
    color: '#22D3EE',
    angle: -90,
    desc: 'NLP triage of call audio & transcripts',
    metric: 'Voice / NLP',
  },
  {
    id: 'graph',
    name: 'Fraud-Graph Agent',
    short: 'GRAPH',
    icon: 'Share2',
    color: '#A78BFA',
    angle: -34,
    desc: 'Traces money trails & mule clusters',
    metric: 'Graph ML',
  },
  {
    id: 'fusion',
    name: 'Fusion Agent',
    short: 'FUSION',
    icon: 'Layers',
    color: '#F472B6',
    angle: 28,
    desc: 'Synthesizes a single intelligence package',
    metric: 'Reasoning',
  },
  {
    id: 'shield',
    name: 'Citizen-Shield Agent',
    short: 'SHIELD',
    icon: 'ShieldCheck',
    color: '#34D399',
    angle: 90,
    desc: 'Warns & guides the citizen in real time',
    metric: 'Engagement',
  },
  {
    id: 'geo',
    name: 'Geospatial Agent',
    short: 'GEO',
    icon: 'MapPinned',
    color: '#38BDF8',
    angle: 152,
    desc: 'Maps hotspots & patrol priority',
    metric: 'Geo / Maps',
  },
  {
    id: 'jobscam',
    name: 'Job-Scam Agent',
    short: 'JOBS',
    icon: 'Briefcase',
    color: '#F5A524',
    angle: 214,
    desc: 'Flags fraudulent job postings & fake recruiters',
    metric: 'Text / Classifier',
  },
]

export const AGENTS_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a]))

// ──────────────────────────────────────────────────────────────────────────
//  SCAM CALL TRANSCRIPT  — streamed line by line during the demo
// ──────────────────────────────────────────────────────────────────────────
export const TRANSCRIPT = [
  { who: 'caller', text: 'This is Sub-Inspector Rana from the Cyber Crime Branch, Delhi.' },
  { who: 'caller', text: 'A parcel in your name was seized at the airport with illegal items.' },
  { who: 'victim', text: 'What? I never sent any parcel…' },
  {
    who: 'caller',
    text: 'Your Aadhaar is linked to money laundering. You are under digital arrest.',
    flags: ['you are under digital arrest'],
  },
  {
    who: 'caller',
    text: 'Do not disconnect this video call or you will be jailed immediately.',
    flags: ['do not disconnect'],
  },
  { who: 'victim', text: 'Please, I have done nothing wrong, sir.' },
  {
    who: 'caller',
    text: 'Do not tell anyone. This is a confidential national security matter.',
    flags: ['do not tell anyone'],
  },
  {
    who: 'caller',
    text: 'To prove innocence, transfer ₹4,80,000 to this RBI verification account now.',
    flags: ['transfer', 'verification account'],
  },
  {
    who: 'caller',
    text: 'The money is 100% refundable after verification. Act fast, this is urgent.',
    flags: ['refundable', 'urgent'],
  },
  { who: 'victim', text: 'O-okay… let me open my banking app…' },
]

// Phrases the Scam-Call Agent auto-highlights as red flags
export const RED_FLAGS = [
  'you are under digital arrest',
  'do not disconnect',
  'do not tell anyone',
  'transfer',
  'verification account',
  'refundable',
  'urgent',
]

export const SCAM_SIGNALS = [
  { label: 'Impersonation of law enforcement', weight: 'High' },
  { label: '“Digital arrest” coercion script', weight: 'Critical' },
  { label: 'Isolation tactic (do not disconnect)', weight: 'High' },
  { label: 'Urgency + refundable payment lure', weight: 'High' },
  { label: 'Beneficiary flagged in mule database', weight: 'Critical' },
]

// ──────────────────────────────────────────────────────────────────────────
//  FRAUD NETWORK  — generated deterministically so every run is identical
// ──────────────────────────────────────────────────────────────────────────
function buildNetwork() {
  const rand = mulberry32(20260622)
  const nodes = []
  const edges = []
  const CX = 500
  const CY = 500

  const push = (n) => {
    nodes.push(n)
    return nodes.length - 1
  }

  // 0 — the single flagged seed account (where the trace begins)
  const seed = push({
    type: 'seed',
    label: 'A/C ••4471 — beneficiary',
    bank: 'Beneficiary A/C',
    x: CX,
    y: CY,
    r: 11,
    order: 0,
  })

  // Scammer infrastructure (red) — inner ring
  const infraLabels = [
    'VoIP call gateway',
    'Crypto off-ramp wallet',
    'SIM-box cluster',
    'Shell company A/C',
    'Telegram payout bot',
    'Forex layering node',
  ]
  const infra = []
  const infraN = infraLabels.length
  for (let i = 0; i < infraN; i++) {
    const ang = (i / infraN) * Math.PI * 2 + 0.4
    const rad = 78 + rand() * 18
    const idx = push({
      type: 'infra',
      label: infraLabels[i],
      bank: 'Scammer infra',
      x: CX + Math.cos(ang) * rad,
      y: CY + Math.sin(ang) * rad,
      r: 8,
      order: 1 + i,
    })
    infra.push(idx)
    edges.push({ a: seed, b: idx, kind: 'infra' })
  }

  // Mule accounts (amber) — clustered mid rings around each infra node
  const banks = ['HDFC', 'SBI', 'ICICI', 'Axis', 'PNB', 'Kotak', 'BoB', 'Yes']
  const mules = []
  let order = 1 + infraN
  const clusters = infra.length
  const mulesPerCluster = 18
  for (let c = 0; c < clusters; c++) {
    const parent = infra[c]
    const baseAng = (c / clusters) * Math.PI * 2 + 0.4
    for (let m = 0; m < mulesPerCluster; m++) {
      const spread = (rand() - 0.5) * 0.9
      const ang = baseAng + spread
      const rad = 150 + rand() * 120
      const idx = push({
        type: 'mule',
        label: `A/C ••${1000 + Math.floor(rand() * 8999)}`,
        bank: banks[Math.floor(rand() * banks.length)],
        x: CX + Math.cos(ang) * rad,
        y: CY + Math.sin(ang) * rad,
        r: 5.5,
        order: order++,
      })
      mules.push(idx)
      edges.push({ a: parent, b: idx, kind: 'mule' })
      // a few cross-links between mules for a dense "web" look
      if (m > 0 && rand() > 0.72) {
        edges.push({ a: idx, b: mules[mules.length - 2], kind: 'mule' })
      }
    }
  }

  // Victims (blue) — outer ring, each feeding a mule
  const victimsCount = 203 - nodes.length
  for (let v = 0; v < victimsCount; v++) {
    const parent = mules[Math.floor(rand() * mules.length)]
    const p = nodes[parent]
    const ang = Math.atan2(p.y - CY, p.x - CX) + (rand() - 0.5) * 0.5
    const rad = 320 + rand() * 150
    const idx = push({
      type: 'victim',
      label: `Victim ••${100 + Math.floor(rand() * 899)}`,
      bank: banks[Math.floor(rand() * banks.length)],
      x: CX + Math.cos(ang) * rad,
      y: CY + Math.sin(ang) * rad,
      r: 4.5,
      order: order++,
    })
    edges.push({ a: parent, b: idx, kind: 'victim' })
  }

  return { nodes, edges }
}

export const NETWORK = buildNetwork()

export const NODE_COLORS = {
  seed: '#F43F5E',
  infra: '#F43F5E',
  mule: '#F5A524',
  victim: '#38BDF8',
}

// Mock detail shown when a node is clicked
export function nodeDetail(node, i) {
  const rand = mulberry32(i * 7 + 13)
  const amt = Math.floor(20000 + rand() * 480000)
  const detailByType = {
    seed: { role: 'Primary beneficiary', risk: 'Critical' },
    infra: { role: 'Scammer infrastructure', risk: 'Critical' },
    mule: { role: 'Mule account', risk: 'High' },
    victim: { role: 'Potential victim', risk: 'Monitor' },
  }
  const d = detailByType[node.type]
  return {
    ...d,
    txns: 3 + Math.floor(rand() * 40),
    flow: amt,
    opened: `${1 + Math.floor(rand() * 12)} mo ago`,
    kyc: rand() > 0.5 ? 'Mismatch' : 'Unverified',
  }
}

// ──────────────────────────────────────────────────────────────────────────
//  INTELLIGENCE PACKAGE  — assembled by the Fusion Agent
// ──────────────────────────────────────────────────────────────────────────
export const INTEL = {
  id: 'INC-2026-0622-0473',
  classification: 'PRIORITY · CYBER',
  summary:
    'Active digital-arrest extortion targeting a citizen in South Delhi. AI triage intercepted the call before any transfer. The beneficiary account links to a 203-node mule network laundering through crypto off-ramps.',
  fields: [
    { k: 'Threat type', v: 'Digital-Arrest Extortion', tone: 'danger' },
    { k: 'Confidence', v: '94%', tone: 'danger' },
    { k: 'Status', v: 'Transfer NOT yet made', tone: 'safe' },
    { k: 'Linked accounts', v: '203', tone: 'amber' },
    { k: 'Mule clusters', v: '6', tone: 'amber' },
    { k: 'Amount at risk', v: '₹4,80,000', tone: 'amber' },
    { k: 'Network exposure', v: '₹4.7 Cr', tone: 'danger' },
    { k: 'Origin', v: 'VoIP · masked (+91 spoof)', tone: 'ink' },
  ],
  actions: [
    'Freeze beneficiary A/C ••4471 and 6 first-hop mule accounts (auto-drafted to NPCI).',
    'Push real-time block on the citizen’s outbound transfer via bank API.',
    'Dispatch alert to Delhi Cyber Cell with full node graph + call evidence.',
    'Flag 6 crypto off-ramp wallets to FIU-IND watchlist.',
  ],
  sources: [
    'Call audio · ASR transcript (10 segments)',
    'Beneficiary A/C ••4471 · txn history',
    'Mule-network graph · 203 nodes / 6 clusters',
    'NPCI fraud registry cross-match',
    'Telecom CDR · VoIP origin trace',
  ],
}

// ──────────────────────────────────────────────────────────────────────────
//  COMMAND DASHBOARD  — KPIs + live incident feed
// ──────────────────────────────────────────────────────────────────────────
export const KPIS = [
  { id: 'threats', label: 'Active threats', value: 23, suffix: '', tone: 'danger', icon: 'AlertTriangle' },
  { id: 'saved', label: '₹ saved today', value: 18742000, money: true, tone: 'safe', icon: 'IndianRupee' },
  { id: 'calls', label: 'Scam calls blocked', value: 1284, tone: 'cyan', icon: 'PhoneOff' },
  { id: 'jobs', label: 'Job scams flagged', value: 367, tone: 'amber', icon: 'Briefcase' },
]

// Each incident carries the drill-down detail its slide-over panel renders:
// map placement (`x`/`y` share the India silhouette coordinate space used by
// HOTSPOTS), casework fields, and the action timeline.
export const INCIDENT_FEED = [
  {
    id: 1,
    sev: 'high',
    tag: 'DIGITAL-ARREST',
    text: 'Forwarded call · South Delhi',
    time: 'now',
    live: true,
    city: 'South Delhi',
    region: 'Delhi NCR',
    x: 41,
    y: 31,
    fullTs: '22 Jun 2026 · 14:31:58 IST',
    status: 'Active · transfer blocked',
    statusTone: 'danger',
    agent: 'Scam-Call Agent',
    radius: '4.2 km cluster radius',
    amount: '₹4,80,000',
    timeline: [
      { label: 'Signal received', ts: '14:31:58', done: true },
      { label: 'Detected as scam (94%)', ts: '14:32:04', done: true },
      { label: 'Beneficiary traced · 203 nodes', ts: '14:32:11', done: true },
      { label: 'Citizen warned · transfer blocked', ts: '14:32:19', done: true },
      { label: 'Escalated to Delhi Cyber Cell', ts: '14:32:26', done: true },
    ],
  },
  {
    id: 2,
    sev: 'med',
    tag: 'UPI-FRAUD',
    text: 'QR swap attempt · Pune',
    time: '2m',
    city: 'Pune',
    region: 'Maharashtra',
    x: 33,
    y: 62,
    fullTs: '22 Jun 2026 · 14:29:41 IST',
    status: 'Escalated to bank',
    statusTone: 'amber',
    agent: 'Fraud-Graph Agent',
    radius: '1.8 km cluster radius',
    amount: '₹62,500',
    timeline: [
      { label: 'Merchant QR mismatch detected', ts: '14:29:41', done: true },
      { label: 'Flagged · payee VPA unverified', ts: '14:29:52', done: true },
      { label: 'Escalated to acquiring bank', ts: '14:30:14', done: true },
      { label: 'Awaiting merchant confirmation', ts: '—', done: false },
    ],
  },
  {
    id: 3,
    sev: 'low',
    tag: 'PHISHING',
    text: 'Fake KYC SMS cluster · Jaipur',
    time: '4m',
    city: 'Jaipur',
    region: 'Rajasthan',
    x: 34,
    y: 38,
    fullTs: '22 Jun 2026 · 14:27:33 IST',
    status: 'Contained',
    statusTone: 'safe',
    agent: 'Citizen-Shield Agent',
    radius: '6.5 km cluster radius',
    amount: '₹0 (no transfer)',
    timeline: [
      { label: 'SMS cluster detected · 41 recipients', ts: '14:27:33', done: true },
      { label: 'Sender ID flagged to telecom', ts: '14:27:49', done: true },
      { label: 'Bulk advisory pushed to citizens', ts: '14:28:20', done: true },
      { label: 'Contained · shortlink taken down', ts: '14:29:02', done: true },
    ],
  },
  {
    id: 4,
    sev: 'high',
    tag: 'MULE-RING',
    text: 'New cluster surfaced · Mumbai',
    time: '7m',
    city: 'Mumbai',
    region: 'Maharashtra',
    x: 30,
    y: 60,
    fullTs: '22 Jun 2026 · 14:24:12 IST',
    status: 'Investigating',
    statusTone: 'danger',
    agent: 'Fraud-Graph Agent',
    radius: '11.3 km cluster radius',
    amount: '₹1.4 Cr exposure',
    timeline: [
      { label: 'Cluster surfaced · 38 accounts', ts: '14:24:12', done: true },
      { label: 'Cross-matched NPCI fraud registry', ts: '14:24:40', done: true },
      { label: 'Freeze request drafted', ts: '14:25:18', done: true },
      { label: 'Awaiting bank action', ts: '—', done: false },
    ],
  },
  {
    id: 5,
    sev: 'med',
    tag: 'JOB-SCAM',
    text: 'Fake HR recruiter ring · Patna',
    time: '9m',
    city: 'Patna',
    region: 'Bihar',
    x: 62,
    y: 41,
    fullTs: '22 Jun 2026 · 14:22:07 IST',
    status: 'Confirmed · takedown filed',
    statusTone: 'amber',
    agent: 'Job-Scam Agent',
    radius: '3.1 km cluster radius',
    amount: '₹2,15,000 in deposits',
    timeline: [
      { label: 'Posting cluster flagged · 9 listings', ts: '14:22:07', done: true },
      { label: 'Recruiter identity unverifiable', ts: '14:22:31', done: true },
      { label: 'Confirmed by reviewer', ts: '14:23:05', done: true },
      { label: 'Takedown filed with platform', ts: '14:23:44', done: true },
    ],
  },
  {
    id: 6,
    sev: 'low',
    tag: 'LOAN-SCAM',
    text: 'Predatory app alert · Surat',
    time: '12m',
    city: 'Surat',
    region: 'Gujarat',
    x: 29,
    y: 54,
    fullTs: '22 Jun 2026 · 14:19:26 IST',
    status: 'Monitoring',
    statusTone: 'cyan',
    agent: 'Geospatial Agent',
    radius: '2.4 km cluster radius',
    amount: '₹34,000',
    timeline: [
      { label: 'App install spike detected', ts: '14:19:26', done: true },
      { label: 'Permissions profile flagged', ts: '14:19:58', done: true },
      { label: 'Advisory queued for review', ts: '—', done: false },
    ],
  },
  {
    id: 7,
    sev: 'med',
    tag: 'SIM-SWAP',
    text: 'OTP intercept attempt · Noida',
    time: '15m',
    city: 'Noida',
    region: 'Delhi NCR',
    x: 42,
    y: 30,
    fullTs: '22 Jun 2026 · 14:16:44 IST',
    status: 'Blocked',
    statusTone: 'safe',
    agent: 'Fusion Agent',
    radius: '5.0 km cluster radius',
    amount: '₹1,20,000',
    timeline: [
      { label: 'Duplicate SIM request detected', ts: '14:16:44', done: true },
      { label: 'OTP delivery frozen', ts: '14:16:55', done: true },
      { label: 'Telecom notified', ts: '14:17:20', done: true },
      { label: 'Blocked · account secured', ts: '14:18:02', done: true },
    ],
  },
]

// ──────────────────────────────────────────────────────────────────────────
//  CITIZEN FRAUD SHIELD  — multilingual chat mock
// ──────────────────────────────────────────────────────────────────────────
export const SHIELD_CHAT = {
  en: {
    name: 'PrayasNet Shield',
    forwarded: 'You are under digital arrest. Transfer ₹4,80,000 to the RBI verification account now or face immediate jail. Do not disconnect.',
    verdictTitle: '⚠️ Likely scam — do NOT pay',
    verdict: 'This is a “digital arrest” extortion script. Real police never arrest you over a video call or ask for money transfers.',
    steps: ['Cut the call now', 'Do NOT transfer any money', 'Report on helpline 1930'],
    placeholder: 'Forward a suspicious message…',
  },
  hi: {
    name: 'प्रयासनेट शील्ड',
    forwarded: 'आप डिजिटल अरेस्ट में हैं। अभी ₹4,80,000 आरबीआई वेरिफिकेशन खाते में ट्रांसफर करें वरना जेल होगी। कॉल मत काटिए।',
    verdictTitle: '⚠️ संभावित धोखाधड़ी — पैसे न भेजें',
    verdict: 'यह “डिजिटल अरेस्ट” ठगी है। असली पुलिस वीडियो कॉल पर गिरफ्तार नहीं करती और न पैसे मांगती है।',
    steps: ['कॉल तुरंत काटें', 'कोई पैसा ट्रांसफर न करें', 'हेल्पलाइन 1930 पर रिपोर्ट करें'],
    placeholder: 'संदिग्ध संदेश फॉरवर्ड करें…',
  },
  ta: {
    name: 'பிரயாஸ்நெட் ஷீல்டு',
    forwarded: 'நீங்கள் டிஜிட்டல் கைதில் உள்ளீர்கள். இப்போதே ₹4,80,000 ஐ RBI சரிபார்ப்பு கணக்கிற்கு அனுப்பவும், இல்லையெனில் சிறை. அழைப்பைத் துண்டிக்காதீர்கள்.',
    verdictTitle: '⚠️ மோசடி சாத்தியம் — பணம் அனுப்ப வேண்டாம்',
    verdict: 'இது “டிஜிட்டல் கைது” மிரட்டல் மோசடி. உண்மையான காவல்துறை வீடியோ அழைப்பில் கைது செய்யாது, பணமும் கேட்காது.',
    steps: ['அழைப்பை இப்போது துண்டிக்கவும்', 'பணம் அனுப்ப வேண்டாம்', '1930 உதவி எண்ணில் புகார்'],
    placeholder: 'சந்தேகமான செய்தியை அனுப்பவும்…',
  },
}

// ──────────────────────────────────────────────────────────────────────────
//  P2 STUBS  — counterfeit checker + crime map
// ──────────────────────────────────────────────────────────────────────────
export const COUNTERFEIT_RESULT = {
  verdict: 'FAKE',
  confidence: 91,
  denomination: '₹500',
  checks: [
    { label: 'Security thread', ok: false, note: 'Continuous thread not detected' },
    { label: 'Microprint “RBI”', ok: false, note: 'Mismatch / blurred' },
    { label: 'Latent image', ok: false, note: 'Absent under tilt' },
    { label: 'Bleed lines', ok: true, note: 'Present' },
    { label: 'Watermark (Gandhi)', ok: false, note: 'Low contrast' },
    { label: 'Serial font', ok: true, note: 'Consistent' },
  ],
  regions: [
    { x: 12, y: 18, w: 18, h: 30, label: 'Security thread' },
    { x: 60, y: 20, w: 26, h: 22, label: 'Microprint' },
    { x: 64, y: 58, w: 22, h: 26, label: 'Watermark' },
  ],
}

export const HOTSPOTS = [
  { id: 'del', city: 'Delhi NCR', x: 41, y: 30, level: 0.95, cases: 412 },
  { id: 'mum', city: 'Mumbai', x: 30, y: 60, level: 0.82, cases: 318 },
  { id: 'jai', city: 'Jaipur', x: 34, y: 38, level: 0.6, cases: 176 },
  { id: 'kol', city: 'Kolkata', x: 70, y: 50, level: 0.71, cases: 244 },
  { id: 'hyd', city: 'Hyderabad', x: 45, y: 66, level: 0.66, cases: 201 },
  { id: 'blr', city: 'Bengaluru', x: 41, y: 75, level: 0.58, cases: 158 },
  { id: 'pat', city: 'Patna', x: 62, y: 41, level: 0.74, cases: 263 },
  { id: 'che', city: 'Chennai', x: 48, y: 82, level: 0.49, cases: 121 },
]

export const PATROL_PRIORITY = [
  { rank: 1, zone: 'Delhi NCR · Outer', reason: 'Mule-account density spike', level: 'Critical' },
  { rank: 2, zone: 'Patna · Central', reason: 'Counterfeit ₹500 cluster', level: 'High' },
  { rank: 3, zone: 'Mumbai · Western', reason: 'UPI QR-swap reports', level: 'High' },
  { rank: 4, zone: 'Kolkata · Salt Lake', reason: 'SIM-box activity', level: 'Elevated' },
]
