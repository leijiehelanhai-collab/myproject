/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        game: {
          black: '#0a0a0f',
          dark: '#13131f',
          card: 'rgba(20, 20, 35, 0.6)',
          input: 'rgba(30, 30, 50, 0.4)',
          void: '#050505', // Deep Void Black
        },
        neon: {
          blue: '#00f3ff',
          pink: '#ff0099',
          green: '#00ff9d',
          purple: '#bc13fe',
          yellow: '#f9f871',
          cyan: '#00f3ff', // Neon Cyan
          hotpink: '#ff0099', // Hot Pink
          amber: '#ffc107', // Golden Amber
        }
      },
      fontFamily: {
        game: ['"Orbitron"', '"Exo 2"', 'sans-serif'], // Main game titles
        body: ['"Exo 2"', '"Inter"', 'sans-serif'], // Body text
        mono: ['"Space Mono"', '"JetBrains Mono"', '"Courier New"', 'monospace'], // Monospace for numbers and code
        tech: ['"Rajdhani"', '"Saira Condensed"', '"Inter"', 'sans-serif'], // Tech font for labels
        display: ['"Audiowide"', '"Orbitron"', 'sans-serif'], // Large display text
        cyber: ['"Electrolize"', '"Michroma"', 'sans-serif'], // Cyberpunk style
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glitch': 'glitch 1s linear infinite',
        'grid-move': 'grid-move 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 243, 255, 0.2), 0 0 10px rgba(0, 243, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 243, 255, 0.6), 0 0 40px rgba(0, 243, 255, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        'grid-move': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        }
      }
    },
  },
  plugins: [],
}
