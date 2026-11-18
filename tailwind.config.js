/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#071536', 900: '#0B1F4B', 800: '#12306B', 700: '#1B4290' },
        sky: { soft: '#EAF1FB', line: '#D3E1F5' },
        gold: { DEFAULT: '#C9A24B', light: '#E8D39A' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], serif: ['"Playfair Display"', 'Georgia', 'serif'] },
      boxShadow: { card: '0 10px 30px -12px rgba(11,31,75,.25)' },
    },
  },
  plugins: [],
}
