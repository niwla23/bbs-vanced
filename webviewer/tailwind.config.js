/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        "darkest": "#0C0A09",
        "dark": "#1C1917",
        "primary": "#22C55E",
        "secondary": "#262626",
        "brightest": "#F2F2F2",
        "colborder": "#27272a",
        "muted": "#A1A1AA"
      },
      fontFamily: {
        "sans": ["Readex Pro", "ui-sans-serif"]
      },
    },
  },
  plugins: [],
}

