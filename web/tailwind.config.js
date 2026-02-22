/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#3d3d3d',
        'fretboard-bg': '#D2A464',
        'fretboard-root': '#ef4444', // red-500
        'fretboard-triad': '#3b82f6', // blue-500
        'fretboard-scale': '#9ca3af', // gray-400
      },
    },
  },
  plugins: [],
}
