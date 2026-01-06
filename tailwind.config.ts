import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  // Enable class-based dark mode
  darkMode: 'class',

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
        // Noir principal (Charcoal)
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
        // Blanc/Gris clair (Ivory)
        ivory: {
          DEFAULT: '#FAFAFA',
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#E5E5E5',
          400: '#D4D4D4',
          500: '#A3A3A3',
        },
        // Or luxe (Gold)
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
        // Rose poudré (Blush)
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
        display: ['Playfair Display', 'Georgia', 'serif'], // J'ai ajouté Playfair Display si tu l'utilises, sinon garde Georgia
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
        '3xl': '24px', // Ajouté pour les cartes modernes
      },

      // ==========================================
      // ANIMATIONS (Mises à jour pour 2026)
      // ==========================================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', // Plus fluide
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'bounce-soft': 'bounceSoft 1s infinite',
        'spin-slow': 'spin 3s linear infinite',
        // NOUVEAUX AJOUTS
        'float': 'float 3s ease-in-out infinite', // Pour les badges
        'shine': 'shine 0.7s ease-in-out', // Pour le bouton gold
        'pulse-gold': 'pulseGold 2s infinite', // Pour les bordures actives
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
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
        // NOUVEAUX KEYFRAMES
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-150%) skewX(-15deg)' },
          '100%': { transform: 'translateX(150%) skewX(-15deg)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198, 169, 97, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(198, 169, 97, 0)' },
        }
      },

      // ==========================================
      // TRANSITIONS
      // ==========================================
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ==========================================
      // SHADOWS (Lumières)
      // ==========================================
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.04)',
        'medium': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'strong': '0 16px 40px rgba(0, 0, 0, 0.12)',
        'gold': '0 8px 20px rgba(198, 169, 97, 0.3)', // Ajusté à la couleur gold définie
        'whatsapp': '0 10px 30px rgba(37, 211, 102, 0.3)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)', // Nouvel effet relief
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
