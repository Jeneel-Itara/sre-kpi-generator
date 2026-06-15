/**
 * config.js — client-side configuration store backed by localStorage.
 * Replaces the server-side config for GitHub Pages deployment.
 */

const STORAGE_KEY = 'kpi_settings'

const defaults = {
  severityMap: {
    sev1: 'Severity 1',
    sev2: 'Severity 2',
    p1:   'Severity 1',
    p2:   'Severity 2',
  },

  shiftWindows: {
    day:   { start: 8,  end: 20 },
    night: { start: 20, end: 8  },
  },
  showSkippedCount: true,
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaults }
    const saved = JSON.parse(raw)
    return {
      ...defaults,
      showSkippedCount: saved.showSkippedCount ?? defaults.showSkippedCount,
    }
  } catch {
    return { ...defaults }
  }
}

export const config = load()

export function getPublicConfig() {
    showSkippedCount: config.showSkippedCount,
  }
}

export function updateConfig(patch) {
  if (patch.showSkippedCount !== undefined) config.showSkippedCount = Boolean(patch.showSkippedCount)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      showSkippedCount: config.showSkippedCount,
    }))
  } catch {}
  return getPublicConfig()
}
