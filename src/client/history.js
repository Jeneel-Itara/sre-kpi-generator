/**
 * history.js — shift report history stored in localStorage.
 * Keeps the last 20 reports. Each entry stores the full result
 * so reports can be re-viewed without re-uploading.
 */

const KEY = 'kpi_history'
const MAX = 20

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveToHistory(entry) {
  try {
    const history = loadHistory()
    // Prepend newest first
    const updated = [entry, ...history].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(updated))
    return updated
  } catch { return [] }
}

export function deleteFromHistory(id) {
  try {
    const updated = loadHistory().filter(e => e.id !== id)
    localStorage.setItem(KEY, JSON.stringify(updated))
    return updated
  } catch { return [] }
}

export function clearHistory() {
  try { localStorage.removeItem(KEY) } catch {}
}
