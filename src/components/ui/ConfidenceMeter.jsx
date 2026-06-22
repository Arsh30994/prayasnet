import { motion } from 'framer-motion'

// Animated horizontal confidence bar with a glowing fill.
export default function ConfidenceMeter({ value, color = '#F43F5E', height = 10 }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-full bg-black/40"
      style={{ height }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}55, ${color})`,
          boxShadow: `0 0 16px ${color}aa`,
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      {/* tick marks */}
      <div className="pointer-events-none absolute inset-0 flex justify-between px-[2px]">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="w-px bg-white/5" />
        ))}
      </div>
    </div>
  )
}
