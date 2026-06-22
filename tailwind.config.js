/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Command-center surface palette
        base: '#0B1120',
        surface: '#0E1628',
        panel: '#111C32',
        elevated: '#16223C',
        hairline: '#1E2A44',
        // Agent / status identity colors
        cyan: {
          DEFAULT: '#22D3EE',
          soft: '#67E8F9',
          deep: '#0E7490',
        },
        amber: {
          DEFAULT: '#F5A524',
          soft: '#FBBF24',
        },
        danger: {
          DEFAULT: '#F43F5E',
          soft: '#FB7185',
        },
        safe: {
          DEFAULT: '#34D399',
          soft: '#6EE7B7',
        },
        violet: {
          DEFAULT: '#A78BFA',
        },
        ink: {
          DEFAULT: '#E6EDF7',
          dim: '#9AB0CE',
          faint: '#5C7196',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 0 1px rgba(34,211,238,0.35), 0 0 24px -4px rgba(34,211,238,0.55)',
        'glow-amber': '0 0 0 1px rgba(245,165,36,0.4), 0 0 24px -4px rgba(245,165,36,0.55)',
        'glow-danger': '0 0 0 1px rgba(244,63,94,0.45), 0 0 28px -4px rgba(244,63,94,0.6)',
        'glow-safe': '0 0 0 1px rgba(52,211,153,0.4), 0 0 24px -4px rgba(52,211,153,0.55)',
        'panel': '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.8)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.2,1) infinite',
        shimmer: 'shimmer 1.6s infinite',
        'grid-pan': 'grid-pan 6s linear infinite',
      },
    },
  },
  plugins: [],
}
