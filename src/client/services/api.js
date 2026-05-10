/**
 * api.js — all requests go to /api/* on the same origin.
 * No backend URL to configure. Works in dev (Vite proxies to :3000)
 * and in production (Express serves everything).
 */

export async function uploadFile(file, filters = {}) {
  const form = new FormData()
  form.append('file', file)
  if (filters.shift)     form.append('shift', filters.shift)
  if (filters.date_from) form.append('date_from', filters.date_from)
  if (filters.date_to)   form.append('date_to', filters.date_to)

  const res = await fetch('/api/kpi/generate', { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

export async function getSettings() {
  const res = await fetch('/api/settings')
  return res.json()
}

export async function saveSettings(settings) {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to save settings')
  return data
}
