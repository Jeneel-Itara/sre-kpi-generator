/**
 * api/index.js — Vercel serverless entry point.
 * Wraps the Express app so it runs as a Vercel function.
 *
 * NOTE: Because Vercel is stateless, the in-memory config (SLA thresholds)
 * resets between cold starts. Settings saved via the UI will persist for
 * the lifetime of the function instance but not across deployments or
 * cold starts. For persistent settings, add a KV store later.
 */

import app from '../src/server/app.js'

export default app
