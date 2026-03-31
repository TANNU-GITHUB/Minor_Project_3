/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf9',
          500: '#2dd4bf',
          600: '#14b8a6',
        },
        secondary: {
          500: '#818cf8',
          600: '#6366f1',
        },
        accent: {
          pink: '#f472b6',
        },
        text: {
          dark: '#1e293b',
          muted: '#64748b',
        },
      },
      backgroundImage: {
        'gradient-mesh': 'linear-gradient(135deg, #c8f0ea 0%, #d6e4f7 40%, #e8d5f5 100%)',
      },
      backdropBlur: {
        glass: '18px',
        'glass-lg': '24px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 20px 60px rgba(45, 212, 191, 0.12), 0 4px 16px rgba(0,0,0,0.08)',
        glow: '0 0 16px rgba(45, 212, 191, 0.5)',
      },
      animation: {
        'gradient-shift': 'gradientShift 12s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'float-more-delayed': 'float 10s ease-in-out infinite 4s',
        'pulse-border': 'pulseBorder 2s ease-in-out infinite',
        'count-up': 'countUp 0.3s ease-out',
        'shimmer': 'shimmer 0.6s ease',
        'typing': 'typing 0.6s steps(3, end) infinite',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(5deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-3deg)' },
        },
        pulseBorder: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(45, 212, 191, 0.7)' },
          '50%': { boxShadow: '0 0 0 8px rgba(45, 212, 191, 0)' },
        },
        countUp: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        typing: {
          'to': { width: '100%' },
        },
      },
      fontSize: {
        'display': ['56px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'subheading': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      fontFamily: {
        'display': ['Clash Display', 'sans-serif'],
        'heading': ['Sora', 'sans-serif'],
        'body': ['DM Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
