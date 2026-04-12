import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/SBTI-Gallery/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery/index.html'),
      },
    },
  },
})
