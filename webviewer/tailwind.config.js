const { createThemes } = require("tw-colors")

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // colors: {
      //   "darkest": "rgb(var(--color-darkest) / 1)",
      //   "dark": "var(--color-dark)",
      //   "primary": "var(--color-primary)",
      //   "secondary": "var(--color-secondary)",
      //   "brightest": "var(--color-brightest)",
      //   "on-primary": "var(--color-on-primary)",
      //   "colborder": "var(--color-colborder)",
      //   "muted": "var(--color-muted)"
      // },
      fontFamily: {
        "sans": ["Readex Pro", "ui-sans-serif"]
      },
    },
  },
  plugins: [
    createThemes({
      lime: {
        'primary': '#22C55E',
        'darkest': '#0C0A09',
        'dark': '#1C1917',
        'colborder': '#27272a',
        'secondary': '#262626',
        'brightest': '#F2F2F2',
        'on-primary': '#F2F2F2',
        'muted': '#A1A1AA',
      },
      pumpkin: {
        'primary': '#c27d00',
        'darkest': '#0C0A09',
        'dark': '#1C1917',
        'colborder': '#27272a',
        'secondary': '#262626',
        'brightest': '#F2F2F2',
        'on-primary': '#F2F2F2',
        'muted': '#A1A1AA',
      },
      pink: {
        'primary': '#FF69B4',
        'darkest': 'rgb(12,10,9)',
        'dark': '#1E071B',
        'colborder': '#2F0D2A',
        'secondary': '#262626',
        'brightest': '#F2F2F2',
        'on-primary': '#F2F2F2',
        'muted': '#A1A1AA',
      },
      blackandwhite: {
        'primary': '#fff',
        'darkest': '#0C0C0C',
        'dark': '#222222',
        'colborder': '#252525',
        'secondary': '#262626',
        'brightest': '#F2F2F2',
        'on-primary': '#0C0A09',
        'muted': '#A1A1AA',
      },
      aqua: {
        'primary': '#22929c',
        'darkest': '#0C0A09',
        'dark': '#121124',
        'colborder': '#1a1a1a',
        'secondary': '#262626',
        'brightest': '#F2F2F2',
        'on-primary': '#F2F2F2',
        'muted': '#A1A1AA',
      },
      bright: {
        'primary': '#ff0000',
        'darkest': '#fff',
        'dark': '#d2d2d2',
        'colborder': '#d2d2d2',
        'secondary': '#262626',
        'brightest': '#111',
        'on-primary': '#111',
        'muted': '#595959',
      },
      rainbow: {
        'primary': 'rgba(250,250,250,0.6)',
        'darkest': '#000',
        'dark': '#121124',
        'colborder': 'rgba(0,0,0,0)',
        'secondary': '#262626',
        'brightest': '#d5d5d5',
        'on-primary': '#393939',
        'muted': '#bfbfbf',
      },
    })
  ],
}

