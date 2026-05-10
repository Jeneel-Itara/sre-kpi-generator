/**
 * kpi.js — deterministic KPI calculation engine.
 * Same input always produces same output. No AI, no heuristics.
 */

import { config } from './config.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Format total seconds as H:MM:SS */
export function secondsToHms(totalSeconds) {
  const s = Math.round(Math.abs(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

/** Parse a cell value to a JS Date. Returns null if unparseable. */
function parseDate(value) {
  if (value == null || value === '') return null
  // xlsx gives us JS Date objects for date cells; strings otherwise
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

/** Get hour (0-23) from a Date in local time */
function hourOf(date) {
  return date.getHours() + date.getMinutes() / 60
}

// ── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate and partition rows.
 * Returns { validRows, rejectedRows, skippedCount }
 *
 * - Rows with blank/sev3/unknown severity → silently skipped (not rejected)
 * - Rows with real data errors → rejected with reason
 * - Everything else → valid
 */
export function validateRows(rows) {
  const required = ['Team Name', 'Counter ID', 'Severity', 'Created (IST)', 'ACK At (IST)', 'Resolved At (IST)']

  // Column check
  if (rows.length === 0) return { validRows: [], rejectedRows: [], skippedCount: 0 }
  const cols = Object.keys(rows[0])
  const missing = required.filter(c => !cols.includes(c))
  if (missing.length > 0) {
    throw new Error(`Missing columns: ${missing.join(', ')}`)
  }

  const validRows = []
  const rejectedRows = []
  let skippedCount = 0
  const seenIds = new Set()

  rows.forEach((row, idx) => {
    const rowNum = idx + 2 // 1-based + header

    const sevRaw = String(row['Severity'] ?? '').trim().toLowerCase()

    // Silently skip non-tracked severities (blank, sev3, unknown)
    if (!config.severityMap[sevRaw]) {
      skippedCount++
      return
    }

    const counterId = String(row['Counter ID'] ?? '').trim()

    // Real validation errors
    if (!counterId) {
      rejectedRows.push({ row_index: rowNum, counter_id: null, reason: 'Missing Counter ID' })
      return
    }
    if (seenIds.has(counterId)) {
      rejectedRows.push({ row_index: rowNum, counter_id: counterId, reason: `Duplicate Counter ID: ${counterId}` })
      return
    }

    const created  = parseDate(row['Created (IST)'])
    const ack      = parseDate(row['ACK At (IST)'])
    const resolved = parseDate(row['Resolved At (IST)'])

    if (!created)  { rejectedRows.push({ row_index: rowNum, counter_id: counterId, reason: 'Invalid Created (IST) timestamp' }); return }
    if (!ack)      { rejectedRows.push({ row_index: rowNum, counter_id: counterId, reason: 'Invalid ACK At (IST) timestamp' }); return }
    if (!resolved) { rejectedRows.push({ row_index: rowNum, counter_id: counterId, reason: 'Invalid Resolved At (IST) timestamp' }); return }
    if (ack < created)      { rejectedRows.push({ row_index: rowNum, counter_id: counterId, reason: 'ACK timestamp precedes Created timestamp' }); return }
    if (resolved < created) { rejectedRows.push({ row_index: rowNum, counter_id: counterId, reason: 'Resolved timestamp precedes Created timestamp' }); return }

    seenIds.add(counterId)
    validRows.push({
      team:     String(row['Team Name'] ?? '').trim(),
      severity: config.severityMap[sevRaw],
      counterId,
      created,
      ack,
      resolved,
      mttaSeconds: (ack - created) / 1000,
      mttrSeconds: (resolved - created) / 1000,
    })
  })

  return { validRows, rejectedRows, skippedCount }
}

// ── Filters ──────────────────────────────────────────────────────────────────

export function applyShiftFilter(rows, shift) {
  if (!shift) return rows
  const { start, end } = config.shiftWindows[shift]
  return rows.filter(row => {
    const h = hourOf(row.created)
    if (shift === 'day')   return h >= start && h < end
    if (shift === 'night') return h >= start || h < end
    return true
  })
}

export function applyDateFilter(rows, dateFrom, dateTo) {
  if (!dateFrom && !dateTo) return rows
  return rows.filter(row => {
    const d = row.created
    if (dateFrom) {
      const from = new Date(dateFrom)
      from.setHours(0, 0, 0, 0)
      if (d < from) return false
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      if (d > to) return false
    }
    return true
  })
}

// ── KPI generation ───────────────────────────────────────────────────────────

function determineImr(mttrSeconds, severity) {
  const threshold = config.slaThresholds[severity]
  if (threshold == null) return 'IMR not applicable'
  return mttrSeconds > threshold
    ? 'IMR required (SLA breached)'
    : 'IMR not created as per alert resolution criteria.'
}

export function generateOverallTable(rows) {
  const trackedSeverities = [...new Set(Object.values(config.severityMap))]
    .sort() // Severity 1, Severity 2

  return trackedSeverities.map(sev => {
    const group = rows.filter(r => r.severity === sev)
    if (group.length === 0) {
      return { Severity: sev, 'Total Incidents': '--', MTTA: '--', MTTR: '--', 'Updates Adherence': '--', 'Playbook Adherence': '--', IMR: '--' }
    }

    const avgMtta = group.reduce((s, r) => s + r.mttaSeconds, 0) / group.length
    const avgMttr = group.reduce((s, r) => s + r.mttrSeconds, 0) / group.length
    const threshold = config.slaThresholds[sev]
    const breachCount = threshold != null ? group.filter(r => r.mttrSeconds > threshold).length : 0

    return {
      Severity: sev,
      'Total Incidents': group.length,
      MTTA: secondsToHms(avgMtta),
      MTTR: secondsToHms(avgMttr),
      'Updates Adherence': '--',
      'Playbook Adherence': '--',
      IMR: breachCount > 0
        ? `${breachCount} incident(s) breached SLA`
        : 'IMR not created as per alert resolution criteria.',
    }
  })
}

export function generateCustomerTable(rows) {
  // Group by team + severity
  const groups = {}
  rows.forEach(row => {
    const key = `${row.team}|||${row.severity}`
    if (!groups[key]) groups[key] = []
    groups[key].push(row)
  })

  return Object.entries(groups).map(([key, group]) => {
    const [team, severity] = key.split('|||')
    const avgMtta = group.reduce((s, r) => s + r.mttaSeconds, 0) / group.length
    const avgMttr = group.reduce((s, r) => s + r.mttrSeconds, 0) / group.length
    const threshold = config.slaThresholds[severity]
    const breachCount = threshold != null ? group.filter(r => r.mttrSeconds > threshold).length : 0

    return {
      Team: team,
      Severity: severity,
      'Total Incidents': group.length,
      MTTA: secondsToHms(avgMtta),
      MTTR: secondsToHms(avgMttr),
      IMR: breachCount > 0
        ? `${breachCount} incident(s) breached SLA`
        : 'IMR not created as per alert resolution criteria.',
    }
  })
}
