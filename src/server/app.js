/**
 * app.js — Express app (no listen call).
 * Imported by index.js (local) and api/index.js (Vercel).
 */

import express from 'express'
import multer from 'multer'
import * as XLSX from 'xlsx'

import { updateConfig, getPublicConfig } from './config.js'
import { validateRows, applyShiftFilter, applyDateFilter, generateOverallTable, generateCustomerTable } from './kpi.js'

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })

app.use(express.json())

app.get('/api/settings', (req, res) => {
  res.json(getPublicConfig())
})

app.post('/api/settings', (req, res) => {
  try {
    updateConfig(req.body)
    res.json({ ok: true, settings: getPublicConfig() })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/kpi/generate', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

    const { shift, date_from, date_to } = req.body

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null })

    const totalRows = rawRows.length
    const { validRows, rejectedRows, skippedCount } = validateRows(rawRows)
    const filtered = applyDateFilter(applyShiftFilter(validRows, shift || null), date_from || null, date_to || null)

    res.json({
      overall_table:  generateOverallTable(filtered),
      customer_table: generateCustomerTable(filtered),
      rejected_rows:  rejectedRows,
      meta: {
        total_rows:     totalRows,
        valid_rows:     validRows.length,
        skipped_count:  skippedCount,
        rejected_count: rejectedRows.length,
        shift_filter:   shift || null,
        date_range:     (date_from || date_to) ? `${date_from || '?'} to ${date_to || '?'}` : null,
      },
    })
  } catch (err) {
    res.status(422).json({ error: err.message })
  }
})

export default app
