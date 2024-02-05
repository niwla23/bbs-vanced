import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vitest/config';
import path from "path"

export default defineConfig({
  plugins: [
    sveltekit(),
    // SvelteKitPWA({
    //   registerType: "autoUpdate",
    //   strategies: 'injectManifest',
    //   devOptions: { enabled: true },
    //   manifest: {
    //     name: "BBS Vanced sda",
    //     short_name: "BBS Vanced",
    //     description: "zeigt dir den stundenplan",
    //     theme_color: "#0C0A09",
    //     icons: [
    //       {
    //         src: "android-chrome-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "android-chrome-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //     screenshots: [
    //       {
    //         src: "screenshots/screen1.jpg",
    //         label: "Stundenplan",
    //         sizes: "1080x2400"
    //       },
    //       {
    //         src: "screenshots/screen2.jpg",
    //         label: "Klausuren",
    //         sizes: "1080x2400"
    //       },
    //       {
    //         src: "screenshots/screen3.jpg",
    //         label: "News",
    //         sizes: "1080x2400"
    //       },
    //       {
    //         src: "screenshots/screen4.jpg",
    //         label: "Einstellungen",
    //         sizes: "1080x2400",
    //       }
    //     ]
    //   },
    //
    // }),
    // VitePWA({
    // })
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
