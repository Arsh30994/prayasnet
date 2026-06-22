# PrayasNet — Digital Public Safety Command Center

A multi-agent AI command center for detecting digital-arrest scams, fraud rings, and
counterfeit currency in real time. Six specialised AI agents coordinate to surface a
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
- **Counterfeit-Vision** — flags fake currency down to the security thread and microprint.
- **Geospatial map** — fraud hotspots and patrol priority across India.

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
  Fusion · Citizen-Shield · Geospatial · Counterfeit-Vision.
