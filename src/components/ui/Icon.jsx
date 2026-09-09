import {
  Phone,
  Share2,
  Layers,
  ShieldCheck,
  MapPinned,
  Briefcase,
  Cpu,
  MessageSquare,
  CreditCard,
  FileText,
  Network,
  Image,
  Video,
  Volume2,
  Mail,
  Folder,
  FolderOpen,
  Eye,
  Clock,
  PlayCircle,
  IndianRupee,
  Download,
} from 'lucide-react'

// Maps string icon names (agents + evidence locker) to lucide components.
const MAP = {
  Phone,
  Share2,
  Layers,
  ShieldCheck,
  MapPinned,
  Briefcase,
  Cpu,
  MessageSquare,
  CreditCard,
  FileText,
  Network,
  Image,
  Video,
  Volume2,
  Mail,
  Folder,
  FolderOpen,
  Eye,
  Clock,
  PlayCircle,
  IndianRupee,
  Download,
}

export default function AgentIcon({ name, ...props }) {
  const Cmp = MAP[name] || Cpu
  return <Cmp {...props} />
}
