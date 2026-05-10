import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../App.jsx'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

function exportToCsv(data, filename) {
  const headers = Object.keys(data[0])
  const esc = v => { const s = String(v ?? ''); return (s.includes(',') || s.includes('"') || s.includes('\n')) ? `"${s.replace(/"/g, '""')}"` : s }
  const csv = [headers.map(esc).join(','), ...data.map(r => headers.map(h => esc(r[h])).join(','))].join('\r\n')
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `${filename}.csv` })
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
}

function exportToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'KPI')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

async function exportToPng(tableRef, filename, bgColor) {
  if (!tableRef?.current) return
  const canvas = await html2canvas(tableRef.current, { backgroundColor: bgColor, scale: 2 })
  canvas.toBlob(blob => {
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${filename}.png` })
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  })
}

export default function ExportMenu({ data, tableRef, filename }) {
  const T = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const items = [
    { label: 'CSV',   action: () => { exportToCsv(data, filename); setOpen(false) } },
    { label: 'Excel', action: () => { exportToExcel(data, filename); setOpen(false) } },
    { label: 'PNG',   action: async () => {
      setOpen(false)
      if (data.length > 200 && !window.confirm('Table has 200+ rows. PNG export may be slow. Continue?')) return
      await exportToPng(tableRef, filename, T.surface)
    }},
  ]

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(p => !p)}
        style={{ background: T.surface2, border: `1px solid ${T.border}`, color: T.textDim, padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = T.textMid}
        onMouseLeave={e => e.currentTarget.style.color = T.textDim}>
        Export
        <svg style={{ width: 10, height: 10 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, marginTop: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: T.shadowLg, minWidth: 100, overflow: 'hidden', zIndex: 30 }}>
          {items.map(({ label, action }) => (
            <button key={label} onClick={action}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', fontSize: 12, color: T.textMid, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.1s' }}
              onMouseEnter={e => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.text }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = T.textMid }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
