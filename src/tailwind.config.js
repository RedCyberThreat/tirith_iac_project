// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#a4fbff',
        'primary-red': '#310f0e',
        'secondary-red': '#f75049',
        'tertiary-red': '#451b16',
        'quaternary-red': '#f19e94',
        'light-black': '#0d0d12',
        'lighter-black': '#0d0d16',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
};