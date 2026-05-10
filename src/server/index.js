/**
 * index.js — local dev/production server entry point.
 * Imports the Express app and adds static file serving + listen.
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import app from './app.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const DIST = join(ROOT, 'dist')

// Serve built React app in production
if (existsSync(DIST)) {
  const { default: express } = await import('express')
  app.use(express.static(DIST))
  app.get('*', (req, res) => res.sendFile(join(DIST, 'index.html')))
} else {
  app.get('/', (req, res) => res.send('<p>Run <code>npm run build</code> first, or start Vite separately.</p>'))
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`\x1b[32m✓ SRE KPI Generator → http://localhost:${PORT}\x1b[0m`)
})
