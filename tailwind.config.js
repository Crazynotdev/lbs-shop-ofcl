/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00D084',
          'green-dark': '#00A86B',
          'green-light': '#00F09A',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          50: '#111111',
          100: '#1A1A1A',
          200: '#242424',
          300: '#2E2E2E',
          400: '#383838',
          500: '#4A4A4A',
        },
        light: {
          DEFAULT: '#FFFFFF',
          muted: '#A8A8A8',
          subtle: '#6B6B6B',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-left': 'slideLeft 0.4s ease forwards',
        'slide-right': 'slideRight 0.4s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        shimmer: 'shimmer 2s infinite',
        'pulse-green': 'pulseGreen 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 208, 132, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0, 208, 132, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'green-glow': '0 0 30px rgba(0, 208, 132, 0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'inner-border': 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
};
