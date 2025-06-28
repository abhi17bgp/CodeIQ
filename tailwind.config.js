/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      animation: {
        swingIn: "swingIn 1.5s ease-out forwards",
        ropeDrop: "ropeDrop 1s ease-out forwards",
        ropeBounce: "ropeBounce 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
