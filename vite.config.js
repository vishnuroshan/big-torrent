import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // qBittorrent's alternative WebUI requires index.html inside a "public"
    // subfolder of the configured root, not at the root itself.
    outDir: 'dist/public',
  },
})
