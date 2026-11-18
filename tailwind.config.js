/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: 'rgb(var(--navy-950) / <alpha-value>)', 900: 'rgb(var(--navy-900) / <alpha-value>)', 800: 'rgb(var(--navy-800) / <alpha-value>)', 700: 'rgb(var(--navy-700) / <alpha-value>)' },
        sky: { soft: 'rgb(var(--sky-soft) / <alpha-value>)', line: 'rgb(var(--sky-line) / <alpha-value>)' },
        gold: { DEFAULT: 'rgb(var(--gold) / <alpha-value>)', light: 'rgb(var(--gold-light) / <alpha-value>)' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], serif: ['"Playfair Display"', 'Georgia', 'serif'] },
      boxShadow: { card: '0 10px 30px -12px rgba(11,31,75,.25)' },
    },
  },
  plugins: [],
}
