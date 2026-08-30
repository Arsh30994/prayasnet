# PrayasNet — Digital Public Safety Command Center

A multi-agent AI command center for detecting digital-arrest scams, fraud rings, and
fraudulent job postings in real time. Six specialised AI agents coordinate to surface a
threat, trace the money trail, compile an intelligence package, and protect the citizen —
before the money is lost.

> Mission-control / SOC aesthetic · dark theme · high-contrast, modern UI.

---

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
```

Production build: `npm run build && npm run preview`.

Best viewed on a 1600×900 (16:9) desktop screen.

---

## What it does

- **Scam detection** — runs a call transcript through NLP triage, auto-highlights the
  red-flag phrases, and returns a confidence-scored verdict.
- **Fraud-network tracing** — expands a single flagged account into the full mule network
  (victims, mule accounts, and scammer infrastructure) across linked clusters.
- **Intelligence package** — compiles an evidence-linked case report: summary, confidence,
  linked accounts, amount at risk, recommended actions, and source citations.
- **Citizen Shield** — a chat assistant that gives any citizen an instant verdict on a
  suspicious message, in **English, Hindi, or Tamil**.
- **Job-scam detection** — flags fraudulent job postings and fake recruiters with a
  confidence score and a reviewer queue.
- **Counterfeit-Vision** — flags fake currency down to the security thread and microprint.
- **Geospatial map** — fraud hotspots and patrol priority across India.

## Drill-downs

Every tile, card, mesh node and incident row on the Operations view is clickable and
opens a slide-over panel from the right. Panels close via the X button, a click on the
overlay, or Esc.

| Click | Panel |
|-------|-------|
| **Active threats** | Threat register with severity filter and sort. |
| **₹ saved today** | 24-hour savings trend plus a per-category breakdown. |
| **Scam calls blocked** | Call block log: caller, location, scam type, action taken. |
| **Job scams flagged** | Flagged postings with platform, confidence and review status. |
| **Agent node** | Status, live throughput, last five actions, live log stream. |
| **Orchestrator hub** | Live signal-flow diagram and the routing decision log. |
| **"All systems nominal"** | Uptime, per-agent health, latency graph, recent alerts. |
| **Incident feed row** | Located map with pin, incident detail, and action timeline. |

## Views

| Tab | What it shows |
|-----|---------------|
| **Operations** | The orchestration mesh and the active incident workspace. |
| **Citizen Shield** | Chat assistant; forward a message → instant verdict. EN / हिं / த. |
| **Counterfeit** | Currency scan → authenticity verdict with highlighted note regions. |
| **Crime Map** | Stylized India map with fraud hotspots and a patrol-priority panel. |

---

## Architecture

- **Stack:** React + Vite + Tailwind CSS + framer-motion + lucide-react.
- The UI is driven by a single derived-state function over seeded data, so every view
  renders deterministically. State lives in React (no backend); the fraud network is
  generated from a fixed seed (`mulberry32`) so it renders identically every time.
- **Core visuals** — `OrchestrationVisualizer` (the orchestrator hub and six agent nodes)
  and `FraudGraph` (the animated fraud-network expansion), with dedicated panels for scam
  detection, the intelligence package, Citizen Shield, counterfeit checks, and the map.
- The six agents each have a distinct colour and icon identity: Scam-Call · Fraud-Graph ·
  Fusion · Citizen-Shield · Geospatial · Job-Scam.
- **Drill-downs** — `PanelContext` tracks the single open panel, `PanelHost` resolves it
  to a body from `src/panels/`, and `SlideOver` renders the animation and dismissal.
  Every clickable surface routes through `ui/Tile` so hover affordance is identical.
- **Walkthrough** — the scripted Operations cinematic is driven from the on-screen
  control bar (`DemoControls`): Start/Pause, a six-step stepper, and Reset. `?play=1`
  autoplays and `?t=12000` deep-links to a moment, which is handy for recording.
