/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#f8f4ed",
          DEFAULT: "#CAAD5F",
          dark: "#563F2E",
        },
        brand: {
          beige: "#e8e3df",
          gold: "#aa9880",
          red: "#935945",
          darkred: "#764737",
        },
        text: {
          dark: "#333333",
        },
      },
    },
  },
  plugins: [],
};
