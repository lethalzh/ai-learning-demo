/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(2)", opacity: "0" }
        }
      },
      animation: {
        breathe: "breathe 2.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
