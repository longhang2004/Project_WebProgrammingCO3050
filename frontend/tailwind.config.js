/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Xanh dương làm màu chủ đạo
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ... các plugin khác
  ],

};  