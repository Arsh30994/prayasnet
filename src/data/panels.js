// ──────────────────────────────────────────────────────────────────────────
//  DRILL-DOWN DATASETS
//  Everything the slide-over panels render. Kept separate from seed.js, which
//  holds the scripted Operations cinematic.
// ──────────────────────────────────────────────────────────────────────────

export const SEVERITY_ORDER = ['Critical', 'High', 'Medium', 'Low']

export const SEVERITY_TONE = {
  Critical: { dot: '#F43F5E', text: 'text-danger', chip: 'bg-danger/15 text-danger' },
  High: { dot: '#F5A524', text: 'text-amber', chip: 'bg-amber/15 text-amber' },
  Medium: { dot: '#22D3EE', text: 'text-cyan', chip: 'bg-cyan/15 text-cyan' },
  Low: { dot: '#34D399', text: 'text-safe', chip: 'bg-safe/15 text-safe' },
}

// ──────────────────────────────────────────────────────────────────────────
//  1 · ACTIVE THREATS  (23 rows — matches the "Active threats" KPI)
// ──────────────────────────────────────────────────────────────────────────
export const ACTIVE_THREATS = [
  { id: 'THR-4471', type: 'Digital-Arrest Extortion', location: 'South Delhi, DL', severity: 'Critical', ts: '14:31:58', status: 'Transfer blocked', agent: 'Scam-Call' },
  { id: 'THR-4468', type: 'Mule Account Ring', location: 'Andheri, Mumbai, MH', severity: 'Critical', ts: '14:24:12', status: 'Investigating', agent: 'Fraud-Graph' },
  { id: 'THR-4465', type: 'UPI QR Swap', location: 'Kothrud, Pune, MH', severity: 'High', ts: '14:29:41', status: 'Escalated', agent: 'Fraud-Graph' },
  { id: 'THR-4463', type: 'Fake HR Recruiter Ring', location: 'Patna, BR', severity: 'High', ts: '14:22:07', status: 'Takedown filed', agent: 'Job-Scam' },
  { id: 'THR-4461', type: 'SIM-Swap OTP Intercept', location: 'Noida, UP', severity: 'High', ts: '14:16:44', status: 'Blocked', agent: 'Fusion' },
  { id: 'THR-4459', type: 'Crypto Off-Ramp Layering', location: 'Bengaluru, KA', severity: 'Critical', ts: '14:14:02', status: 'Investigating', agent: 'Fraud-Graph' },
  { id: 'THR-4456', type: 'Fake KYC SMS Cluster', location: 'Jaipur, RJ', severity: 'Medium', ts: '14:27:33', status: 'Contained', agent: 'Citizen-Shield' },
  { id: 'THR-4454', type: 'Work-From-Home Deposit Scam', location: 'Hyderabad, TS', severity: 'High', ts: '14:11:19', status: 'Confirmed', agent: 'Job-Scam' },
  { id: 'THR-4451', type: 'Predatory Loan App', location: 'Surat, GJ', severity: 'Low', ts: '14:19:26', status: 'Monitoring', agent: 'Geospatial' },
  { id: 'THR-4449', type: 'Courier Parcel Scam', location: 'Gurugram, HR', severity: 'High', ts: '14:08:47', status: 'Escalated', agent: 'Scam-Call' },
  { id: 'THR-4447', type: 'Investment Advisory Fraud', location: 'Salt Lake, Kolkata, WB', severity: 'Medium', ts: '14:05:33', status: 'Investigating', agent: 'Fusion' },
  { id: 'THR-4444', type: 'Telegram Task Scam', location: 'Chennai, TN', severity: 'High', ts: '14:02:58', status: 'Confirmed', agent: 'Job-Scam' },
  { id: 'THR-4442', type: 'Electricity Bill Phishing', location: 'Lucknow, UP', severity: 'Medium', ts: '13:58:21', status: 'Contained', agent: 'Citizen-Shield' },
  { id: 'THR-4439', type: 'SIM-Box Voice Gateway', location: 'Ahmedabad, GJ', severity: 'Critical', ts: '13:54:07', status: 'Escalated', agent: 'Geospatial' },
  { id: 'THR-4436', type: 'Army Officer Impersonation', location: 'Bhopal, MP', severity: 'Medium', ts: '13:49:44', status: 'Blocked', agent: 'Scam-Call' },
  { id: 'THR-4433', type: 'Overseas Placement Fraud', location: 'Kochi, KL', severity: 'High', ts: '13:45:12', status: 'Investigating', agent: 'Job-Scam' },
  { id: 'THR-4431', type: 'Shell Company Payout', location: 'Indore, MP', severity: 'High', ts: '13:41:36', status: 'Investigating', agent: 'Fraud-Graph' },
  { id: 'THR-4428', type: 'Refund Reversal Scam', location: 'Nagpur, MH', severity: 'Low', ts: '13:37:52', status: 'Monitoring', agent: 'Citizen-Shield' },
  { id: 'THR-4425', type: 'Aadhaar Update Phishing', location: 'Kanpur, UP', severity: 'Medium', ts: '13:33:18', status: 'Contained', agent: 'Citizen-Shield' },
  { id: 'THR-4422', type: 'Data-Entry Registration Fee', location: 'Coimbatore, TN', severity: 'Medium', ts: '13:28:41', status: 'Confirmed', agent: 'Job-Scam' },
  { id: 'THR-4419', type: 'Mule Cluster · Cross-State', location: 'Ranchi, JH', severity: 'High', ts: '13:24:09', status: 'Investigating', agent: 'Fraud-Graph' },
  { id: 'THR-4416', type: 'Lottery Prize Extortion', location: 'Guwahati, AS', severity: 'Low', ts: '13:19:27', status: 'Monitoring', agent: 'Scam-Call' },
  { id: 'THR-4413', type: 'Fake Payment Gateway', location: 'Chandigarh, CH', severity: 'Medium', ts: '13:14:55', status: 'Blocked', agent: 'Fusion' },
]

export const THREAT_STATUS_TONE = {
  'Transfer blocked': 'text-safe bg-safe/12',
  Blocked: 'text-safe bg-safe/12',
  Contained: 'text-safe bg-safe/12',
  Confirmed: 'text-amber bg-amber/12',
  'Takedown filed': 'text-amber bg-amber/12',
  Escalated: 'text-danger bg-danger/12',
  Investigating: 'text-cyan bg-cyan/12',
  Monitoring: 'text-ink-dim bg-white/5',
}

// ──────────────────────────────────────────────────────────────────────────
//  2 · ₹ SAVED TODAY  (24h trend + category breakdown; both total ₹1,87,42,000)
// ──────────────────────────────────────────────────────────────────────────
export const SAVINGS_TREND = [
  { hour: '00', value: 210000 },
  { hour: '01', value: 148000 },
  { hour: '02', value: 96000 },
  { hour: '03', value: 72000 },
  { hour: '04', value: 88000 },
  { hour: '05', value: 140000 },
  { hour: '06', value: 305000 },
  { hour: '07', value: 480000 },
  { hour: '08', value: 720000 },
  { hour: '09', value: 1120000 },
  { hour: '10', value: 1245000 },
  { hour: '11', value: 1450000 },
  { hour: '12', value: 1540000 },
  { hour: '13', value: 1180000 },
  { hour: '14', value: 960000 },
  { hour: '15', value: 1045000 },
  { hour: '16', value: 1210000 },
  { hour: '17', value: 1395000 },
  { hour: '18', value: 1450000 },
  { hour: '19', value: 1320000 },
  { hour: '20', value: 1105000 },
  { hour: '21', value: 720000 },
  { hour: '22', value: 455000 },
  { hour: '23', value: 288000 },
]

export const SAVINGS_BY_CATEGORY = [
  { id: 'upi', label: 'UPI fraud', value: 6120000, cases: 412, color: '#22D3EE' },
  { id: 'phishing', label: 'Phishing', value: 4285000, cases: 338, color: '#A78BFA' },
  { id: 'jobs', label: 'Job scams', value: 3410000, cases: 267, color: '#F5A524' },
  { id: 'loans', label: 'Loan scams', value: 2690000, cases: 181, color: '#F43F5E' },
  { id: 'mules', label: 'Mule accounts', value: 2237000, cases: 96, color: '#34D399' },
]

// ──────────────────────────────────────────────────────────────────────────
//  3 · SCAM CALLS BLOCKED  (latest slice of the 1,284 blocked today)
// ──────────────────────────────────────────────────────────────────────────
export const BLOCKED_CALLS = [
  { id: 'CL-9241', caller: '+91 98••• ••412', location: 'South Delhi, DL', ts: '14:31:58', type: 'Digital arrest', action: 'Call dropped · citizen warned' },
  { id: 'CL-9238', caller: 'VoIP ••4471 (spoof)', location: 'Origin masked', ts: '14:30:22', type: 'Police impersonation', action: 'Number blacklisted' },
  { id: 'CL-9235', caller: '+91 87••• ••903', location: 'Gurugram, HR', ts: '14:28:47', type: 'Courier parcel', action: 'Call dropped' },
  { id: 'CL-9233', caller: '+91 70••• ••118', location: 'Pune, MH', ts: '14:27:05', type: 'UPI refund', action: 'Warned · reported to telecom' },
  { id: 'CL-9230', caller: 'VoIP ••2298 (spoof)', location: 'Origin masked', ts: '14:25:31', type: 'Digital arrest', action: 'Gateway blocked' },
  { id: 'CL-9227', caller: '+91 96••• ••574', location: 'Hyderabad, TS', ts: '14:23:12', type: 'Job offer fee', action: 'Call dropped · flagged to Job-Scam' },
  { id: 'CL-9224', caller: '+91 82••• ••360', location: 'Jaipur, RJ', ts: '14:21:44', type: 'Fake KYC', action: 'Number blacklisted' },
  { id: 'CL-9221', caller: '+91 99••• ••027', location: 'Noida, UP', ts: '14:19:58', type: 'SIM swap', action: 'OTP delivery frozen' },
  { id: 'CL-9218', caller: 'VoIP ••8815 (spoof)', location: 'Origin masked', ts: '14:18:20', type: 'CBI impersonation', action: 'Gateway blocked' },
  { id: 'CL-9215', caller: '+91 73••• ••649', location: 'Chennai, TN', ts: '14:16:33', type: 'Task scam', action: 'Call dropped · citizen warned' },
  { id: 'CL-9212', caller: '+91 90••• ••281', location: 'Kolkata, WB', ts: '14:14:51', type: 'Investment advisory', action: 'Warned · reported to telecom' },
  { id: 'CL-9209', caller: '+91 88••• ••735', location: 'Surat, GJ', ts: '14:12:09', type: 'Loan approval', action: 'Number blacklisted' },
  { id: 'CL-9206', caller: 'VoIP ••5502 (spoof)', location: 'Origin masked', ts: '14:10:27', type: 'Digital arrest', action: 'Gateway blocked' },
  { id: 'CL-9203', caller: '+91 76••• ••194', location: 'Lucknow, UP', ts: '14:08:44', type: 'Electricity bill', action: 'Call dropped' },
  { id: 'CL-9200', caller: '+91 94••• ••806', location: 'Bhopal, MP', ts: '14:06:12', type: 'Army officer', action: 'Warned · citizen safe' },
  { id: 'CL-9197', caller: '+91 81••• ••523', location: 'Ahmedabad, GJ', ts: '14:04:38', type: 'Lottery prize', action: 'Number blacklisted' },
  { id: 'CL-9194', caller: '+91 95••• ••067', location: 'Kochi, KL', ts: '14:02:55', type: 'Overseas placement', action: 'Call dropped · flagged to Job-Scam' },
  { id: 'CL-9191', caller: '+91 78••• ••342', location: 'Indore, MP', ts: '14:00:19', type: 'Fake payment gateway', action: 'Warned · reported to telecom' },
]

export const BLOCKED_CALLS_TOTAL = 1284

// ──────────────────────────────────────────────────────────────────────────
//  4 · JOB SCAMS FLAGGED  (latest slice of the 367 flagged today)
// ──────────────────────────────────────────────────────────────────────────
export const JOB_SCAM_PLATFORMS = {
  WhatsApp: '#34D399',
  Telegram: '#22D3EE',
  Naukri: '#A78BFA',
  LinkedIn: '#38BDF8',
  Instagram: '#F43F5E',
  SMS: '#F5A524',
}

export const JOB_SCAM_STATUS_TONE = {
  Pending: 'text-cyan bg-cyan/12 ring-cyan/25',
  Confirmed: 'text-danger bg-danger/12 ring-danger/25',
  Dismissed: 'text-ink-dim bg-white/5 ring-hairline',
}

export const JOB_SCAMS = [
  { id: 'JS-2841', company: 'Meridian HR Solutions', platform: 'WhatsApp', location: 'Patna, BR', confidence: 96, ts: '14:22:07', status: 'Confirmed', note: 'Registration fee ₹2,500 · no company registry match' },
  { id: 'JS-2838', company: 'Skyline Global Placements', platform: 'Telegram', location: 'Hyderabad, TS', confidence: 94, ts: '14:11:19', status: 'Confirmed', note: 'Work-from-home deposit scheme' },
  { id: 'JS-2835', company: 'Nexa Talent Partners', platform: 'Naukri', location: 'Bengaluru, KA', confidence: 88, ts: '14:03:52', status: 'Pending', note: 'Recruiter email domain registered 6 days ago' },
  { id: 'JS-2832', company: 'BrightPath Careers', platform: 'Telegram', location: 'Chennai, TN', confidence: 92, ts: '14:02:58', status: 'Confirmed', note: 'Task-based payout scam · 140+ applicants' },
  { id: 'JS-2829', company: 'Gulf Star Manpower', platform: 'WhatsApp', location: 'Kochi, KL', confidence: 91, ts: '13:45:12', status: 'Pending', note: 'Overseas placement · visa fee upfront' },
  { id: 'JS-2826', company: 'Prime Data Services', platform: 'SMS', location: 'Coimbatore, TN', confidence: 84, ts: '13:28:41', status: 'Confirmed', note: 'Data-entry registration fee ₹1,200' },
  { id: 'JS-2823', company: 'Anvaya Consultants', platform: 'LinkedIn', location: 'Pune, MH', confidence: 71, ts: '13:22:16', status: 'Dismissed', note: 'Verified GST · legitimate staffing firm' },
  { id: 'JS-2820', company: 'QuickHire India', platform: 'Instagram', location: 'Delhi NCR', confidence: 89, ts: '13:17:03', status: 'Pending', note: 'Reels ad · Telegram-only contact' },
  { id: 'JS-2817', company: 'Vertex Recruitment Cell', platform: 'WhatsApp', location: 'Lucknow, UP', confidence: 93, ts: '13:09:38', status: 'Confirmed', note: 'Impersonates listed IT services company' },
  { id: 'JS-2814', company: 'Sunrise BPO Hiring', platform: 'Telegram', location: 'Kolkata, WB', confidence: 87, ts: '13:01:22', status: 'Pending', note: 'Security deposit ₹3,000 · refundable claim' },
  { id: 'JS-2811', company: 'Aarohi Staffing LLP', platform: 'Naukri', location: 'Ahmedabad, GJ', confidence: 64, ts: '12:54:47', status: 'Dismissed', note: 'Registry match · duplicate posting only' },
  { id: 'JS-2808', company: 'Metro Logistics Careers', platform: 'SMS', location: 'Nagpur, MH', confidence: 82, ts: '12:47:11', status: 'Pending', note: 'Bulk SMS blast · shortlink to payment page' },
  { id: 'JS-2805', company: 'Elite Airlines Cabin Crew', platform: 'Instagram', location: 'Mumbai, MH', confidence: 95, ts: '12:38:59', status: 'Confirmed', note: 'Fake airline branding · ₹8,500 training fee' },
  { id: 'JS-2802', company: 'GovtJobs Assist Cell', platform: 'WhatsApp', location: 'Jaipur, RJ', confidence: 90, ts: '12:30:24', status: 'Confirmed', note: 'Claims guaranteed government placement' },
  { id: 'JS-2799', company: 'Zenith Career Hub', platform: 'LinkedIn', location: 'Indore, MP', confidence: 76, ts: '12:21:48', status: 'Pending', note: 'Profile created 3 weeks ago · 0 employees' },
  { id: 'JS-2796', company: 'Bharat Skill Mission', platform: 'Telegram', location: 'Guwahati, AS', confidence: 86, ts: '12:14:05', status: 'Pending', note: 'Course fee framed as job guarantee' },
]

export const JOB_SCAMS_TOTAL = 367

// ──────────────────────────────────────────────────────────────────────────
//  5 · AGENT ACTIVITY  (per-node slide-over: actions, throughput, log stream)
// ──────────────────────────────────────────────────────────────────────────
export const AGENT_ACTIVITY = {
  scam: {
    throughput: '142',
    throughputUnit: 'calls/min',
    queue: 18,
    accuracy: '96.4%',
    actions: [
      { ts: '14:31:58', text: 'Classified inbound call as digital-arrest extortion (94%)' },
      { ts: '14:30:22', text: 'Blacklisted spoofed VoIP identifier ••4471' },
      { ts: '14:28:47', text: 'Dropped courier-parcel scam call · Gurugram' },
      { ts: '14:27:05', text: 'Warned citizen on UPI refund pretext · Pune' },
      { ts: '14:25:31', text: 'Escalated repeat caller to telecom blocklist' },
    ],
    log: [
      'asr: segment 10/10 transcribed · 240ms',
      'nlp: red-flag phrase matched "under digital arrest"',
      'score: coercion=0.91 urgency=0.88 authority=0.94',
      'route: emitting SCAM_CONFIRMED → orchestrator',
      'asr: new stream opened · +91 98••• ••412',
      'nlp: 6 red-flag phrases in window',
      'vad: speaker turn detected · caller',
      'score: confidence 0.94 · threshold 0.75',
      'route: beneficiary handoff → fraud-graph',
      'asr: buffer flushed · latency 118ms',
    ],
  },
  graph: {
    throughput: '2,140',
    throughputUnit: 'edges/min',
    queue: 6,
    accuracy: '92.8%',
    actions: [
      { ts: '14:32:11', text: 'Expanded A/C ••4471 into 203-node mule network' },
      { ts: '14:29:41', text: 'Traced UPI QR swap payee to layering node · Pune' },
      { ts: '14:24:12', text: 'Surfaced new 38-account mule cluster · Mumbai' },
      { ts: '14:14:02', text: 'Linked 6 crypto off-ramp wallets to cluster C-3' },
      { ts: '13:41:36', text: 'Flagged shell company payout chain · Indore' },
    ],
    log: [
      'graph: seed A/C ••4471 loaded · depth 0',
      'expand: hop 1 → 6 infra nodes',
      'expand: hop 2 → 108 mule accounts',
      'expand: hop 3 → 89 victim accounts',
      'score: cluster risk 0.93 · 6 clusters',
      'match: NPCI fraud registry · 41 hits',
      'graph: 203 nodes / 318 edges resolved',
      'route: emitting NETWORK_READY → fusion',
      'expand: cross-link density 0.28',
      'graph: exposure computed ₹4.7 Cr',
    ],
  },
  fusion: {
    throughput: '38',
    throughputUnit: 'packages/min',
    queue: 3,
    accuracy: '98.1%',
    actions: [
      { ts: '14:32:19', text: 'Compiled intel package INC-2026-0622-0473' },
      { ts: '14:18:02', text: 'Correlated SIM-swap signal with OTP freeze · Noida' },
      { ts: '14:05:33', text: 'Merged investment-fraud reports into single case' },
      { ts: '13:33:18', text: 'Deduplicated 12 Aadhaar phishing reports' },
      { ts: '13:14:55', text: 'Drafted freeze request for fake payment gateway' },
    ],
    log: [
      'fuse: 5 source signals accepted',
      'reason: threat type = digital-arrest extortion',
      'reason: confidence 0.94 (voice 0.94 · graph 0.93)',
      'compose: summary block written',
      'compose: 8 evidence fields linked',
      'compose: 4 recommended actions drafted',
      'cite: 5 sources attached',
      'route: dispatch → citizen-shield + cyber cell',
      'fuse: package sealed · INC-2026-0622-0473',
      'audit: chain-of-custody hash recorded',
    ],
  },
  shield: {
    throughput: '96',
    throughputUnit: 'citizens/min',
    queue: 24,
    accuracy: '97.2%',
    actions: [
      { ts: '14:32:19', text: 'Warned citizen · outbound transfer blocked (₹4.8L)' },
      { ts: '14:28:20', text: 'Pushed bulk advisory to 41 KYC-phishing recipients' },
      { ts: '14:21:44', text: 'Answered Hindi query on fake KYC SMS' },
      { ts: '13:58:21', text: 'Contained electricity-bill phishing thread · Lucknow' },
      { ts: '13:37:52', text: 'Explained refund-reversal scam in Tamil' },
    ],
    log: [
      'shield: verdict pushed · DO NOT PAY',
      'i18n: response rendered in hi-IN',
      'notify: bank transfer hold requested',
      'shield: 3 next-steps delivered to citizen',
      'notify: helpline 1930 surfaced',
      'shield: session acknowledged by citizen',
      'i18n: response rendered in ta-IN',
      'queue: 24 citizen sessions pending',
      'shield: advisory broadcast · 41 recipients',
      'notify: escalation receipt logged',
    ],
  },
  geo: {
    throughput: '410',
    throughputUnit: 'signals/min',
    queue: 9,
    accuracy: '94.6%',
    actions: [
      { ts: '14:30:05', text: 'Raised Delhi NCR Outer to Critical patrol priority' },
      { ts: '14:19:26', text: 'Detected predatory loan-app install spike · Surat' },
      { ts: '13:54:07', text: 'Localised SIM-box voice gateway · Ahmedabad' },
      { ts: '13:31:12', text: 'Recomputed hotspot density across 8 metros' },
      { ts: '13:02:40', text: 'Flagged job-scam posting cluster drift · Patna' },
    ],
    log: [
      'geo: 8 hotspots recomputed',
      'density: Delhi NCR 0.95 (+0.04)',
      'density: Mumbai 0.82 (+0.01)',
      'cluster: new centroid · Patna Central',
      'patrol: priority list re-ranked',
      'geo: 412 cases bucketed · Delhi NCR',
      'sweep: radial scan complete · 2.4s',
      'route: emitting HOTSPOT_SHIFT → fusion',
      'density: Kolkata 0.71 (stable)',
      'geo: grid resolution 4km²',
    ],
  },
  jobscam: {
    throughput: '318',
    throughputUnit: 'postings/min',
    queue: 41,
    accuracy: '93.5%',
    actions: [
      { ts: '14:22:07', text: 'Confirmed fake HR recruiter ring · 9 listings · Patna' },
      { ts: '14:11:19', text: 'Flagged work-from-home deposit scheme · Hyderabad' },
      { ts: '14:02:58', text: 'Confirmed Telegram task-payout scam · Chennai' },
      { ts: '13:45:12', text: 'Flagged overseas placement visa-fee fraud · Kochi' },
      { ts: '13:22:16', text: 'Dismissed Anvaya Consultants · GST verified' },
    ],
    log: [
      'scan: 318 postings ingested this minute',
      'classify: "registration fee" pattern matched',
      'verify: company registry lookup · no match',
      'score: fraud likelihood 0.96',
      'cluster: 9 listings share one payment VPA',
      'route: emitting JOB_SCAM_CONFIRMED → fusion',
      'takedown: request filed with platform',
      'classify: recruiter domain age 6 days',
      'queue: 41 postings pending review',
      'scan: WhatsApp forward corpus · 1.2k items',
    ],
  },
}

// ──────────────────────────────────────────────────────────────────────────
//  6 · ORCHESTRATOR  (live flow edges + decision log)
// ──────────────────────────────────────────────────────────────────────────
// Each hop is one routing decision the orchestrator made. `from`/`to` are agent
// ids (or 'orchestrator'), so the flow diagram can draw them against the mesh.
export const ORCHESTRATION_FLOW = [
  { from: 'scam', to: 'orchestrator', signal: 'SCAM_CONFIRMED', color: '#22D3EE' },
  { from: 'orchestrator', to: 'graph', signal: 'TRACE_BENEFICIARY', color: '#A78BFA' },
  { from: 'graph', to: 'orchestrator', signal: 'NETWORK_READY', color: '#A78BFA' },
  { from: 'orchestrator', to: 'fusion', signal: 'COMPILE_PACKAGE', color: '#F472B6' },
  { from: 'jobscam', to: 'orchestrator', signal: 'JOB_SCAM_CONFIRMED', color: '#F5A524' },
  { from: 'geo', to: 'orchestrator', signal: 'HOTSPOT_SHIFT', color: '#38BDF8' },
  { from: 'fusion', to: 'shield', signal: 'WARN_CITIZEN', color: '#34D399' },
]

export const ORCHESTRATION_LOG = [
  { ts: '14:32:26', text: 'Dispatched INC-2026-0622-0473 to Delhi Cyber Cell', level: 'ok' },
  { ts: '14:32:19', text: 'Routed WARN_CITIZEN signal from Fusion to Citizen-Shield', level: 'ok' },
  { ts: '14:32:11', text: 'Routed NETWORK_READY signal from Fraud-Graph to Fusion', level: 'ok' },
  { ts: '14:32:04', text: 'Routed SCAM_CONFIRMED signal from Scam-Call to Fraud-Graph', level: 'ok' },
  { ts: '14:31:58', text: 'Accepted inbound signal from Citizen-Shield app · South Delhi', level: 'info' },
  { ts: '14:30:41', text: 'Deferred HOTSPOT_SHIFT from Geospatial · lower priority than active case', level: 'warn' },
  { ts: '14:29:52', text: 'Routed UPI-FRAUD signal from Fraud-Graph to Fusion', level: 'ok' },
  { ts: '14:28:20', text: 'Fanned out bulk advisory to Citizen-Shield · 41 recipients', level: 'ok' },
  { ts: '14:23:05', text: 'Routed JOB_SCAM_CONFIRMED signal from Job-Scam to Fusion', level: 'ok' },
  { ts: '14:22:31', text: 'Requested company-registry enrichment for Job-Scam Agent', level: 'info' },
  { ts: '14:19:58', text: 'Routed SIM-SWAP signal from Fusion to Citizen-Shield', level: 'ok' },
  { ts: '14:16:44', text: 'Pre-empted Geospatial sweep to free capacity for Scam-Call', level: 'warn' },
]

export const ORCHESTRATION_STATS = [
  { label: 'Signals routed · 1h', value: '4,218' },
  { label: 'Avg routing latency', value: '38 ms' },
  { label: 'Queue depth', value: '11' },
  { label: 'Handoff success', value: '99.6%' },
]

// ──────────────────────────────────────────────────────────────────────────
//  7 · SYSTEM HEALTH  ("All systems nominal" banner)
// ──────────────────────────────────────────────────────────────────────────
export const HEALTH_TONE = {
  green: { dot: '#34D399', text: 'text-safe', label: 'Healthy' },
  yellow: { dot: '#F5A524', text: 'text-amber', label: 'Degraded' },
  red: { dot: '#F43F5E', text: 'text-danger', label: 'Down' },
}

export const SYSTEM_HEALTH = {
  uptime: 99.982,
  window: 'Trailing 30 days',
  incidents: 2,
  lastRestart: '18 Jun 2026 · 03:12 IST',
  agents: [
    { id: 'scam', name: 'Scam-Call Agent', health: 'green', latency: '118 ms', load: 62 },
    { id: 'graph', name: 'Fraud-Graph Agent', health: 'green', latency: '204 ms', load: 71 },
    { id: 'fusion', name: 'Fusion Agent', health: 'green', latency: '96 ms', load: 44 },
    { id: 'shield', name: 'Citizen-Shield Agent', health: 'yellow', latency: '412 ms', load: 88 },
    { id: 'geo', name: 'Geospatial Agent', health: 'green', latency: '156 ms', load: 39 },
    { id: 'jobscam', name: 'Job-Scam Agent', health: 'yellow', latency: '338 ms', load: 81 },
  ],
  // p95 gateway latency, one sample per 5 min over the last hour
  latencySeries: [
    142, 138, 151, 147, 139, 144, 162, 158, 149, 155, 171, 168,
    159, 148, 143, 152, 187, 214, 196, 173, 161, 154, 149, 146,
  ],
  alerts: [
    { ts: '14:26:11', level: 'warn', text: 'Citizen-Shield queue depth above threshold (24 sessions)' },
    { ts: '14:12:48', level: 'warn', text: 'Job-Scam classifier latency p95 exceeded 300 ms' },
    { ts: '13:47:02', level: 'info', text: 'Fraud-Graph index rebuilt · 8.2M edges' },
    { ts: '12:58:35', level: 'info', text: 'Model refresh applied to Scam-Call Agent (v4.2.1)' },
    { ts: '11:31:19', level: 'error', text: 'NPCI registry connector timed out · retried and recovered' },
    { ts: '09:04:52', level: 'info', text: 'Nightly evaluation suite passed · 214/214 checks' },
  ],
}

export const ALERT_TONE = {
  info: { text: 'text-cyan', chip: 'bg-cyan/12 text-cyan', label: 'INFO' },
  warn: { text: 'text-amber', chip: 'bg-amber/12 text-amber', label: 'WARN' },
  error: { text: 'text-danger', chip: 'bg-danger/12 text-danger', label: 'ERROR' },
  ok: { text: 'text-safe', chip: 'bg-safe/12 text-safe', label: 'OK' },
}
