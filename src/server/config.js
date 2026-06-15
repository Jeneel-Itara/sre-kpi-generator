/**
 * config.js — runtime-mutable configuration store.
 * Settings changed via the UI /api/settings endpoint take effect immediately
 * for all subsequent KPI calculations — no restart needed.
 */

export const config = {
  // Severity mapping: input value (lowercase) → display label
  // Only severities listed here are processed; all others are silently skipped.
  severityMap: {
    sev1: 'Severity 1',
    sev2: 'Severity 2',
    p1:   'Severity 1',
    p2:   'Severity 2',
  },



  // Shift windows (24h time)
  shiftWindows: {
    day:   { start: 8,  end: 20 },   // 08:00 – 20:00
    night: { start: 20, end: 8  },   // 20:00 – 08:00 (crosses midnight)
  },

  // Display
  showSkippedCount: true,
}

export function updateConfig(patch) {
  if (patch.showSkippedCount !== undefined) config.showSkippedCount = Boolean(patch.showSkippedCount)
}

export function getPublicConfig() {
  return {
    showSkippedCount: config.showSkippedCount,
  }
}
