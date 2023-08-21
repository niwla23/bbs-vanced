import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config';
import path from "path"

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globIgnores: ["**/*", "*", "**"]
      },
      injectRegister: 'script',
      manifest: {
        name: "BBS Viewer",
        short_name: "BBS Viewer",
        description: "zeigt dir den stundenplan",
        theme_color: "#22C55E",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
