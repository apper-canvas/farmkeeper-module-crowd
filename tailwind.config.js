/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7e6',
          100: '#d4e8b8',
          200: '#b8d988',
          300: '#9cc957',
          400: '#80ba26',
          500: '#2D5016',
          600: '#254213',
          700: '#1d3310',
          800: '#15250c',
          900: '#0d1608'
        },
        secondary: {
          50: '#fdf7e6',
          100: '#f9e8b8',
          200: '#f5d988',
          300: '#f1ca57',
          400: '#edbb26',
          500: '#8B6914',
          600: '#7a5c12',
          700: '#684f0f',
          800: '#57420d',
          900: '#45350a'
        },
        accent: {
          50: '#fdf2e9',
          100: '#fcdcc4',
          200: '#fac59e',
          300: '#f8af79',
          400: '#f69854',
          500: '#E67E22',
          600: '#d06f1e',
          700: '#b9601a',
          800: '#a35116',
          900: '#8c4212'
        },
        surface: '#F5F3F0',
        background: '#FAFAF8',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB'
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}