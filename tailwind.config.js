/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdf8ef',
          100: '#f4e4c1',
          200: '#e8d5b7',
          300: '#d4c4a0',
          400: '#c9a227',
          500: '#b8941f',
          600: '#a07a15',
          700: '#8a6510',
          800: '#6e4f0d',
          900: '#52390a',
        },
        abyss: {
          50: '#e8e8f0',
          100: '#c5c5d9',
          200: '#9f9fbf',
          300: '#7a7aa6',
          400: '#5e5e91',
          500: '#43437c',
          600: '#3d3d6b',
          700: '#333357',
          800: '#1a1a2e',
          900: '#0f0f1a',
          950: '#080812',
        },
        gold: {
          50: '#fef9e7',
          100: '#fcf0c5',
          200: '#f9e39a',
          300: '#f5d565',
          400: '#e8c340',
          500: '#d4af37',
          600: '#b8941f',
          700: '#9a7516',
          800: '#7c5a10',
          900: '#5e410b',
        },
        blood: {
          500: '#8b1a1a',
          600: '#6b1414',
          700: '#4a0e0e',
        },
        forest: {
          500: '#2d5a27',
          600: '#1e4a18',
          700: '#143a10',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        medieval: ['MedievalSharp', 'cursive'],
        decorative: ['Cinzel Decorative', 'serif'],
        lora: ['Lora', 'serif'],
      },
      backgroundImage: {
        'parchment-texture': 'linear-gradient(135deg, #f4e4c1 0%, #e8d5b7 50%, #f4e4c1 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #d4af37, #f5d565, #d4af37)',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 30px rgba(212, 175, 55, 0.4)',
        'inner-gold': 'inset 0 0 20px rgba(212, 175, 55, 0.1)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
