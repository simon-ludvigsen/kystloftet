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
        hav: {
          50: "#eff8ff",
          100: "#dbeffe",
          200: "#bfe3fd",
          300: "#93d2fb",
          400: "#60b7f7",
          500: "#3b97f2",
          600: "#1d74e7",
          700: "#1a60d4",
          800: "#1c4fac",
          900: "#1c4488",
          950: "#152b54",
        },
        kyst: {
          50: "#f0fdf9",
          100: "#ccfbee",
          200: "#99f5dd",
          300: "#5ee9c8",
          400: "#2dd5b0",
          500: "#15b998",
          600: "#0d9479",
          700: "#0e7663",
          800: "#0f5e51",
          900: "#104d43",
          950: "#042e28",
        },
        sand: {
          50: "#fdf8ee",
          100: "#f9efd2",
          200: "#f2dca1",
          300: "#eac46a",
          400: "#e3aa40",
          500: "#d98e24",
          600: "#c06e1a",
          700: "#9f5219",
          800: "#82421b",
          900: "#6b3618",
          950: "#3d1b09",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
