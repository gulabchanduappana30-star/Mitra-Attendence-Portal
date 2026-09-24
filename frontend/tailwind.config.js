/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../backend/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        gold: {
          50: '#fffdf0',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
          950: '#260e01'
        },
        cyber: {
          yellow: '#F59E0B',
          accent: '#FBBF24',
          black: '#000000',
          dark: '#0A0D14',
          cardDark: '#111520',
          cardLight: '#FFFFFF',
          borderDark: '#1E2433',
          borderLight: '#E2E8F0',
          cream: '#FFFBEB'
        },
        batch: {
          vibe: '#F59E0B',
          ai: '#06B6D4',
          marketing: '#F97316',
          industry: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'cyber-sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'cyber-md': '0 8px 24px -4px rgba(0, 0, 0, 0.12)',
        'cyber-gold': '0 0 25px -4px rgba(250, 198, 0, 0.35)',
        'cyber-dark': '0 12px 36px -6px rgba(0, 0, 0, 0.45)',
        'pill': '0 4px 14px 0 rgba(0, 0, 0, 0.15)'
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
