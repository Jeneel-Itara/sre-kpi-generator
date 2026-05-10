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

  // SLA thresholds in seconds. Incidents where MTTR > threshold are IMR-breached.
  slaThresholds: {
    'Severity 1': 5  * 60,   // 300s
    'Severity 2': 10 * 60,   // 600s
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
  if (patch.sla_sev1 !== undefined) config.slaThresholds['Severity 1'] = Number(patch.sla_sev1) * 60
  if (patch.sla_sev2 !== undefined) config.slaThresholds['Severity 2'] = Number(patch.sla_sev2) * 60
  if (patch.showSkippedCount !== undefined) config.showSkippedCount = Boolean(patch.showSkippedCount)
}

export function getPublicConfig() {
  return {
    sla_sev1: config.slaThresholds['Severity 1'] / 60,
    sla_sev2: config.slaThresholds['Severity 2'] / 60,
    showSkippedCount: config.showSkippedCount,
  }
}
