import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  
  theme: {
    extend: {
      // ==========================================
      // COULEURS SAMIAH COSMETICS - Thème Luxe Noir/Blanc/Or
      // ==========================================
      colors: {
        // Noir principal
        charcoal: {
          DEFAULT: '#0A0A0A',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        // Blanc/Gris clair
        ivory: {
          DEFAULT: '#FAFAFA',
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#E5E5E5',
          400: '#D4D4D4',
          500: '#A3A3A3',
        },
        // Or luxe (accent)
        gold: {
          DEFAULT: '#C6A961',
          50: '#FBF9F3',
          100: '#F5F0E1',
          200: '#EBE1C3',
          300: '#DFCEA0',
          400: '#D4BC7E',
          500: '#C6A961',
          600: '#B8994D',
          700: '#9A7F3F',
          800: '#7C6633',
          900: '#5E4D27',
        },
        // Rose poudré (accent subtil)
        blush: {
          DEFAULT: '#E8D5D5',
          50: '#FAF7F7',
          100: '#F5EFEF',
          200: '#E8D5D5',
          300: '#D9BABA',
          400: '#C99F9F',
        },
      },

      // ==========================================
      // TYPOGRAPHIE
      // ==========================================
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'ui-serif', 'Times New Roman', 'serif'],
        display: ['Georgia', 'ui-serif', 'Times New Roman', 'serif'],
      },

      // ==========================================
      // ESPACEMENTS & TAILLES
      // ==========================================
      maxWidth: {
        'container': '1160px',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },

      // ==========================================
      // ANIMATIONS
      // ==========================================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'bounce-soft': 'bounceSoft 1s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },

      // ==========================================
      // TRANSITIONS
      // ==========================================
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ==========================================
      // SHADOWS
      // ==========================================
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.04)',
        'medium': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'strong': '0 16px 40px rgba(0, 0, 0, 0.12)',
        'gold': '0 8px 20px rgba(217, 181, 108, 0.3)',
        'whatsapp': '0 10px 30px rgba(37, 211, 102, 0.3)',
      },

      // ==========================================
      // BACKDROP BLUR
      // ==========================================
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  plugins: [
    forms,
    typography,
  ],
} satisfies Config
