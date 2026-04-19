/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#B8860B',
        'gold-light': '#D4A017',
        cream: '#FAFAF8',
        'warm-white': '#F5F4F0',
        brand: '#111111',
        burgundy: '#7B2D3A',
        'text-dark': '#111111',
        'text-muted': '#6B7280',
        border: '#E5E5E5',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      transitionDuration: {
        '250': '250ms',
        '600': '600ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
        '107': '1.07',
        '108': '1.08',
      },
    },
  },
  plugins: [],
}
