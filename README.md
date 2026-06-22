# PrayasNet — Digital Public Safety Command Center

A multi-agent AI **command-center prototype** for detecting digital-arrest scams, fraud
rings, and counterfeit currency in real time. Built for a **demo video**: every beat is
scripted, seeded, and deterministic — it plays out identically on every run.

> "Mission control / SOC" aesthetic · dark theme · cinematic 300–500 ms transitions ·
> the AI/data is **simulated** (no backend) with seeded JSON + timed reveals.

---

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
```

Record at **1600×900 (16:9)**. Then just click **RUN LIVE SCENARIO**.

Production build: `npm run build && npm run preview`.

---

## The 30-second scripted demo

Click **RUN LIVE SCENARIO** (top-right). It plays end-to-end with timed reveals:

1. **Calm dashboard** — KPIs ticking, live incident feed.
2. **Incoming signal** — a citizen forwards a suspicious call.
3. **Scam-Call Agent** wakes → transcript streams in, red-flag phrases auto-highlight →
   verdict card: **DIGITAL ARREST SCAM · 94% · TRANSFER NOT YET MADE**.
4. **Fraud-Graph Agent** wakes → the graph explodes from **1 → 47 → 203** nodes
   (victims = blue, mules = amber, scammer infra = red); the counter ticks up.
5. **Fusion Agent** wakes → the **Intelligence Package** assembles itself live.
6. **Citizen-Shield Agent** fires → the victim's phone gets a **"STOP — do not pay"** warning.
7. **Threat neutralized** — orchestrator turns green, **₹ saved** jumps **+₹4.8L**, threats drop.

### Transport controls
- **Pause / Resume**, **Reset** (back to a clean start), **Replay** (restart from 0).
- **Scrub** the timeline; click the **chapter dots** (Signal · Scam Call · Network · Fusion ·
  Shield · Resolved) to jump to any beat.

### Handy URL params (for re-recording / deep-linking a moment)
- `?play=1` — autoplay on load.
- `?t=18600` — jump straight to a moment (ms). e.g. `…/?t=18600` lands on the full 203-node graph.

---

## Views (top tabs)

| Tab | What it shows |
|-----|---------------|
| **Operations** | The hero: orchestration mesh + the scripted scenario stage. |
| **Citizen Shield** | WhatsApp-style chat mock; forward a message → instant verdict. **EN / हिं / த** language toggle. |
| **Counterfeit** | Image-scan mock → **FAKE** verdict with highlighted note regions. |
| **Crime Map** | Stylized India map with pulsing fraud hotspots + patrol-priority panel. |

---

## How it works (architecture)

Everything derives from a single **`elapsed` clock** so the demo is fully deterministic
and scrubbable:

```
src/
  demo/
    timeline.js      # getDemoState(elapsed) → the entire UI state (pure fn). Tweak T = {…} to re-time.
    DemoContext.jsx  # rAF play/pause/seek clock + URL params
  data/seed.js       # ALL seeded data (agents, transcript, 203-node network, intel, KPIs, …)
  components/
    OrchestrationVisualizer.jsx  # ★ hero — orchestrator hub + 6 agent nodes, energized links
    FraudGraph.jsx               # ★ hero — the 1→47→203 node explosion
    ScamPanel.jsx / IntelPackage.jsx / Dashboard.jsx / CitizenShield.jsx
    CounterfeitChecker.jsx / CrimeMap.jsx
```

- **Stack:** React + Vite + Tailwind CSS + framer-motion + lucide-react.
- **No backend, no localStorage** — state lives in React; the network graph is generated
  from a fixed seed (`mulberry32`) so it's pixel-identical every run.
- To **re-time** the cinematic, edit the `T` map in `src/demo/timeline.js`.
- The 6 agents each have a distinct color + icon identity (Scam-Call · Fraud-Graph ·
  Fusion · Citizen-Shield · Geospatial · Counterfeit-Vision).

> Built as a hackathon prototype. The intelligence is convincingly *faked* for the camera.
