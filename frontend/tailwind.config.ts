import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9f4",
          100: "#d7f2e3",
          500: "#179a62",
          600: "#138152",
          700: "#0f6642"
        }
      },
      boxShadow: {
        card: "0 8px 24px rgba(7, 43, 25, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
