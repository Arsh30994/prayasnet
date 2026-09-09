import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CreditCard,
  Download,
  FilePlus,
  FileText,
  Flag,
  Folder,
  Image,
  Mail,
  MessageSquare,
  Network,
  Phone,
  Video,
  Volume2,
  X,
} from 'lucide-react'
import { formatINR, cn } from '../lib/utils'
import Tile from '../components/ui/Tile'
import { Chip } from './widgets'

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

function MetaCell({ label, value }) {
  if (value == null || value === '') return null
  const display = Array.isArray(value) ? value.join(', ') : String(value)
  return (
    <div className="rounded-xl border border-hairline/80 bg-black/25 px-3 py-2">
      <div className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">
        {label}
      </div>
      <div className="mt-1 break-words text-[12px] font-semibold text-ink">{display}</div>
    </div>
  )
}

// Centered modal for a single evidence item — sits above the slide-over (z-[110]).
export default function EvidencePreviewModal({ evidenceItem, onClose }) {
  useEffect(() => {
    if (!evidenceItem) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [evidenceItem, onClose])

  if (!evidenceItem) return null

  const item = evidenceItem
  const Icon = EVIDENCE_ICONS[item.type] || EVIDENCE_ICONS.default
  const level = getConfidenceLevel(item.confidence)
  const tone = CONFIDENCE[level]
  const meta = item.metadata || {}

  // Flatten scalar metadata for the grid; lists are shown as dedicated sections.
  const metaEntries = Object.entries(meta).filter(
    ([key, value]) =>
      !['redFlags', 'forgeryIndicators'].includes(key) &&
      value != null &&
      !Array.isArray(value),
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" data-evidence-preview>
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-h-[min(86vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-hairline bg-surface/95 p-5 shadow-panel backdrop-blur-xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="interactive absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-hairline bg-black/25 text-ink-dim hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-4 flex items-start gap-3 pr-10">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-cyan/30 bg-cyan/10">
              <Icon className="h-7 w-7 text-cyan" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-extrabold text-ink">{item.title}</h3>
                <Chip className={tone.chip}>
                  {tone.label} · {Math.round(item.confidence * 100)}%
                </Chip>
              </div>
              <p className="text-[12.5px] leading-relaxed text-ink-dim">{item.description}</p>
              <div className="mono-tnum mt-1.5 text-[10.5px] text-ink-faint">
                {formatTimestamp(item.timestamp)} · {item.type.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {metaEntries.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                Metadata
              </div>
              <div className="grid grid-cols-2 gap-2">
                {metaEntries.map(([key, value]) => (
                  <MetaCell
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1')}
                    value={
                      key === 'amount' || key === 'totalValue' ? formatINR(value) : value
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {Array.isArray(meta.redFlags) && meta.redFlags.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                <AlertTriangle className="h-3 w-3 text-danger" />
                Red flags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {meta.redFlags.map((flag) => (
                  <Chip key={flag} className="bg-danger/12 text-danger">
                    {flag}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(meta.forgeryIndicators) && meta.forgeryIndicators.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                <Flag className="h-3 w-3 text-amber" />
                Forgery indicators
              </div>
              <ul className="space-y-1.5">
                {meta.forgeryIndicators.map((ind) => (
                  <li
                    key={ind}
                    className="flex items-start gap-2 rounded-lg border border-amber/20 bg-amber/[0.06] px-2.5 py-1.5 text-[11.5px] text-ink-dim"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 border-t border-hairline/80 pt-4">
            <Tile
              accent="rgba(34,211,238,0.55)"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan px-2 py-2.5 text-[11.5px] font-bold text-base"
              onClick={() => {}}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Tile>
            <Tile
              accent="rgba(245,165,36,0.55)"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-amber/30 bg-amber/10 px-2 py-2.5 text-[11.5px] font-bold text-amber"
              onClick={() => {}}
            >
              <Flag className="h-3.5 w-3.5" />
              Flag
            </Tile>
            <Tile
              accent="rgba(154,176,206,0.45)"
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl border border-hairline',
                'bg-black/25 px-2 py-2.5 text-[11.5px] font-bold text-ink-dim hover:text-ink',
              )}
              onClick={() => {}}
            >
              <FilePlus className="h-3.5 w-3.5" />
              Report
            </Tile>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
