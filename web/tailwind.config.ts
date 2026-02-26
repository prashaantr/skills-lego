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
        background: "#0D0D14",
        surface: "#16161F",
        border: "#2A2A3C",
        accent: "#A259FF",
        "accent-hover": "#B87AFF",
        text: "#FFFFFF",
        "text-muted": "#9CA3AF",
      },
    },
  },
  plugins: [],
};
export default config;
