/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Roboto Flex", "system-ui", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        roboto: ["Roboto Flex", "sans-serif"],
      },
      transitionDuration: {
        'theme': '200ms',
      },
      transitionTimingFunction: {
        'theme': 'ease-in-out',
      }
    },
  },
  plugins: [],
};
