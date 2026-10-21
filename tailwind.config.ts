import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
      colors: {
        ink: "#10131a",
        muted: "#6f727a",
        panel: "#f3f4f6",
        lime: "#DFF50A",
      },
    },
  },
  plugins: [],
};

export default config;
