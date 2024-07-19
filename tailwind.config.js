/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      //colors
      colors: {
        bl: "#3b82f6",
        bg: {
          1: "#e2e8f0",
          2: "#cbd5e1",
        },
        primary: "#000",
      },
    },
  },
  plugins: [],
};
