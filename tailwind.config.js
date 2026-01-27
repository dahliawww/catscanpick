/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#563F2E",
        },
        brand: {
          beige: "#e8e3df",
          gold: "#aa9880",
          red: "#935945",
          yellow: "#FFC408",
          pink: "#fad5dc",
          lightpink: "#fce1e6",
        },
        text: {
          dark: "#333333",
        },
      },
      fontFamily: {
        huninn: ["jf-openhuninn", "sans-serif"],
        kirang: ['"Kirang Haerang"', "cursive"],
      },
    },
  },
  plugins: [],
};
