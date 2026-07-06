/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Sistema dual Vanellix adaptado a Nativa Sur ──
        light: {
          background:        '#F5F0E8',
          surface:           '#FFFFFF',
          'surface-secondary': '#EDE8DF',
          'text-primary':    '#1A2E0F',
          'text-secondary':  '#5A6B4A',
          accent:            '#2D4A1E',
          'accent-secondary':'#8B6914',
          error:             '#C0392B',
          border:            '#D5CEC3',
        },
        dark: {
          background:        '#0A1205',
          surface:           '#1A2E0F',
          'surface-secondary':'#243D17',
          'text-primary':    '#F5F0E8',
          'text-secondary':  '#A8B89A',
          accent:            '#5A7A3A',
          'accent-secondary':'#C49A20',
          error:             '#E74C3C',
          border:            '#2D4A1E',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Lato', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
