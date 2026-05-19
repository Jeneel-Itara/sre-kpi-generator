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
  slaThresholds: {
    'Severity 1': 5  * 60,  // 300s
    'Severity 2': 10 * 60,  // 600s
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
      slaThresholds: {
        'Severity 1': saved.sla_sev1 != null ? Number(saved.sla_sev1) * 60 : defaults.slaThresholds['Severity 1'],
        'Severity 2': saved.sla_sev2 != null ? Number(saved.sla_sev2) * 60 : defaults.slaThresholds['Severity 2'],
      },
      showSkippedCount: saved.showSkippedCount ?? defaults.showSkippedCount,
    }
  } catch {
    return { ...defaults }
  }
}

export const config = load()

export function getPublicConfig() {
  return {
    sla_sev1: config.slaThresholds['Severity 1'] / 60,
    sla_sev2: config.slaThresholds['Severity 2'] / 60,
    showSkippedCount: config.showSkippedCount,
  }
}

export function updateConfig(patch) {
  if (patch.sla_sev1 !== undefined) config.slaThresholds['Severity 1'] = Number(patch.sla_sev1) * 60
  if (patch.sla_sev2 !== undefined) config.slaThresholds['Severity 2'] = Number(patch.sla_sev2) * 60
  if (patch.showSkippedCount !== undefined) config.showSkippedCount = Boolean(patch.showSkippedCount)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sla_sev1: config.slaThresholds['Severity 1'] / 60,
      sla_sev2: config.slaThresholds['Severity 2'] / 60,
      showSkippedCount: config.showSkippedCount,
    }))
  } catch {}
  return getPublicConfig()
}
