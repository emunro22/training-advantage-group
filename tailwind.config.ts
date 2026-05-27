import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0d1b4b",
          light: "#1a2b6b",
          dark: "#080f2e",
        },
        blue: {
          brand: "#0066cc",
          light: "#3399ff",
          dark: "#004d99",
        },
        orange: {
          brand: "#ff6600",
          light: "#ff8533",
          dark: "#cc5200",
        },
        red: {
          brand: "#cc0000",
          light: "#ff3333",
          dark: "#990000",
        },
        gray: {
          light: "#f4f7fa",
          mid: "#e8edf4",
          dark: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.15)",
        glow: "0 0 30px rgba(0,102,204,0.3)",
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(135deg, #0d1b4b 0%, #1a2b6b 100%)",
        "gradient-hero": "linear-gradient(135deg, #080f2e 0%, #0d1b4b 50%, #0066cc 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
