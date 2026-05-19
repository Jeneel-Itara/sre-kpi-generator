/**
 * api.js — fully client-side implementation for GitHub Pages.
 * All processing happens in the browser using xlsx.
 * No server required.
 */

import * as XLSX from 'xlsx'
import { validateRows, applyShiftFilter, applyDateFilter, generateOverallTable, generateCustomerTable } from '../lib/kpi.js'
import { getPublicConfig, updateConfig as _updateConfig } from '../lib/config.js'

export async function uploadFile(file, filters = {}) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null })

  const totalRows = rawRows.length
  const { validRows, rejectedRows, skippedCount } = validateRows(rawRows)
  const filtered = applyDateFilter(
    applyShiftFilter(validRows, filters.shift || null),
    filters.date_from || null,
    filters.date_to   || null,
  )

  return {
    overall_table:  generateOverallTable(filtered),
    customer_table: generateCustomerTable(filtered),
    rejected_rows:  rejectedRows,
    meta: {
      total_rows:     totalRows,
      valid_rows:     validRows.length,
      skipped_count:  skippedCount,
      rejected_count: rejectedRows.length,
      shift_filter:   filters.shift || null,
      date_range:     (filters.date_from || filters.date_to)
        ? `${filters.date_from || '?'} to ${filters.date_to || '?'}`
        : null,
    },
  }
}

export async function getSettings() {
  return getPublicConfig()
}

export async function saveSettings(settings) {
  const updated = _updateConfig(settings)
  return { ok: true, settings: updated }
}
