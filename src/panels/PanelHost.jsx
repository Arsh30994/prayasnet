import {
  Activity,
  AlertTriangle,
  Cpu,
  HeartPulse,
  IndianRupee,
  PhoneOff,
  Briefcase,
} from 'lucide-react'
import SlideOver from '../components/ui/SlideOver'
import { usePanel } from './PanelContext'
import { AGENTS_BY_ID } from '../data/seed'
import { BLOCKED_CALLS_TOTAL, JOB_SCAMS_TOTAL, ACTIVE_THREATS } from '../data/panels'
import AgentIcon from '../components/ui/Icon'
import ThreatsPanel from './ThreatsPanel'
import SavingsPanel from './SavingsPanel'
import CallsPanel from './CallsPanel'
import JobScamsPanel from './JobScamsPanel'
import AgentPanel from './AgentPanel'
import OrchestratorPanel from './OrchestratorPanel'
import SystemHealthPanel from './SystemHealthPanel'
import IncidentPanel, { INCIDENT_ACCENT } from './IncidentPanel'

// One SlideOver instance for the whole app, so open/close always animates
// cleanly and swapping panels never stacks overlays.
function resolve(type, payload) {
  switch (type) {
    case 'threats':
      return {
        title: 'Active Threats',
        subtitle: `${ACTIVE_THREATS.length} live threats across the national grid`,
        accent: '#F43F5E',
        icon: AlertTriangle,
        badge: 'live',
        body: <ThreatsPanel />,
      }
    case 'savings':
      return {
        title: '₹ Saved Today',
        subtitle: 'Money kept with citizens · last 24 hours',
        accent: '#34D399',
        icon: IndianRupee,
        body: <SavingsPanel />,
      }
    case 'calls':
      return {
        title: 'Scam Calls Blocked',
        subtitle: `${BLOCKED_CALLS_TOTAL.toLocaleString('en-IN')} calls intercepted today`,
        accent: '#22D3EE',
        icon: PhoneOff,
        body: <CallsPanel />,
      }
    case 'jobscams':
      return {
        title: 'Job Scams Flagged',
        subtitle: `${JOB_SCAMS_TOTAL} fraudulent postings detected today`,
        accent: '#F5A524',
        icon: Briefcase,
        body: <JobScamsPanel />,
      }
    case 'agent': {
      const agent = AGENTS_BY_ID[payload]
      if (!agent) return null
      return {
        title: agent.name,
        subtitle: `${agent.metric} · node ${agent.short}`,
        accent: agent.color,
        icon: (props) => <AgentIcon name={agent.icon} {...props} />,
        body: <AgentPanel agentId={payload} />,
      }
    }
    case 'orchestrator':
      return {
        title: 'Orchestrator',
        subtitle: 'Signal routing across the agent mesh',
        accent: '#22D3EE',
        icon: Cpu,
        badge: 'live',
        body: <OrchestratorPanel />,
      }
    case 'health':
      return {
        title: 'System Health',
        subtitle: 'Availability, per-agent status and recent alerts',
        accent: '#34D399',
        icon: HeartPulse,
        body: <SystemHealthPanel />,
      }
    case 'incident': {
      if (!payload) return null
      return {
        title: payload.text.split(' · ')[0],
        subtitle: `${payload.tag} · ${payload.city}`,
        accent: INCIDENT_ACCENT[payload.sev],
        icon: Activity,
        badge: payload.live ? 'live' : undefined,
        body: <IncidentPanel incident={payload} />,
      }
    }
    default:
      return null
  }
}

export default function PanelHost() {
  const { panelType, payload, isOpen, closePanel } = usePanel()
  const cfg = panelType ? resolve(panelType, payload) : null

  return (
    <SlideOver
      open={isOpen && cfg != null}
      onClose={closePanel}
      title={cfg?.title ?? ''}
      subtitle={cfg?.subtitle}
      accent={cfg?.accent}
      icon={cfg?.icon}
      badge={cfg?.badge}
    >
      {cfg?.body}
    </SlideOver>
  )
}
