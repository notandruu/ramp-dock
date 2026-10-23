import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // The Figma (Ramp's design system, via html.to.design) sets everything in Arial.
        sans: ["Arial", "Helvetica", "sans-serif"],
        // Phone UI reads as iOS.
        ios: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Inter", "system-ui", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
      colors: {
        ink: "#0c0a08",
        muted: "rgba(12, 10, 8, 0.6)",
        panel: "#f4f2f0",
        line: "#d2cecb",
        night: "#1a1919",
        lime: "#e4f222",
      },
    },
  },
  plugins: [],
};

export default config;
