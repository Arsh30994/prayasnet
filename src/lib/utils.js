// Tiny classnames helper (no external dep)
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

// Deterministic seeded RNG (mulberry32) — guarantees identical layouts every run.
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Linear interpolation
export const lerp = (a, b, t) => a + (b - a) * t

// Clamp
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Map elapsed time across keyframe stops -> interpolated value.
// stops: [{ t: ms, v: number }, ...] sorted by t
export function rampValue(elapsed, stops) {
  if (elapsed <= stops[0].t) return stops[0].v
  const last = stops[stops.length - 1]
  if (elapsed >= last.t) return last.v
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]
    if (elapsed >= a.t && elapsed <= b.t) {
      const f = (elapsed - a.t) / (b.t - a.t)
      // ease in-out for smooth, cinematic ramps
      const eased = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2
      return lerp(a.v, b.v, eased)
    }
  }
  return last.v
}

// Format Indian Rupees with lakh/crore grouping
export function formatINR(n) {
  const num = Math.round(n)
  const str = num.toString()
  if (str.length <= 3) return '₹' + str
  const last3 = str.slice(-3)
  const rest = str.slice(0, -3)
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return '₹' + grouped + ',' + last3
}

// Compact INR for big headline figures: ₹4.2 Cr / ₹38 L
export function formatINRCompact(n) {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.00$/, '') + ' Cr'
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1).replace(/\.0$/, '') + ' L'
  return formatINR(n)
}
