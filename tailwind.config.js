/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'seoul-red': '#E53E3E',
        'seoul-blue': '#3182CE',
        'seoul-green': '#38A169',
        'hanbok-pink': '#ED64A6',
        'hanbok-purple': '#9F7AEA',
      },
      fontFamily: {
        'korean': ['Noto Sans KR', 'sans-serif'],
      }
    },
  },
  plugins: [],
}