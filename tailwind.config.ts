import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0f14",
          muted: "#5c6673",
          subtle: "#8a95a3",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#eceff2",
          card: "#f4f5f7",
        },
        accent: {
          DEFAULT: "#0f766e",
          hover: "#115e59",
        },
        brand: {
          DEFAULT: "#1e3a5f",
          muted: "#152a45",
          soft: "#eef2f7",
          line: "#c5d0e0",
        },
        tint: {
          violet: "#e8eaef",
          sky: "#e4eaf0",
          amber: "#f2efe9",
        },
        line: "#d4dce4",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "inset 0 1px 0 rgba(255,255,255,0.75), 0 1px 2px rgba(10,15,20,0.04), 0 6px 28px -6px rgba(10,15,20,0.07)",
        "card-hover":
          "inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 6px rgba(10,15,20,0.04), 0 20px 48px -12px rgba(10,15,20,0.12)",
        header:
          "inset 0 -1px 0 rgba(10,15,20,0.04), 0 4px 24px -8px rgba(10,15,20,0.08)",
        panel:
          "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(10,15,20,0.04), 0 24px 48px -16px rgba(10,15,20,0.08)",
      },
      transitionTimingFunction: {
        refined: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        DEFAULT: "220ms",
      },
    },
  },
  plugins: [],
};

export default config;
