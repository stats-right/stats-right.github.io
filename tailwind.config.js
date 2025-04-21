/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'rs-brown': {
          DEFAULT: '#78501b',
          dark: '#593c15',
          light: '#9e6d2c',
        },
        'rs-gold': {
          DEFAULT: '#c9a83a',
          dark: '#a98c30',
          light: '#e4c157',
        },
        'rs-parchment': {
          DEFAULT: '#d9cca1',
          dark: '#c0b38a',
          light: '#e6ddbf',
        },
        'rs-black': '#141412',
        'rs-text': '#3c2e13',
        'rs-highlight': '#f5a800',
      },
      fontFamily: {
        'rs': ['Georgia', 'serif'],
      },
      boxShadow: {
        'rs': '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'rs-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'rs-pulse': 'rs-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rs-glow': 'rs-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'rs-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'rs-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(201, 168, 58, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(201, 168, 58, 0.8)' },
        },
      },
      backgroundImage: {
        'rs-gradient': 'linear-gradient(to bottom, #d9cca1, #c0b38a)',
        'rs-header': 'linear-gradient(to bottom, #9e6d2c, #78501b)',
        'rs-button': 'linear-gradient(to bottom, #c9a83a, #a98c30)',
        'rs-button-hover': 'linear-gradient(to bottom, #e4c157, #c9a83a)',
      },
    },
  },
  plugins: []
} 