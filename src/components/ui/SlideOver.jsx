import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const EASE = [0.22, 1, 0.36, 1]

// Right-hand slide-over used by every drill-down. Dismissible three ways:
// the X button, a click on the dark overlay, or Esc.
export default function SlideOver({
  open,
  onClose,
  title,
  subtitle,
  accent = '#22D3EE',
  icon: Icon,
  badge,
  children,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute right-0 top-0 flex h-full w-[min(600px,94vw)] flex-col border-l border-hairline bg-surface/95 shadow-panel backdrop-blur-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            {/* accent hairline down the leading edge */}
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-px"
              style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }}
            />
            <span
              className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full blur-3xl"
              style={{ background: `${accent}1f` }}
            />

            <header className="relative flex items-start gap-3 border-b border-hairline/80 px-5 py-4">
              {Icon && (
                <span
                  className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1"
                  style={{
                    background: `${accent}1a`,
                    borderColor: 'transparent',
                    boxShadow: `inset 0 0 0 1px ${accent}40`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[16px] font-extrabold tracking-tight text-ink">
                    {title}
                  </h2>
                  {badge && (
                    <span
                      className="shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: `${accent}1f`, color: accent }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="mt-0.5 truncate text-[12px] text-ink-faint">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className={cn(
                  'interactive grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-hairline',
                  'bg-black/25 text-ink-dim hover:text-ink',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
