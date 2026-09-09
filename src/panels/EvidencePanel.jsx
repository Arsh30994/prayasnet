import { useState } from 'react'
import {
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  Image,
  IndianRupee,
  Mail,
  MessageSquare,
  Network,
  Phone,
  PlayCircle,
  Share2,
  Video,
  Volume2,
} from 'lucide-react'
import { getEvidenceByIncidentId } from '../data/panels'
import { formatINR, cn } from '../lib/utils'
import Tile from '../components/ui/Tile'
import { Card, Chip, Section, StatTiles } from './widgets'
import EvidencePreviewModal from './EvidencePreviewModal'

const EVIDENCE_ICONS = {
  call_recording: Phone,
  whatsapp_forward: MessageSquare,
  bank_transaction: CreditCard,
  document: FileText,
  network_link: Network,
  screenshot: Image,
  video: Video,
  audio: Volume2,
  email: Mail,
  default: Folder,
}

const CONFIDENCE = {
  high: { chip: 'bg-safe/12 text-safe', label: 'High' },
  medium: { chip: 'bg-amber/12 text-amber', label: 'Medium' },
  low: { chip: 'bg-danger/12 text-danger', label: 'Low' },
}

function getConfidenceLevel(confidence) {
  if (confidence >= 0.9) return 'high'
  if (confidence >= 0.7) return 'medium'
  return 'low'
}

function formatTimestamp(isoString) {
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

function EvidenceItem({ item, onView }) {
  const Icon = EVIDENCE_ICONS[item.type] || EVIDENCE_ICONS.default
  const level = getConfidenceLevel(item.confidence)
  const tone = CONFIDENCE[level]

  return (
    <div className="rounded-xl border border-hairline/80 bg-black/25 p-3 transition-colors hover:border-cyan/40">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-hairline bg-elevated/80">
          <Icon className="h-5 w-5 text-cyan" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h4 className="truncate text-[13px] font-bold text-ink">{item.title}</h4>
            <Chip className={tone.chip}>
              {tone.label} · {Math.round(item.confidence * 100)}%
            </Chip>
          </div>

          <p className="mb-2 line-clamp-2 text-[11.5px] leading-snug text-ink-dim">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-ink-faint">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimestamp(item.timestamp)}
            </span>
            {item.metadata?.duration && (
              <span className="flex items-center gap-1">
                <PlayCircle className="h-3 w-3" />
                {item.metadata.duration}
              </span>
            )}
            {item.metadata?.amount != null && (
              <span className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />
                {formatINR(item.metadata.amount)}
              </span>
            )}
            {item.metadata?.status && (
              <span
                className={cn(
                  'font-bold uppercase tracking-wider',
                  item.metadata.status === 'BLOCKED' ? 'text-safe' : 'text-amber',
                )}
              >
                {item.metadata.status}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="interactive grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-hairline bg-black/20 text-ink-faint hover:text-cyan"
          title="View details"
          aria-label={`View ${item.title}`}
          onClick={() => onView(item)}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function EvidencePanel({ incidentId }) {
  const [previewItem, setPreviewItem] = useState(null)
  const evidence = getEvidenceByIncidentId(incidentId)

  if (!evidence) {
    return (
      <div className="grid place-items-center px-4 py-16 text-center">
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-full border border-hairline bg-black/30">
          <FolderOpen className="h-7 w-7 text-ink-faint" />
        </div>
        <h3 className="text-[15px] font-bold text-ink">No evidence available</h3>
        <p className="mt-1 max-w-xs text-[12px] text-ink-faint">
          Evidence collection is still in progress for this incident. Check back shortly.
        </p>
      </div>
    )
  }

  const items = evidence.evidenceItems
  const totalItems = items.length
  const avgConfidence =
    items.reduce((acc, item) => acc + item.confidence, 0) / Math.max(1, totalItems)
  const uniqueTypes = new Set(items.map((e) => e.type)).size
  const blockedAmount = items
    .filter((item) => item.metadata?.status === 'BLOCKED' && item.metadata?.amount)
    .reduce((acc, item) => acc + item.metadata.amount, 0)

  const custody = [...items].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  )

  return (
    <>
      <Section title="Case file">
        <Card className="flex items-center justify-between gap-3">
          <div>
            <div className="mono-tnum text-[11px] font-bold text-cyan">{evidence.caseId}</div>
            <div className="mt-1 text-[14px] font-bold text-ink">{evidence.incidentTitle}</div>
          </div>
          <Chip className="bg-amber/12 text-amber">Evidence locker</Chip>
        </Card>
      </Section>

      <Section title="Summary">
        <StatTiles
          cols={4}
          items={[
            { label: 'Items', value: totalItems, color: '#22D3EE' },
            {
              label: 'Avg confidence',
              value: `${Math.round(avgConfidence * 100)}%`,
              color: '#34D399',
            },
            { label: 'Types', value: uniqueTypes, color: '#F5A524' },
            {
              label: 'Amount blocked',
              value: formatINR(blockedAmount),
              color: '#34D399',
            },
          ]}
        />
      </Section>

      <Section
        title="Collected evidence"
        right={<span className="text-[10.5px] text-ink-faint">{totalItems} items</span>}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <EvidenceItem key={item.id} item={item} onView={setPreviewItem} />
          ))}
        </div>
      </Section>

      <Section title="Chain of custody">
        <Card>
          <ol className="space-y-3">
            {custody.map((item, idx) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="flex w-3 shrink-0 flex-col items-center pt-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_#22D3EEaa]" />
                  {idx < custody.length - 1 && (
                    <span className="mt-1 h-5 w-px bg-hairline" />
                  )}
                </div>
                <div className="min-w-0 flex-1 text-[12px] text-ink-dim">
                  <span className="font-semibold text-ink">{item.title}</span>
                  <span className="text-ink-faint"> collected</span>
                </div>
                <span className="mono-tnum shrink-0 text-[10.5px] text-ink-faint">
                  {formatTime(item.timestamp)}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </Section>

      <Section title="Actions">
        <div className="grid grid-cols-2 gap-2">
          <Tile
            accent="rgba(34,211,238,0.55)"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan px-3 py-2.5 text-[12.5px] font-bold text-base"
            onClick={() => {}}
          >
            <Download className="h-4 w-4" />
            Download case file
          </Tile>
          <Tile
            accent="rgba(154,176,206,0.45)"
            className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-black/25 px-3 py-2.5 text-[12.5px] font-bold text-ink-dim hover:text-ink"
            onClick={() => {}}
          >
            <Share2 className="h-4 w-4" />
            Share with LEA
          </Tile>
        </div>
      </Section>

      {previewItem && (
        <EvidencePreviewModal
          evidenceItem={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </>
  )
}
