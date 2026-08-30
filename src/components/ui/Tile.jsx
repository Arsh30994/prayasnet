import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const EASE = [0.22, 1, 0.36, 1]

// Every clickable surface in the dashboard routes through here so the
// affordance is identical: pointer cursor, accent-tinted glow, slight lift.
// The lift is a motion value rather than a CSS transform so it composes with
// whatever else framer-motion is animating on the element.
export default function Tile({
  as = 'button',
  accent = 'rgba(34, 211, 238, 0.55)',
  lift = 3,
  className,
  style,
  children,
  ...rest
}) {
  const Cmp = motion[as] || motion.button

  return (
    <Cmp
      {...(as === 'button' ? { type: 'button' } : {})}
      className={cn('interactive text-left', className)}
      style={{ '--glow': accent, ...style }}
      whileHover={{ y: -lift }}
      whileTap={{ y: -1 }}
      transition={{ duration: 0.22, ease: EASE }}
      {...rest}
    >
      {children}
    </Cmp>
  )
}
