// Stylized low-poly India silhouette (decorative, not survey-accurate).
// Drawn in a 0–100 coordinate space, shared by the Crime Map and the
// incident-location mini map so a city sits in the same spot on both.
export const INDIA_PATH =
  'M38 18 L46 20 L56 26 L64 30 L72 33 L80 39 L73 43 L70 48 L72 53 L67 60 ' +
  'L60 68 L54 76 L50 82 L45 88 L41 82 L37 75 L33 67 L30 61 L27 54 L24 49 ' +
  'L22 45 L26 42 L28 36 L31 31 L34 24 Z'

// Threat-density color ramp used by both map surfaces.
export function levelColor(level) {
  if (level >= 0.8) return '#F43F5E'
  if (level >= 0.62) return '#F5A524'
  return '#22D3EE'
}
