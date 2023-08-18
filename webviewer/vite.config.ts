import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vitest/config';
import path from "path"

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      registerType: "autoUpdate",
      injectRegister: 'auto',
      manifest: {
        name: "BBS Viewer",
        short_name: "BBS Viewer",
        description: "zeigt dir den stundenplan",
        theme_color: "#14b8a5",
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
