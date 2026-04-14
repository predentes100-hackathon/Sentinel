/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        panel: "#0f1729",
        accent: {
          1: "#6ee7ff",
          2: "#8b5cf6",
          3: "#f59e0b",
          4: "#22c55e",
          5: "#ef4444"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.05), 0 24px 80px rgba(0,0,0,0.45)"
      },
      animation: {
        "float-up": "floatUp 850ms ease-out forwards",
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.9)" },
          "20%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-20px) scale(1.04)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      }
    }
  },
  plugins: []
};
