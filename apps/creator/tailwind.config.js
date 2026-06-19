/** @type {import('tailwindcss').Config} */
// Tokens matched to the live locatial.io look: dark #131313, violet #6211DC accent,
// geometric sans (Gilroy on the real site → Poppins here as the closest free match).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        signal: '#6211DC',
        'signal-dim': '#6211DCCC',
        lime: '#c8f000',
        night: '#131313',
        root: '#0e0e0e',
        surface1: '#1b1b1b',
        surface2: '#242424',
        'gray-hi': '#6b6b6b',
        'gray-mid': '#8a8a8a',
        'gray-lo': '#b6b6b6',
        'gray-rule': '#2c2c2c',
        chalk: '#f2f2f2',
      },
      fontFamily: {
        sans: ['Poppins', 'Gilroy', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
