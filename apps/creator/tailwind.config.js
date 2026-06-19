/** @type {import('tailwindcss').Config} */
// Tokens carry the documented LOCATIAL design system (docs/DESIGN-SYSTEM.md).
// Kept minimal + semantic — the visual identity is intentionally replaceable.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        signal: '#FF2D7A',
        'signal-dim': '#FF2D7ACC',
        night: '#0a0a0b',
        root: '#000000',
        surface1: '#111111',
        surface2: '#1a1a1a',
        'gray-hi': '#555555',
        'gray-mid': '#999999',
        'gray-lo': '#bbbbbb',
        'gray-rule': '#333333',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
