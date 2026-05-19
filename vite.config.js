import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'src/client',
  // GitHub Pages serves from /<repo-name>/ — update this to match your repo name.
  // For a user/org site (username.github.io) set base: '/'
  base: '/sre-kpi-generator/',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // proxy only used in local dev with the Express server
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
