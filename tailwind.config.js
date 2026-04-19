/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.75" },
          "70%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.3, 1) infinite",
      },
      fontFamily: {
        sans: [
          "var(--font-poppins)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: [
          "var(--font-dm-serif-text)",
          "ui-serif",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      screens: {
        "can-hover": { raw: "(hover: hover) and (pointer: fine)" },
      },
    },
  },
  plugins: [],
};
