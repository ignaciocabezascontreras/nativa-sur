/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        light: {
          background:          '#F2F2F7',
          surface:             '#FFFFFF',
          'surface-secondary': '#F2F2F7',
          'text-primary':      '#1C1C1E',
          'text-secondary':    '#8E8E93',
          accent:              '#009246',
          'accent-hover':      '#007A3A',
          error:               '#FF3B30',
          border:              '#E5E5EA',
        },
        dark: {
          background:          '#000000',
          surface:             '#1C1C1E',
          'surface-secondary': '#2C2C2E',
          'text-primary':      '#FFFFFF',
          'text-secondary':    '#8E8E93',
          accent:              '#30D158',
          'accent-hover':      '#28B54A',
          error:               '#FF453A',
          border:              '#38383A',
        },
        /* ── Paleta Nativa Sur ── */
        ns: {
          deep:      '#0f1f0a',
          dark:      '#1c3a10',
          mid:       '#2e5e1a',
          sage:      '#5a7d45',
          light:     '#8fb87a',
          mist:      '#d4e6c3',
          warm:      '#a0622a',
          sand:      '#c9a46e',
          honey:     '#e8c882',
          cream:     '#f2ebe0',
          linen:     '#e8dfd0',
          paper:     '#f9f5ef',
          page:      '#f9f5ef',
          card:      '#ffffff',
          section:   '#f2ebe0',
          border:    '#ddd5c5',
          'text-dark':  '#1a120a',
          'text-mid':   '#4a3728',
          'text-light': '#7a6555',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'apple':    '0 2px 20px rgba(0,0,0,0.08)',
        'apple-md': '0 4px 40px rgba(0,0,0,0.12)',
        'apple-lg': '0 8px 60px rgba(0,0,0,0.16)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
