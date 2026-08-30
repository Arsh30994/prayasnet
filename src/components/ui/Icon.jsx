import {
  Phone,
  Share2,
  Layers,
  ShieldCheck,
  MapPinned,
  Briefcase,
  Cpu,
} from 'lucide-react'

// Maps the agent icon names from seed data to lucide components.
const MAP = {
  Phone,
  Share2,
  Layers,
  ShieldCheck,
  MapPinned,
  Briefcase,
  Cpu,
}

export default function AgentIcon({ name, ...props }) {
  const Cmp = MAP[name] || Cpu
  return <Cmp {...props} />
}
