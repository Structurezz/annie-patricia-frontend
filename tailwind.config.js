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
        gold: '#C9A96E',
        'gold-light': '#E8C98A',
        cream: '#FAF6F0',
        'warm-white': '#F5F0E8',
        brand: '#0C0B09',
        burgundy: '#7B2D3A',
        'text-dark': '#1A1208',
        'text-muted': '#8C7B6B',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
