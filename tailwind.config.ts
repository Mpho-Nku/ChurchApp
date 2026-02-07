import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f2937", // slate-800
          accent: "#f59e0b",  // amber-500
        }
      }
    },
  },
   keyframes: {
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.2s ease-out",
      },
  plugins: [],
};
export default config;
