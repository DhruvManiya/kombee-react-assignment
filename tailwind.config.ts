import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#e8fffe",
          "100": "#c5fffe",
          "200": "#92fffc",
          "300": "#47fffb",
          "400": "#00faff",
          "500": "#00dcff",
          "600": "#00add7",
          "700": "#0088ac",
          "800": "#007190", // Base color
          "900": "#055974",
          "950": "#003b51",
        },

        secondary: {
          "50": "#f3f6f8",
          "100": "#e1eaec",
          "200": "#c7d6da",
          "300": "#8daab3", // Base color
          "400": "#72939e",
          "500": "#577883",
          "600": "#4b646f",
          "700": "#41545d",
          "800": "#3b484f",
          "900": "#343e45",
          "950": "#20282c",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
